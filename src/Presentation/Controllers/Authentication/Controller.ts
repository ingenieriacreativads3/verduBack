
import { Router, Request, Response, NextFunction } from 'express'
import { Model, Document, Schema } from 'mongoose'
import { injectable, inject, named } from 'inversify';

import TYPES from './../../../TYPES';
import container from './../../../inversify.config';

import Patheable from '../Ports/Patheable'
import Routeable from '../Ports/Routeable'
import Responseable from '../Responseable'
import DomainResponseable from '../../../Domain/Entities/Util/Ports/Responseable'

import Validateable from '../../../Domain/Middleware/Ports/Validateable'
import Validable from '../../../Domain/Entities/Util/Ports/Validable'

import Authenticable from '../../../Aplication/Services/Ports/Authenticable'

import SesssionServiceable from './../../../Domain/Entities/Session/Ports/Serviceable'
import Logueable from '../../../Domain/Entities/User/Ports/Logueable'
import Registrable from '../../../Domain/Entities/User/Ports/Registrable'

import Schemable from '../../../Domain/Entities/Util/Ports/Schemable'

import GeteableModel from '../../../Infrastructure/Persistence/Ports/GeteableModel'

import SessionInterface from './../../../Domain/Entities/Session/Interface'

import SessionBuilderable from './../../../Domain/Entities/Session/Ports/Builderable'


@injectable()
export default class Controller implements Routeable, Patheable {

	public router: Router = container.get<Router>(TYPES.Router)
	public path: string = '/auth'
	private validationProvider: Validateable = container.get<Validateable>(TYPES.Validateable)
	@inject(TYPES.Responseable) private responserService: Responseable
	
	@inject(TYPES.GeteableModel) private connectionProvider: GeteableModel
	@inject(TYPES.Authenticable) private authenticationService: Authenticable
	@inject(TYPES.SessionServiceableDomain) private sessionService: SesssionServiceable
	
	@inject(TYPES.Schemable) @named(TYPES.User) private userSchema: Schemable
	@inject(TYPES.Schemable) @named(TYPES.Company) private companySchema: Schemable
	@inject(TYPES.Schemable) @named(TYPES.Session) private sessionSchema: Schemable

	@inject(TYPES.Validable) @named(TYPES.Login) private loginDto: Validable
	@inject(TYPES.Validable) @named(TYPES.User) private userDto: Validable
	@inject(TYPES.Validable) @named(TYPES.Session) private sessionDto: Validable

	@inject(TYPES.SessionInterface) private session: SessionInterface

	@inject(TYPES.SessionBuilderable) private sessionBuilder: SessionBuilderable

	constructor() {
		this.initializeRoutes(this.validationProvider)
	}

	private initializeRoutes(validationProvider: Validateable) {
		this.router.post(`${this.path}/register`, [validationProvider.validate(this.userDto)], this.registration);
		this.router.post(`${this.path}/login`, [validationProvider.validate(this.loginDto)], this.loggingIn);
		this.router.post(`${this.path}/logout`, this.loggingOut);
	}

	private registration = async (request: Request, response: Response, next: NextFunction) => {

		const userData: Registrable = request.body;
		const database: any = request.query.database;

		var sessionModel: Model<Document, {}> = await this.connectionProvider.getModel(database, this.sessionSchema.name, this.sessionSchema)
		var companyModel: Model<Document, {}> = await this.connectionProvider.getModel(database, this.companySchema.name, this.companySchema)
		var model: Model<Document, {}> = await this.connectionProvider.getModel(database, this.userSchema.name, this.userSchema)

		if(database && database != '') {
			await this.authenticationService.register(userData, database, model, companyModel)
				.then((res: DomainResponseable) => {
					if (res && res.result !== undefined) {
						this.responserService.res = {
							result: res.result,
							message: res.message,
							status: res.status,
							error: res.error
						}
						
						if(res.status == 200) {
							this.sessionBuilder.getInstance([ sessionModel, res.result.user._id ])
						}
					} else {
						this.responserService.res = { result: 'Nop', message: 'La capa superior contesto undefined', error: '', status: 500 }
					}
				}).catch((err: DomainResponseable) => {
					this.responserService.res = { result: err.result, message: err.message, status: err.status, error: err.error }
				})
		} else {
			this.responserService.res = {
				result: {},
				message: 'Falta indicar a que negocio pertenece',
				status: 428,
				error: 'Agregar el negocio al cual pertenece en la consulta'
			}
		}
		
		if (this.responserService.res.status) {
			response.status(this.responserService.res.status).send(this.responserService.res)
		} else {
			response.status(500).send(this.responserService.res)
		}
	}

	private loggingIn = async (request: Request, response: Response, next: NextFunction) => {

		const logInData: Logueable = request.body;
		const database: any = request.query.database;

		var sessionModel: Model<Document, {}> = await this.connectionProvider.getModel(database, this.sessionSchema.name, this.sessionSchema)

		if(database && database != '') {

			await this.connectionProvider.getModel(database, this.userSchema.name, this.userSchema)
				.then( async (model: Model<Document, {}>) => {
					await this.authenticationService.login(logInData, database, model)
						.then(async (res: DomainResponseable) => {
							if (res && res.result !== undefined) {

								this.responserService.res = {
									result: res.result,
									message: res.message,
									status: res.status,
									error: res.error
								}

								if(res.status == 200) {

									await this.sessionBuilder.getInstance([ sessionModel, res.result.user._id ])
										.then((responseBuilder: DomainResponseable) => {
											if(responseBuilder && responseBuilder !== undefined) {
												if(responseBuilder.status === 200) {
													
													this.session = responseBuilder.result
													this.responserService.res.result.session = this.session

												} else {
													this.responserService.res = { result: res.result, message: res.message, status: res.status, error: res.error }
												}
											} else {
												this.responserService.res = { result: 'Nop', message: 'La capa superior contesto undefined', error: '', status: 500 }
											}
										})
								}
							} else {
								this.responserService.res = { result: 'Nop', message: 'La capa superior contesto undefined', error: '', status: 500 }
							}
						}).catch((err: DomainResponseable) => {
							this.responserService.res = { result: err.result, message: err.message, status: err.status, error: err.error }
						})
				}).catch((err: any) => {
					this.responserService.res = {
						result: 'Nop',
						message: 'Se rompio la libreria',
						error: err,
						status: 500
					}
				})
		} else {
			this.responserService.res = {
				result: {},
				message: 'Indicar a que db corresponde',
				status: 428,
				error: 'No se ha indicado la db'
			}
		}
		
		if (this.responserService.res.status) {
			response.status(this.responserService.res.status).send(this.responserService.res)
		} else {
			response.status(500).send(this.responserService.res)
		}
	}

	private loggingOut = (request: Request, response: Response) => {

		this.responserService.res = {
			result: {
				user: {},
				token: {}
			},
			message: 'Fin de sesión exitoso',
			status: 200,
			error: ''
		}

		if (this.responserService.res.status) {
			response.status(this.responserService.res.status).send(this.responserService.res)
		} else {
			response.status(500).send(this.responserService.res)
		}
	}

}
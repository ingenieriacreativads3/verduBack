

import { NextFunction, Response } from 'express'
import { Model, Document, Schema } from 'mongoose'
import * as jwt from 'jsonwebtoken'
import { injectable, inject, named } from 'inversify';

import container from './../../inversify.config';
import TYPES from './../../TYPES'

import RequestWithUser from '../Ports/RequestWithUser'

import HttpException from '../Exceptions/HttpException'
import AuthenticationTokenMissingException from '../Exceptions/AuthenticationTokenMissingException'
import WrongAuthenticationTokenException from '../Exceptions/WrongAuthenticationTokenException'
import DataStoredInTokenable from './Ports/DataStoredInTokenable'
import config from '../../utils/config'
import DisabledAuthenticationUserException from '../Exceptions/DisabledAuthenticationUserException'

import Authenticateable from './Ports/Authenticateable'
import Controlleable from '../../Domain/Entities/Util/Ports/Controlleable'

import Schemable from '../../Domain/Entities/Util/Model'
import User from '../../Domain/Entities/User/Model'
import Session from '../../Domain/Entities/Session/Model'
import GeteableModel from '../../Infrastructure/Persistence/Ports/GeteableModel'
import ConnectionProvider from '../../Infrastructure/Persistence/ConnectionProvider'
import GeteableById from '../../Domain/Entities/Util/Ports/GeteableById'
 
import Responseable from '../../Presentation/Controllers/Responseable'
import DomainResponseable from '../../Domain/Entities/Util/Ports/Responseable'
import UserInterface from '../../Domain/Entities/User/Interface'
import Responser from '../Controllers/Util/Responser'

import ConnectionableProvider from './../../Infrastructure/Persistence/Ports/ConnectionableProvider'
import Updateable from './../../Domain/Entities/Util/Ports/Updateable'
import GeteableAll from './../../Domain/Entities/Util/Ports/GeteableAll'

import ControllerService from '../../Domain/Entities/Util/Controller'

@injectable()
export default class Authentication implements Authenticateable {

	private responserService: Responseable = container.get<Responseable>(TYPES.Responseable)
	private userSchema: Schemable = container.getNamed<Schemable>(TYPES.Schemable, TYPES.User)
	private sessionSchema: Schemable = container.getNamed<Schemable>(TYPES.Schemable, TYPES.User)
	private updateableService: Updateable = container.get<Updateable>(TYPES.Updateable)
	private geteableAllService: GeteableAll = container.get<GeteableAll>(TYPES.GeteableAll)
	private connectionProvider: ConnectionableProvider = container.get<ConnectionableProvider>(TYPES.ConnectionableProvider)
	private geteableByIdService: GeteableById = container.get<GeteableById>(TYPES.GeteableById)

	public async authenticate(request: RequestWithUser, response: Response, next: NextFunction): Promise<void> {

		let responserService = new Responser()
		let nextBool: boolean = false

		if (request.headers && request.headers.authorization) {
			let token = request.headers.authorization.replace(/['"]+/g, '');
			// let session = request.headers.session
			// console.log(session)
			const secret = config.TOKEN_SECRET;
			let verificationResponse: DataStoredInTokenable

			try {
				verificationResponse = jwt.verify(token, secret) as DataStoredInTokenable;
			} catch (err) {
				responserService.res = {
					result: 'Nop',
					message: 'Vuelva a iniciar sesión',
					error: err,
					status: 401
				}
			}

			if(verificationResponse && verificationResponse._id && verificationResponse.database) {
				
				const id = verificationResponse._id;
				const database: string = verificationResponse.database;
				

				const userSchema: Schemable = new User()
				const sessionSchema: Schemable = new Session()

				var userModel: Model<Document, {}> = await new ConnectionProvider().getModel(database, userSchema.name, userSchema)
				var sessionModel: Model<Document, {}> = await new ConnectionProvider().getModel(database, sessionSchema.name, sessionSchema)

				let controllerService: Controlleable = new ControllerService()

				await controllerService.getById(id, userModel, userModel)
					.then(async (res: DomainResponseable) => {
						if(res && res.result !== undefined) {
							let user: UserInterface = res.result
							if(user.enabled) {
								request.user = user;
								request.database = database;
								nextBool = true

								let match = {
									creationUser: {
										$oid: user._id
									}
								}

								await controllerService.getAll(sessionModel, {}, match, {}, {}, 1, 0)
									.then(async (res: DomainResponseable) => {
										await controllerService.update(res.result._id, {}, sessionModel, sessionModel, user._id)
									})

								next()
							} else {
								responserService.res = {
									result: 'Nop',
									message: 'Usuario bloqueado',
									error: 'El usuario con el que intenta loguearse está bloqueado',
									status: 423
								}
							}
						} else {
							responserService.res = { result: 'Nop', message: 'La capa superior contesto undefined', error: '', status: 500 }
						}
					}).catch((err: DomainResponseable) => {
						responserService.res = { result: err.result, message: err.message, error: err.error, status: err.status }
					})

			} else {
				responserService.res = {
					result: 'Nop',
					message: 'Credenciales inválidas',
					error: 'La credenciales se han vencido',
					status: 401
				}
			}
		} else {
			responserService.res = {
				result: 'Nop',
				message: 'Vuelva a iniciar sesión',
				error: 'Credenciales no provistas',
				status: 401
			}
		}
		if(!nextBool) {
			response.status(responserService.res.status).send(responserService.res)
		}
	}
}
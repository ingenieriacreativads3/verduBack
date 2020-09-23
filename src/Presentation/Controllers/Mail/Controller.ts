import { Router, Response, NextFunction } from 'express'
import { Model, Document } from 'mongoose'
var nodemailer = require("nodemailer")
var path = require("path")

import Routeable from '../Ports/Routeable'
import Patheable from '../Ports/Patheable'
import Responseable from '../Responseable'
import DomainResponseable from '../../../Domain/Entities/Util/Ports/Responseable'

import RequestWithUser from '../../Ports/RequestWithUser'

import Authenticateable from '../../Middlewares/Ports/Authenticateable'

import ConnectionableProvider from '../../../Infrastructure/Persistence/Ports/ConnectionableProvider'

import Validateable from '../../../Domain/Middleware/Ports/Validateable'
import Schemable from '../../../Domain/Entities/Util/Ports/Schemable'
import Controlleable from '../../../Domain/Entities/Util/Ports/Controlleable'

import ObjInterface from '../../../Domain/Entities/Mail/Interface'
import Serviceable from '../../../Domain/Entities/Mail/Ports/Serviceable'

//TODO resolver esta dependencia
import Dto from '../../../Domain/Entities/Mail/Dto'

export default class Controller implements Routeable, Patheable {

	public router: Router
	public path: string = '/mail'
	private validationProvider: Validateable
	private authMid: Authenticateable
	private connectionProvider: ConnectionableProvider
	private schema : Schemable
	private controllerService: Controlleable
	private service: Serviceable
	private responserService: Responseable

	constructor(
		router: Router,
		validationProvider: Validateable,
		authenticationMiddleware: Authenticateable,
		connectionProvider: ConnectionableProvider,
		schema : Schemable,
		controllerService: Controlleable,
		service: Serviceable,
		responserService: Responseable
	) {

		this.router = router
		this.validationProvider = validationProvider
		this.authMid = authenticationMiddleware
		this.connectionProvider = connectionProvider
		this.schema = schema
		this.controllerService = controllerService
		this.service = service
		this.responserService = responserService

		this.initializeRoutes(this.validationProvider);
	}

	initializeRoutes(validationProvider: Validateable) {
		this.router
			.get(this.path, [this.authMid.authenticate], this.getAllObjs)
			//.get(`${this.path}/:id`, [this.authMid.authenticate], this.getObjById)
			.post(`${this.path}/send`, [this.authMid.authenticate, validationProvider.validate(Dto)], this.send)
			.post(this.path, [this.authMid.authenticate, validationProvider.validate(Dto)], this.saveObj)
			.put(`${this.path}/:id`, [this.authMid.authenticate, validationProvider.validate(Dto, true)], this.updateObj)
			.delete(`${this.path}/:id`, [this.authMid.authenticate], this.deleteObj);
	}

	private send = async (request: RequestWithUser, response: Response, next: NextFunction) => {

		var objData: ObjInterface = request.body;
		let database: string = request.database

		let from: string = 'robertoberardoinmobilaria@gmail.com'
		let pass: string = 'guille14'

		var nodemailer = require("nodemailer")

		await new Promise(async (resolve, reject) => {
			let transporter = nodemailer.createTransport({
				host: "smtp.gmail.com",
				port: 587,
				secure: false,
				auth: {
					user: from,
					pass: pass,
				},
			});
	
			try {
				transporter.verify(async function(error, success) {
					if (success) {
						await transporter.sendMail({
								from: from,
								to: objData.to,
								subject: objData.subject,
								text: objData.body,
								attachments: [{
									path: path.join('/home/clients/' + database + '/transaction/', objData.folder, objData.nameFile),
								}, ],
							}).then((info) => {
								if (info !== undefined) {
									console.log();
									response.status(200).send({
										result: 'Success',
										message: 'Message send: ' + info.messageId,
										status: 200,
										error: ''
									})
									resolve(info.messageId);
								}
							}).catch((err) => {
								response.status(500).send({
									result: 'Error',
									message: 'No se pudo enviar el mail',
									status: 500,
									error: err.toString()
								})
								reject(err.toString());
							});
					} else {
						response.status(500).send({
							result: 'Error',
							message: 'No se pudo verificar el verificador',
							status: 500,
							error: error.toString()
						})
						reject(error.toString());
					}
				});
			} catch (err) {
				response.status(500).send({
					result: 'Error',
					message: 'No se pudo verificar el verificador',
					status: 500,
					error: err.toString()
				})
				reject(err.toString());
			}
		});
		
	}

	private getAllObjs = async (request: RequestWithUser, response: Response, next: NextFunction) => {

		const model: Model<Document, {}> = await this.connectionProvider.getModel(
			request.database,
			this.schema.name,
			this.schema
		)

		let error;
		let project = {};
		let match = {};
		let sort = {};
		let group = {};
		let limit = 0;
		let skip = 0;

		let recivedProject: any = request.query.project
		let recivedMatch: any = request.query.match
		let recivedSort: any = request.query.sort
		let recivedGroup: any = request.query.group
		let recivedLimit: any = request.query.limit
		let recivedSkip: any = request.query.skip

		if (request.query && request.query !== {}) {
			if (request.query.project) { try { project = JSON.parse(recivedProject); } catch (err) { error = err; } }
			if (request.query.match) { try { match = JSON.parse(recivedMatch); } catch (err) { error = err; } }
			if (request.query.sort) { try { sort = JSON.parse(recivedSort); } catch (err) { error = err; } }
			if (request.query.group) { try { group = JSON.parse(recivedGroup); } catch (err) { error = err; } }
			if (request.query.limit) { try { limit = parseInt(recivedLimit, 10); } catch (err) { error = err; } }
			if (request.query.skip) { try { skip = parseInt(recivedSkip, 10); } catch (err) { error = err; } }
		}

		if (!error) {
			await this.service.getAll(this.controllerService, model, project, match, sort, group, limit, skip)
				.then((res: DomainResponseable) => {
					if(res && res.result !== undefined) {
						if(res.result) {
							this.responserService.res = {
								result: res.result,
								message: res.message,
								status: res.status,
								error: res.error
							}
						} else {
							this.responserService.res = {
								result: [],
								message: 'No existe el res.result',
								status: 500,
								error: 'obj.getAllObjs()'
							}
						}
					} else {
						this.responserService.res = {
							result: [],
							message: 'No existe el res',
							status: 500,
							error: 'obj.getAllObjs()'
						}
					}
				}).catch((err: DomainResponseable) => {
					this.responserService.res = {
						result: err.result,
						message: err.message,
						status: err.status,
						error: err.error
					}
				})
		} else {
			this.responserService.res = {
				result: [],
				message: 'No se puede realizar la consulta',
				status: 428,
				error: 'Error en los parametros enviados'
			}
		}
		if(this.responserService.res.status) {
			response.status(this.responserService.res.status).send(this.responserService.res)
		} else {
			response.status(500).send(this.responserService.res)
		}
	}

	private saveObj = async (request: RequestWithUser, response: Response, next: NextFunction) => {
		
		var model: Model<Document, {}> = await this.connectionProvider.getModel(
			request.database,
			this.schema.name,
			this.schema
		)

		var objData: ObjInterface = request.body;
		const id = request.user._id

		await this.service.save(objData, this.controllerService, model, id)
			.then((res: DomainResponseable) => {
				if(res && res.result !== undefined) {
					this.responserService.res = {
						result: res.result,
						message: res.message,
						status: res.status,
						error: res.error
					}
				} else {
					this.responserService.res = { result: 'Nop', message: 'La capa superior contesto undefined', error: '', status: 500 }
				}
			})
			.catch((err: any) => {
				this.responserService.res = { result: err.result, message: err.message, error: err.error, status: err.status }
			})
		if(this.responserService.res.status) {
			response.status(this.responserService.res.status).send(this.responserService.res)
		} else {
			response.status(500).send(this.responserService.res)
		}
	}

	private updateObj = async (request: RequestWithUser, response: Response, next: NextFunction) => {
		
		var model: Model<Document, {}> = await this.connectionProvider.getModel(
			request.database,
			this.schema.name,
			this.schema
		)

		const id: string = request.params.id;
		const objData: ObjInterface = request.body;
		const idUser: string = request.user._id;

		await this.service.getById(id, model, this.controllerService)
			.then( async (res: DomainResponseable) => {
				if(res && res.result !== undefined) {
					if(res.status === 200) {
						await this.service.update(id, objData, model, this.controllerService, idUser)
							.then((res: DomainResponseable) => {
								if(res && res.result !== undefined) {
									this.responserService.res = {
										result: res.result,
										message: res.message,
										status: res.status,
										error: res.error
									}
								} else {
									this.responserService.res = { result: 'Nop', message: 'La capa superior contesto undefined', error: '', status: 500 }
								}
							}).catch((err: DomainResponseable) => {
								this.responserService.res = { result: err.result, message: err.message, error: err.error, status: err.status }
							})
					} else {
						this.responserService.res = {
							result: res.result,
							message: res.message,
							status: res.status,
							error: res.error
						}
					}
				} else {
					this.responserService.res = { result: 'Nop', message: 'La capa superior contesto undefined', error: '', status: 500 }
				}
			}).catch((err: DomainResponseable) => {
				this.responserService.res = { result: err.result, message: err.message, error: err.error, status: err.status }
			})
		if(this.responserService.res.status) {
			response.status(this.responserService.res.status).send(this.responserService.res)
		} else {
			response.status(500).send(this.responserService.res)
		}
	}

	private deleteObj = async (request: RequestWithUser, response: Response, next: NextFunction) => {

		var model: Model<Document, {}> = await this.connectionProvider.getModel(
			request.database,
			this.schema.name,
			this.schema
		)

		const id: string = request.params.id;
		const idUser: string = request.user._id

		await this.service.getById(id, model, this.controllerService)
			.then( async (getObjById: DomainResponseable) => {
				if(getObjById) {
					let obj = getObjById.result
					obj.operationType = 'D'
					await this.service.update(id, obj, model, this.controllerService, idUser)
						.then((update: DomainResponseable) => {
							if(update) {
								this.responserService.res = {
									result: update.result,
									message: update.message,
									error: update.error,
									status: update.status
								}
							} else {
								this.responserService.res = { result: 'Nop', message: 'La capa superior contesto undefined', error: '', status: 500 }
							}
						}).catch((err: DomainResponseable) => {
							this.responserService.res = { result: err.result, message: err.message, error: err.error, status: err.status }
						})
				} else {
					this.responserService.res = { result: 'Nop', message: 'La capa superior contesto undefined', error: '', status: 500 }
				}
			}).catch((err: DomainResponseable) => {
				this.responserService.res = { result: err.result, message: err.message, error: err.error, status: err.status }
			})
		if(this.responserService.res.status) {
			response.status(this.responserService.res.status).send(this.responserService.res)
		} else {
			response.status(500).send(this.responserService.res)
		}
	}

}
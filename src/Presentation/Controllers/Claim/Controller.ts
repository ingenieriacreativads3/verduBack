import { Router, Response, NextFunction } from 'express'
import { Model, Document } from 'mongoose'
import * as multer from 'multer'

import GeteableClaimStorage from '../Ports/GeteableClaimStorage'
import Routeable from '../Ports/Routeable'
import Patheable from '../Ports/Patheable'
import Responseable from '../Responseable'
import DomainResponseable from '../../../Domain/Entities/Util/Ports/Responseable'

import SendeableCardToTrello from '../../../Aplication/UC/Ports/SendeableCardToTrello'
import TrelloService from './../../../Aplication/UC/Ports/TrelloService'

import RequestWithUser from '../../Ports/RequestWithUser'

import Authenticateable from '../../Middlewares/Ports/Authenticateable'

import ConnectionableProvider from '../../../Infrastructure/Persistence/Ports/ConnectionableProvider'

import Validateable from '../../../Domain/Middleware/Ports/Validateable'
import Schemable from '../../../Domain/Entities/Util/Ports/Schemable'
import Controlleable from '../../../Domain/Entities/Util/Ports/Controlleable'

import ObjInterface from '../../../Domain/Entities/Claim/Interface'
import Serviceable from '../../../Domain/Entities/Claim/Ports/Serviceable'

//TODO resolver esta dependencia
import Dto from '../../../Domain/Entities/Claim/Dto'

export default class Controller implements Routeable, Patheable {

	public router: Router
	public path: string = '/claim'
	private validationProvider: Validateable
	private authMid: Authenticateable
	private connectionProvider: ConnectionableProvider
	private schema : Schemable
	private controllerService: Controlleable
	private service: Serviceable
	private responserService: Responseable

	private storage: GeteableClaimStorage
	private uc: SendeableCardToTrello
	private responserDomainService: DomainResponseable
	private trelloService: TrelloService

	constructor(
		router: Router,
		validationProvider: Validateable,
		authenticationMiddleware: Authenticateable,
		connectionProvider: ConnectionableProvider,
		schema : Schemable,
		controllerService: Controlleable,
		service: Serviceable,
		responserService: Responseable,

		storage: GeteableClaimStorage,
		uc: SendeableCardToTrello,
		responserDomainService: DomainResponseable,
		trelloService: TrelloService
	) {

		this.router = router
		this.validationProvider = validationProvider
		this.authMid = authenticationMiddleware
		this.connectionProvider = connectionProvider
		this.schema = schema
		this.controllerService = controllerService
		this.service = service
		this.responserService = responserService

		this.storage = storage
		this.uc = uc
		this.responserDomainService = responserDomainService
		this.trelloService = trelloService

		this.initializeRoutes(this.validationProvider, this.storage);
	}

	initializeRoutes(validationProvider: Validateable, storage: GeteableClaimStorage) {

		var upload = multer({ storage: storage.getClaimStorage() })

		this.router
			.get(this.path, [this.authMid.authenticate], this.getAllObjs)
			//.get(`${this.path}/:id`, [this.authMid.authenticate], this.getObjById)
			.post(`${this.path}/upload-file-claim/`, [this.authMid.authenticate, upload.single('image')], this.upload)
			.post(this.path, [this.authMid.authenticate, validationProvider.validate(Dto)], this.saveObj)
			.put(`${this.path}/:id`, [this.authMid.authenticate, validationProvider.validate(Dto, true)], this.updateObj)
			.delete(`${this.path}/:id`, [this.authMid.authenticate], this.deleteObj);

	}

	private upload = async (request: RequestWithUser, response: Response, next: NextFunction) => {

		if (request.file && request.file.filename) {
			this.responserService.res = {
				result: request.file.filename,
				message: 'Upload exitoso',
				status: 200,
				error: ''
			}
		} else {
			this.responserService.res = {
				result: 'Nop',
				message: 'No se realizo el upload del archivo',
				status: 500,
				error: 'No se realizo el upload del archivo'
			}
		}
		if(this.responserService.res.status) {
			response.status(this.responserService.res.status).send(this.responserService.res)
		} else {
			response.status(500).send(this.responserService.res)
		}
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

		var objData: ObjInterface = request.body.claim;
		const id = request.user._id

		await this.uc.sendCardToTrello(this.responserDomainService, this.trelloService, objData.name, objData.description, request.database)
			.then((res: DomainResponseable) => {
				console.log('NEW CARD: ' + res.result.shortUrl)
			}).catch((err: DomainResponseable) => {
				console.log(err)
			})

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
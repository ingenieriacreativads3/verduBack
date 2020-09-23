import { Router, Response, NextFunction } from 'express'
import { Model, Document } from 'mongoose'
const Afip = require('@afipsdk/afip.js');

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

import ObjInterface from '../../../Domain/Entities/ElectronicBilling/Interface'
import Serviceable from '../../../Domain/Entities/ElectronicBilling/Ports/Serviceable'

//TODO resolver esta dependencia
import Dto from '../../../Domain/Entities/ElectronicBilling/Dto'

export default class Controller implements Routeable, Patheable {

	public router: Router
	public path: string = '/validate-afip'
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
			//.get(this.path, [this.authMid.authenticate], this.getAllObjs)
			//.get(`${this.path}/:id`, [this.authMid.authenticate], this.getObjById)
			.post(`${this.path}/:id`, [this.authMid.authenticate], this.saveObj)
			.post('/electronicBilling', [], this.saveObj)
			//.put(`${this.path}/:id`, [this.authMid.authenticate, validationProvider.validate(Dto, true)], this.updateObj)
			//.delete(`${this.path}/:id`, [this.authMid.authenticate], this.deleteObj);
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
		
		// TODO arreglar todo esta mer

		// var model: Model<Document, {}> = await this.connectionProvider.getModel(
		// 	request.database,
		// 	this.schema.name,
		// 	this.schema
		// )

		// var objData: ObjInterface = request.body;
		// const id = request.user._id

		// await this.service.getAll( this.controllerService, model, {}, { name: objData.name, operationType: { $ne: 'D' } }, {}, {}, 0, 0)
		// 	.then( async (res: DomainResponseable) => {
		// 		let objs = res.result
		// 		if(objs.length <= 0) {
		// 			await this.service.save(objData, this.controllerService, model, id)
		// 				.then((res: DomainResponseable) => {
		// 					if(res && res.result !== undefined) {
		// 						this.responserService.res = {
		// 							result: res.result,
		// 							message: res.message,
		// 							status: res.status,
		// 							error: res.error
		// 						}
		// 					} else {
		// 						this.responserService.res = { result: 'Nop', message: 'La capa superior contesto undefined', error: '', status: 500 }
		// 					}
		// 				})
		// 				.catch((err: any) => {
		// 					this.responserService.res = { result: err.result, message: err.message, error: err.error, status: err.status }
		// 				})
		// 		} else { 
		// 			this.responserService.res = {
		// 				result: 'Nop',
		// 				message: 'No se pudo realizar el alta',
		// 				status: 428,
		// 				error: 'La entidad con los parametros solicitados, ya existe'
		// 			}
		// 		}
		// 	}).catch((err: any) => {
		// 		this.responserService.res = { result: err.result, message: err.message, error: err.error, status: err.status }
		// 	})


		//php in js
		/*
		let exec = require('child_process').exec
		let cmd = 'php /home/tomas/Documents/projects/inmo/api/src/Presentation/Controllers/ElectronicBilling/index.php'
		exec(cmd, function(error, stdout, stderr) {
			response.status(200).send({
				result: stdout,
				message: 'paso',
				status: 200,
				error: stderr
			})
		})

		*/

		//afipsdk

		const id: string = request.params.id

		let config: any = {
			CUIT: 20293633240,
			production: false,
			cert: 'poscloud1.crt',
			key: 'poscloud1.key',
			res_folder: '/home/tomas/Documents/projects/inmo/api/',
			ta_folder: '/home/tomas/Documents/projects/inmo/api'
		}

		let afip: any = new Afip(config)
		
		const date = new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0];

		let data = {
			'CantReg' 	: 1,  // Cantidad de comprobantes a registrar
			'PtoVta'		: 1,  // Punto de venta
			'CbteTipo' 	: 6,  // Tipo de comprobante (ver tipos disponibles) 
			'Concepto' 	: 1,  // Concepto del Comprobante: (1)Productos, (2)Servicios, (3)Productos y Servicios
			'DocTipo' 	: 99, // Tipo de documento del comprador (99 consumidor final, ver tipos disponibles)
			'DocNro' 		: 0,  // Número de documento del comprador (0 consumidor final)
			'CbteDesde' : 4,  // Número de comprobante o numero del primer comprobante en caso de ser mas de uno
			'CbteHasta' : 4,  // Número de comprobante o numero del último comprobante en caso de ser mas de uno
			'CbteFch' 	: parseInt(date.replace(/-/g, '')), // (Opcional) Fecha del comprobante (yyyymmdd) o fecha actual si es nulo
			'ImpTotal' 	: 121, // Importe total del comprobante
			'ImpTotConc': 0,   // Importe neto no gravado
			'ImpNeto' 	: 100, // Importe neto gravado
			'ImpOpEx' 	: 0,   // Importe exento de IVA
			'ImpIVA' 		: 21,  //Importe total de IVA
			'ImpTrib' 	: 0,   //Importe total de tributos
			'MonId' 		: 'PES', //Tipo de moneda usada en el comprobante (ver tipos disponibles)('PES' para pesos argentinos) 
			'MonCotiz' 	: 1,     // Cotización de la moneda usada (1 para pesos argentinos)  
			'Iva'				: [ // (Opcional) Alícuotas asociadas al comprobante
				{
					'Id' 				: 5, // Id del tipo de IVA (5 para 21%)(ver tipos disponibles) 
					'BaseImp' 	: 100, // Base imponible
					'Importe' 	: 21 // Importe 
				}
			],
		};

		//await afip.ElectronicBilling.getDocumentTypes()
		await afip.ElectronicBilling.getVoucherTypes()
			.then((res: any) => {
				this.responserService.res = {
					result: res,
					message: 'Respuesta de Afip',
					status: 200,
					error: ''
				}
			}).catch((err: any) => {
				this.responserService.res = {
					result: 'res',
					message: 'Respuesta de Afip',
					status: 200,
					error: err.toString()
				}
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
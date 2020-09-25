import { Model, Document, Types } from 'mongoose'
import { injectable } from 'inversify';
import * as moment from 'moment'
import Controlleable from './Ports/Controlleable'
import Dtoable from './Ports/Dtoable'
import TablesRelations from './TablesRelations'
import Responser from './Responser'
import Responseable from './Ports/Responseable'
import Identificable from '../Identificable'
import { lookup } from 'dns';

@injectable()
export default class Controller implements Controlleable {
	
	public BSON: any = require('bson');
	public EJSON: any;
	private responserService: Responseable

	constructor() {
		this.EJSON = this.BSON.EJSON;
		this.responserService = new Responser()
	}

	public async getAll(
		model: Model<Document, {}>,
		project: {} = {},
		match: {} = {},
		sort: {} = {},
		group: {} = {},
		limit: number = 0,
		skip: number = 0
	): Promise<Responseable> {

		return new Promise<Responseable>( async (resolve, reject) => {

			let queryAggregate = [];

			let refs: {
				ref: {},
				name: string
			}[] = []

			// console.log(Object.keys(model.schema.obj))

			try {
				Object.keys(model.schema.obj).map(key => {
	
					Object.keys(model.schema.obj[key]).map(key2 => {
	
						if(key2 === 'ref') {
							refs.push({
								ref: model.schema.obj[key],
								name: key
							})
						}
	
					})
	
				})
				
			} catch (error) {

				console.log(error)
				
			}


			let lookups: {}[] = []

			refs.map((item: {
				ref: {
					ref: string
				},
				name: string
			}) => {
				lookups.push({
					look: {
						from: item.ref.ref,
						localField: item.name,
						foreignField: "_id",
						as: item.name + 'Ref'
					},
					unwin: {
						path: '$' + item.name + 'Ref',
						preserveNullAndEmptyArrays: true
					}
				})
			})

			// {
			// 	from: 'user',
			// 	localField: 'creationUser',
			// 	foreignField: '_id',
			// 	as: 'creationUser'
			// }

			// {
			// 	path: '$creationUser',
			// 	preserveNullAndEmptyArrays: true
			// }

			if (Object.keys(project).length > 0) {

				var relations = new TablesRelations()
				var propertyExist: boolean = false
				var guaranteePropertyExist: boolean = false
				var guaranteePersonExist: boolean = false
				var servicesExist: boolean = false
				var pricingExist: boolean = false
				var roomsExist: boolean = false

				Object.keys(project).map((key: string) => {
					if(key.includes('property')) {
						if(key.includes('property.')) {
							if (relations.exist(key)) {
								queryAggregate.push({ $lookup: { from: relations.getRelations(key).table, foreignField: '_id', localField: relations.getRelations(key).localField, as: relations.getRelations(key).localField } });
								queryAggregate.push({ $unwind: { path: '$' + relations.getRelations(key).localField, preserveNullAndEmptyArrays: true } });
							}
						} else {
							delete project[key]
							propertyExist = true
						}
					} else {
						if (key.includes('guaranteeProperty')) {
							delete project[key]
							guaranteePropertyExist = true
						} else {
							if (key.includes('guaranteePerson')) {
								delete project[key]
								guaranteePersonExist = true
							} else {
								if (key.includes('services')) {
									delete project[key]
									servicesExist = true
								} else {
									if (key.includes('pricing')) {
										delete project[key]
										pricingExist = true
									} else {
										if (key.includes('rooms')) {
											delete project[key]
											roomsExist = true
										} else {
											if (relations.exist(key)) {
												queryAggregate.push({ $lookup: { from: relations.getRelations(key).table, foreignField: '_id', localField: relations.getRelations(key).localField, as: relations.getRelations(key).localField } });
												queryAggregate.push({ $unwind: { path: '$' + relations.getRelations(key).localField, preserveNullAndEmptyArrays: true } });
											}
										}
									}
								}
							}
						}
					}
				})

				if(propertyExist) {
					project = {
						...project,
						property: 1,
						properties: 1
					}
					queryAggregate.push({ $lookup: { from: relations.getRelations('property').table, foreignField: '_id', localField: relations.getRelations('property').localField, as: 'properties' } });
				}

				if(guaranteePropertyExist) {
					project = {
						...project,
						guaranteeProperty: 1
					}
					queryAggregate.push({ $lookup: { from: relations.getRelations('guaranteeProperty').table, foreignField: '_id', localField: relations.getRelations('guaranteeProperty').localField, as: 'guaranteeProperty' } });
				}

				if(guaranteePersonExist) {
					project = {
						...project,
						guaranteePerson: 1
					}
					queryAggregate.push({ $lookup: { from: relations.getRelations('guaranteePerson').table, foreignField: '_id', localField: relations.getRelations('guaranteePerson').localField, as: 'guaranteePerson' } });
				}

				if(servicesExist) {
					project = {
						...project,
						services: 1,
						servicesAux: 1
					}
					queryAggregate.push({ $lookup: { from: relations.getRelations('service').table, foreignField: '_id', localField: relations.getRelations('service').localField, as: 'servicesAux' } });
				}

				if(pricingExist) {
					project = {
						...project,
						pricing: 1,
						pricingAux: 1
					}
					queryAggregate.push({ $lookup: { from: relations.getRelations('pricing').table, foreignField: '_id', localField: relations.getRelations('pricing').localField, as: 'pricingAux' } });
				}

				if(pricingExist) {
					project = {
						...project,
						rooms: 1,
						roomsAux: 1
					}
					queryAggregate.push({ $lookup: { from: relations.getRelations('rooms').table, foreignField: '_id', localField: 'rooms.type', as: 'roomsAux' } });
				}
				
				if (Object.keys(sort).length > 0) queryAggregate.push({ $sort: sort });

				

				queryAggregate.push({ $project: project });
			} else {
				if (Object.keys(sort).length > 0) queryAggregate.push({ $sort: sort });
			}

			lookups.map((look: {
				look: {},
				unwin: {}
			}) => {
				queryAggregate.push({
					$lookup: look.look
				})
				queryAggregate.push({
					$unwind: look.unwin
				})
			})

			if (Object.keys(match).length > 0) queryAggregate.push({ $match: match });
			if (Object.keys(group).length > 0) queryAggregate.push({ $group: group });

			if (limit > 0) queryAggregate.push({ $limit: limit });
			if (skip > 0)	queryAggregate.push({ $skip: skip });

			// queryAggregate.push({
			// 	$lookup
			// })
			
			// console.log(queryAggregate);

			queryAggregate = this.EJSON.parse(JSON.stringify(queryAggregate));

			if (queryAggregate.length === 0) queryAggregate.push({ $limit: 10 });

			if(model !== undefined) {
				await model.aggregate(queryAggregate)
					.then(async (result: any) => {

						// model.populate([], {})


						
						if(result.length === 0) {
							if(limit === 1) {
								this.responserService = { result: {}, message: 'Consulta exitosa', error: '', status: 200 }
							} else {
								this.responserService = { result: [], message: 'Consulta exitosa', error: '', status: 200 }
							}
						} else {
							if(limit === 1) {
								this.responserService = { result: result[0], message: 'Consulta exitosa', error: '', status: 200 }
							} else {
								this.responserService = { result: result, message: 'Consulta exitosa', error: '', status: 200 }
							}
						}
						//console.log(result)
						resolve(this.responserService)
					}).catch((err: any) => {
						this.responserService = { result: 'Nop', message: 'No se pudo realizar la consulta1', error: err, status: 500 }
						reject(this.responserService)
					});
			} else {
				this.responserService = { result: 'Nop', message: 'No se pudo realizar la consulta', error: 'Some /entities/util/getAll/return/if(model)', status: 500 }
				reject(this.responserService)
			}
		});
	}

	public async getById(
		id: string,
		model: Model<Document, {}>,
		userModel: Model<Document, {}>
	): Promise<Responseable> {

		return new Promise<Responseable>(async (resolve, reject) => {
			if (Types.ObjectId.isValid(id)) {
				await model.findById(id)
					.then((res: any) => {
						if(res) {
							this.responserService = {
								result: res,
								message: 'Consulta exitosa',
								error: '',
								status: 200
							}
							resolve(this.responserService)
						} else {
							this.responserService = {
								result: 'Nop',
								message: 'No se pudo realizar la consulta',
								error: 'No existe res',
								status: 500
							}
						}
					}).catch((err: any) => {
						this.responserService = {
							result: 'Nop',
							message: 'La libreria no pudo buscar el objeto por _id',
							error: err,
							status: 500
						}
					})
			} else {
				this.responserService = {
					result: 'Nop',
					message: 'El id enviado no es de tipo _id, segun la libreria',
					error: '',
					status: 428
				}
			}
			reject(this.responserService)
		})
	}

	public async save(
		objData: Dtoable,
		model: Model<Document, {}>,
		userModel: Model<Document, {}>,
		idUser?: string
	): Promise<Responseable> {

		return new Promise<Responseable>(async (resolve, reject) => {

			if(Object.keys(objData).length > 0) {
				Object.keys(objData).map((key: string) => {
					if(typeof objData[key] === 'number') {
						objData[key] = this.roundTo(objData[key], 2)
					}
				})
			}

			delete objData._id

			// console.log('save: ' + model.modelName)
			// console.log(objData)
			
			if (idUser) {
				objData.creationUser = idUser
			}
			//TODO quitar esta dependencia
			objData.creationDate = moment().format('YYYY-MM-DDTHH:mm:ssZ')
			objData.operationType = 'C'

			var createdObj: Document

			try {
				createdObj = new model({ ...objData })
			} catch (err) {
				this.responserService = {
					result: 'Nop',
					message: 'La libreria no pudo crear el nuevo documento',
					error: err,
					status: 500
				}
				reject(this.responserService)
			}

			await createdObj.save()
				.then( async (res: Identificable) => {
					if(res) {
						await this.getById(res._id, model, userModel)
							.then((result: Responseable) => {
								if(result) {
									let obj: Identificable = result.result
									// console.log(obj)
									this.responserService = {
										result: { _id: obj._id },
										message: result.message,
										error: result.error,
										status: result.status
									}
									resolve(this.responserService)
								} else {
									this.responserService = {
										result: 'Nop',
										message: 'La capa superior contesto undefined',
										error: '',
										status: 500
									}
								}
							}).catch((err: Responseable) => {
								this.responserService = {
									result: err.result,
									message: err.message,
									error: err.error,
									status: err.status
								}
							})
					} else {
						this.responserService = {
							result: 'Nop',
							message: 'La capa superior contesto undefined',
							error: '',
							status: 500
						}
					}
				}).catch((err: any) => {
					console.log(err.message)
					this.responserService = {
						result: 'Nop',
						message: err.message,
						error: err,
						status: 500
					}
				})
			reject(this.responserService)
		});
	}

	public async update(
		id: string,
		objData: Dtoable,
		model: Model<Document, {}>,
		userModel: Model<Document, {}>,
		idUser: string
	): Promise<Responseable> {

		// console.log('update: ' + model.modelName)
		// console.log(objData)

		return new Promise<Responseable>(async (resolve, reject) => {

			objData.updateUser = idUser
			objData.updateDate = moment().format('YYYY-MM-DDTHH:mm:ssZ');
			if(objData.operationType !== 'D') {
				objData.operationType = 'U'
			}

			await this.getById(id, model, userModel)
				.then((res: Responseable) => {
					if(res && res.result) {
						objData.creationUser = res.result.creationUser
						objData.creationDate = res.result.creationDate
					} else {
						this.responserService = {
							result: 'Nop',
							message: 'La capa superior contesto undefined, 505',
							error: 'La respuesta no existe',
							status: 500
						}
					}
				}).catch((err: Responseable) => {
					this.responserService = {
						result: err.result,
						message: err.message,
						error: err.error,
						status: err.status
					}
				})

			await model.findByIdAndUpdate(id, objData, { new: true })
				.then( async (doc: Identificable) => {
					if(doc) {
						await this.getById(doc._id, model, userModel)
							.then((res: Responseable) => {
								if(res && res.result) {
									let obj: Identificable = res.result
									// console.log(obj)
									this.responserService = {
										result: { _id: obj._id },
										message: res.message,
										error: res.error,
										status: res.status
									}
									resolve(this.responserService)
								} else {
									this.responserService = {
										result: 'Nop',
										message: 'La capa superior contesto undefined, 506',
										error: 'La respuesta no existe',
										status: 500
									}
								}
							}).catch((err: Responseable) => {
								this.responserService = {
									result: err.result,
									message: err.message,
									error: err.error,
									status: err.status
								}
							})
					} else {
						this.responserService = {
							result: 'Nop',
							message: 'La libreria no contesto la consulta',
							error: 'La respuesta no existe',
							status: 500
						}
					}
				}).catch((err: any) => {
					if (err.code === 11000) {
						this.responserService = {
							result: 'Nop',
							message: 'La entidad con los parametros solicitados, ya existe',
							status: 428,
							error: err.errmsg
						}
					} else {
						this.responserService = {
							result: 'Nop',
							message: 'La libreria no pudo realizar la busqueda y modificacion. Fijate que te olvidaste de pedir el id de uno de los atributos en el typehead, que a su vez, son otra entidad. Otra causa puede ser que quisiste realizar un registro que tiene una relacion, pero el registro no existe. Esto es porque no elegiste nada del dropdown.',
							error: err,
							status: 500
						}
					}
				})
			reject(this.responserService)
		});
	}

	private roundTo(value: number, places: number){
		var power = Math.pow(10, places);
		return Math.round(value * power) / power;
	}	

}
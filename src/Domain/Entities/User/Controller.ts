import { Model, Document } from 'mongoose'
import { injectable, inject, named } from 'inversify';
import { hash, compare } from 'bcryptjs'

import TYPES from './../../../TYPES'

import ObjInterface from './Interface'

import Serviceable from './Ports/Serviceable'
import Registrable from './Ports/Registrable'

import GeteableAll from '../Util/Ports/GeteableAll'
import Saveable from '../Util/Ports/Saveable'
import GeteableById from '../Util/Ports/GeteableById'
import Updateable from '../Util/Ports/Updateable'
import Responseable from '../Util/Ports/Responseable'

@injectable()
export default class Controller implements Serviceable {

	@inject(TYPES.ResponseableDomain) private responserService: Responseable
	@inject(TYPES.Updateable) private updateableService: Updateable
	@inject(TYPES.GeteableAll) private geteableAllService: GeteableAll
	@inject(TYPES.GeteableById) private geteableByIdService: GeteableById
	@inject(TYPES.Saveable) private saveableService: Saveable

	public async update(
		id: string,
		data: {
			password: string
		},
		model: Model<Document, {}>,
		idUser: string
	): Promise<Responseable> {

		return new Promise<Responseable>( async (resolve, reject) => {

			if (data.password !== undefined && data.password !== '') {
				data.password = await hash(data.password, 10)
			}

			await this.updateableService.update(id, data, model, model, idUser)
				.then((res: Responseable) => {
					if(res && res.result !== undefined) {
						this.responserService = {
							result: res.result,
							message: res.message,
							error: res.error,
							status: res.status
						}
						resolve(this.responserService)
					} else {
						this.responserService = {
							result: 'Nop',
							message: 'La capa superior contesto undefined',
							error: '',
							status: 501
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
			reject(this.responserService)
		})
	}

	public async hashPassword(
		pass: string
	): Promise<Responseable> {

		return new Promise<Responseable>( async (resolve, reject) => {

			await hash(pass, 10)
				.then((res: string) => {
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
							message: 'La capa superior constesto undefined',
							error: '',
							status: 501
						}
					}
				}).catch((err: any) => {
					this.responserService = {
						result: 'Nop',
						message: 'No se pudo realizar el hasheo',
						error: err,
						status: 501
					}
				})
			reject(this.responserService)
		})
	}

	public async getById(
		id: string,
		model: Model<Document, {}>,
	): Promise<Responseable> {

		return new Promise<Responseable>( async (resolve, reject) => {

			await this.geteableByIdService.getById(id, model, model)
				.then((res: Responseable) => {
					if(res && res.result !== undefined) {
						this.responserService = {
							result: res.result,
							message: res.message,
							error: res.error,
							status: res.status
						}
						resolve(this.responserService)
					} else {
						this.responserService = {
							result: 'Nop',
							message: 'La capa superior contesto undefined',
							error: '',
							status: 501
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
			reject(this.responserService)
		})
	}

	public async isEnable(
		id: string,
		model: Model<Document, {}>
	): Promise<Responseable> {

		return new Promise<Responseable>( async (resolve, reject) => {

			await this.geteableAllService.getById(id, model, model)
				.then((res: Responseable) => {
					if(res && res.result !== undefined) {
						let user: ObjInterface = res.result
						let isEnable: boolean = false
						if(user.enabled) isEnable = true
						this.responserService = {
							result: isEnable,
							message: res.message,
							error: res.error,
							status: res.status
						}
						resolve(this.responserService)
					} else {
						this.responserService = {
							result: 'Nop',
							message: 'La capa superior contesto undefined',
							error: '',
							status: 501
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
			reject(this.responserService)
		})
	}

	public async isMatch(
		loginPass: string,
		userPass: string
	): Promise<Responseable> {

		return new Promise<Responseable>( async (resolve, reject) => {

			await compare(loginPass, userPass)
				.then((res: boolean) => {
					if(res !== undefined) {
						let isMatch: boolean = false
						if(res) isMatch = true
						this.responserService = {
							result: isMatch,
							message: 'Consulta exitosa',
							error: '',
							status: 200
						}
						resolve(this.responserService)
					} else {
						this.responserService = {
							result: 'Nop',
							message: 'La capa superior contesto undefined',
							error: '',
							status: 501
						}
					}
				}).catch((err: any) => {
					this.responserService = {
						result: 'Nop',
						message: err.message,
						error: err,
						status: 428
					}
				})
			reject(this.responserService)
		})
	}

	public async getUserByEmail(
		email: string,
		model: Model<Document, {}>
	): Promise<Responseable> {

		return new Promise<Responseable>( async (resolve, reject) => {

			await this.geteableAllService.getAll(model, {}, { email: email, operationType: { $ne: 'D' } }, {}, {}, 0, 0)
				.then((res: Responseable) => {
					if(res && res.result !== undefined) {
						if(res.result.length > 0) {
							this.responserService = {
								result: res.result[0],
								message: 'Consulta exitosa',
								error: '',
								status: 200
							}
						} else {
							this.responserService = {
								result: [],
								message: 'Consulta exitosa',
								error: 'No existe un usuario con ese email',
								status: 200
							}
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
						error: err,
						status: err.status
					}
				})
			reject(this.responserService)
		})
	}
	
	public async existUserWithThatEmail(
		email: string,
		model: Model<Document, {}>
	): Promise<Responseable> {

		return new Promise<Responseable>( async (resolve, reject) => {

			
			await this.geteableAllService.getAll(model, {}, { email: email, operationType: { $ne: 'D' } }, {}, {}, 0, 0)
				.then((res: Responseable) => {
					if(res && res.result !== undefined) {
						var exist: boolean = false
						if(res.result.length > 0) exist = true
						this.responserService = {
							result: exist,
							message: 'Consulta exitosa',
							error: '',
							status: 200
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
					reject(this.responserService)
				}).catch((err: Responseable) => {
					this.responserService = {
						result: err.result,
						message: err.message,
						error: err,
						status: err.status
					}
					reject(this.responserService)
				})
		})


	}
		
	public async save(
		data: Registrable,
		model: Model<Document, {}>,
		idUser?: string
	): Promise<Responseable> {

		return new Promise<Responseable>( async (resolve, reject) => {
			if (idUser) {
				await this.saveableService.save(data, model, model, idUser)
					.then((res: Responseable) => {
						if(res && res.result !== undefined) {
							this.responserService = {
								result: res.result,
								message: res.message,
								error: res.error,
								status: res.status
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
				reject(this.responserService)
			} else {
				await this.saveableService.save(data, model, model)
					.then((res: Responseable) => {
						if(res && res.result !== undefined) {
							this.responserService = {
								result: res.result,
								message: res.message,
								error: res.error,
								status: res.status
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
				reject(this.responserService)
			}
		})
	}

	public async getAll(
		model: Model<Document, {}>,
		project: {},
		match: {},
		sort: {},
		group: {},
		limit: number,
		skip: number
	): Promise<Responseable> {

			return new Promise<Responseable>( async (resolve, reject) => {

				await this.geteableAllService.getAll(model, project, match, sort, group, limit, skip)
					.then((result: Responseable) => {
						if(result) {
							this.responserService = {
								result: result.result,
								message: result.message,
								error: result.error,
								status: result.status
							}
							resolve(this.responserService)
						} else {
							this.responserService = {
								result: 'Nop',
								message: 'No existe result',
								error: 'obj.getAll()',
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
				reject(this.responserService)
			})
	}
}
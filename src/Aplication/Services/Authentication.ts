import { Model, Document } from 'mongoose'
import { injectable, inject } from 'inversify'
import TYPES from './../../TYPES'

import Authenticable from './Ports/Authenticable'
import Registrable from '../../Domain/Entities/User/Ports/Registrable'
import UserServiceable from '../../Domain/Entities/User/Ports/Serviceable'
import CompanyServiceable from '../../Domain/Entities/Company/Ports/Serviceable'
import CreateableToken from './Ports/CreateableToken'
import Logueable from '../../Domain/Entities/User/Ports/Logueable'
import Controlleable from '../../Domain/Entities/Util/Ports/Controlleable'

import UserTokenable from './Ports/UserTokenable'
import UserToken from './UserToken'
import Responseable from '../../Domain/Entities/Util/Ports/Responseable'
import Responser from '../../Domain/Entities/Util/Responser'

@injectable()
export default class Authentication implements Authenticable {

	@inject(TYPES.UserServiceableDomain) private userService: UserServiceable
	@inject(TYPES.CompanyServiceableDomain) private companyService: CompanyServiceable
	@inject(TYPES.CreateableToken) private tokenProvider: CreateableToken
	@inject(TYPES.Controlleable) private controllerService: Controlleable

	public async register(
		userData: Registrable,
		database: string,
		model: Model<Document, {}>,
		companyModel: Model<Document, {}>
	): Promise<Responseable> {

		return new Promise<Responseable>( async (resolve, reject) => {

			var responserService: Responseable = new Responser()
			var register: UserTokenable = new UserToken()
			var companyId: string = ''

			await this.userService.existUserWithThatEmail(userData.email, model)
				.then( async (res: Responseable) => {
					if (res && (res.result !== undefined)) {
						if (!res.result) {
							await this.userService.hashPassword(userData.password)
								.then( async (res: Responseable) => {
									if (res && res.result !== undefined) {
										userData.password = res.result
										await this.companyService.getAll(companyModel, {}, { name: database, operationType: { $ne: 'D' } }, {}, {}, 0, 0)
											.then( async (res: Responseable) => {
												if(res && res.result !== undefined) {
													if(res.result.length === 0) {
														await this.companyService.save({name: database}, companyModel)
															.then( async (res: Responseable) => {
																if (res && res.result !== undefined) {
																	responserService = {
																		result: res.result,
																		message: res.message,
																		error: res.error,
																		status: res.status
																	}
																	if (res.status === 200) {
																		companyId = res.result._id
																		
																	}
																} else {
																	responserService = { result: 'Nop', message: 'La capa superior contesto undefined', error: '', status: 500 }
																}
															})
													} 
												} else {
													responserService = { result: 'Nop', message: 'La capa superior contesto undefined', error: '', status: 500 }
												}
											}).catch((err: Responseable) => {
												responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
											})
										
										await this.userService.save(userData, model)
											.then((res: Responseable) => {
												if (res && res.result !== undefined) {
													register.user = res.result
													register.user.password = undefined
													register.token = this.tokenProvider.createToken(register.user, database);
													responserService = {
														result: {
															user: register.user,
															token: register.token,
															company: companyId
														},
														message: 'Registro exitoso',
														error: '',
														status: 200
													}
													resolve(responserService)
												} else {
													responserService = { result: 'Nop', message: 'La capa superior contesto undefined', error: '', status: 500 }
												}
											}).catch((err: Responseable) => {
												responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
											})
										
									} else {
										responserService = { result: 'Nop', message: 'La capa superior contesto undefined', error: '', status: 500 }
									}
								}).catch((err: Responseable) => {
									responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
								})
						} else {
							responserService = {
								result: 'Nop',
								message: 'El email ' + userData.email + ' ya se encuentra registrado',
								error: 'Duplicaion de datos',
								status: 428
							}
						}
					} else {
						responserService = { result: 'Nop', message: 'La capa superior contesto undefined', error: '', status: 500 }
					}
				}).catch((err: Responseable) => {
					responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
				})
			reject(responserService)
		})
	}
	
	public async login(
		loginData: Logueable,
		database: string,
		model: Model<Document, {}>
	): Promise<Responseable> {

		return new Promise<Responseable>( async (resolve, reject) => {

			var responserService: Responseable = new Responser()
			var login: UserTokenable = new UserToken()

			await this.userService.existUserWithThatEmail(loginData.email, model)
				.then( async (res: Responseable) => {
					if (res && (res.result !== undefined)) {
						if (res.result) {
							await this.userService.getUserByEmail(loginData.email, model)
								.then( async (res: Responseable) => {
									if (res && res.result !== undefined) {
										login.user = res.result
										await this.userService.isMatch(loginData.password, login.user.password)
											.then( async (res: Responseable) => {
												if (res && res.result !== undefined) {
													if (res.result) {
														await this.userService.isEnable(login.user._id, model)
															.then((res: Responseable) => {
																if (res && res.result !== undefined) {
																	if (res.result) {
																		login.user.password = undefined
																		login.token = this.tokenProvider.createToken(login.user, database)
																		responserService = {
																			result: {
																				user: login.user,
																				token: login.token
																			},
																			message: 'Bienvenido ' + login.user.email,
																			error: '',
																			status: 200
																		}
																		resolve(responserService)
																	} else {
																		responserService = {
																			result: 'Nop',
																			message: 'Usuario bloqueado',
																			error: 'El usuario ha sido bloqueado',
																			status: 423
																		}
																	}
																} else {
																	responserService = { result: 'Nop', message: 'La capa superior contesto undefined3', error: '', status: 500 }
																}
															}).catch((err: Responseable) => {
																responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
															})
													} else {
														responserService = {
															result: 'Nop',
															message: 'Password incorrecta',
															error: 'La contraseña ingresada es incorrecta',
															status: 403
														}
													}
												} else {
													responserService = { result: 'Nop', message: 'La capa superior contesto undefined1', error: '', status: 500 }
												}
											}).catch((err: Responseable) => {
												responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
											})
									} else {
										responserService = {
											result: 'Nop',
											message: 'No existe usuario con el email: ' + loginData.email,
											error: 'No existe usuario con el email: ' +  loginData.email,
											status: 404
										}
									}
								}).catch((err: Responseable) => {
									responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
								})
						} else {
							responserService = {
								result: 'Nop',
								message: 'No existe usuario con el email: ' + loginData.email,
								error: 'No existe usuario con el email: ' +  loginData.email,
								status: 404
							}
						}
					} else {
						responserService = { result: 'Nop', message: 'La capa superior contesto undefined2', error: '', status: 500 }
					}
				}).catch((err: Responseable) => {
					responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
				})
			reject(responserService)
		})
	}
}
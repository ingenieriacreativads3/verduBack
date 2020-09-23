import { Model, Document, Schema } from 'mongoose'
import * as moment from 'moment'

import Uc from './Ports/UC'

import Agreement from '../../Domain/Entities/Agreement/Interface'
import AgreementStatus from '../../Domain/Entities/AgreementStatus/Interface'
import Property from '../../Domain/Entities/Property/Interface'
import Service from '../../Domain/Entities/Service/Interface'
import Transaction from '../../Domain/Entities/Transaction/Interface'
import MovementOfService from '../../Domain/Entities/MovementOfService/Interface'
import TransactionType from '../../Domain/Entities/TransactionType/Interface'
import Person from '../../Domain/Entities/Person/Interface'
import Origin from '../../Domain/Entities/Origin/Interface'
import Company from '../../Domain/Entities/Company/Interface'
import ServiceType from '../../Domain/Entities/ServiceType/Interface'
import VatCondition from '../../Domain/Entities/VatCondition/Interface'

import Responseable from '../../Domain/Entities/Util/Ports/Responseable'

import GeteableAllAgreement from '../../Domain/Entities/Agreement/Ports/GeteableAll'
import UpdateableAgreement from '../../Domain/Entities/Agreement/Ports/Updateable'
import GeteableAllAgreementStatus from '../../Domain/Entities/AgreementStatus/Ports/GeteableAll'
import GeteableAllPerson from '../../Domain/Entities/Person/Ports/GeteableAll'
import GeteableAllProperty from '../../Domain/Entities/Property/Ports/GeteableAll'
import GeteableAllService from '../../Domain/Entities/Service/Ports/GeteableAll'
import SaveableMovementOfService from '../../Domain/Entities/MovementOfService/Ports/Saveable'
import GeteableAllTransactionType from '../../Domain/Entities/TransactionType/Ports/GeteableAll'
import GeteableAllOrigin from '../../Domain/Entities/Origin/Ports/GeteableAll'
import GeteableAllServiceType from '../../Domain/Entities/ServiceType/Ports/GeteableAll'
import GeteableAllPersonType from '../../Domain/Entities/PersonType/Ports/GeteableAll'
import GeteableAllUser from '../../Domain/Entities/User/Ports/GeteableAll'
import GeteableAllVatCondition from '../../Domain/Entities/VatCondition/Ports/GeteableAll'
import GeteableAllMovementOfService from '../../Domain/Entities/MovementOfService/Ports/GeteableAll'
import Controlleable from '../../Domain/Entities/Util/Ports/Controlleable'
import TransactionService from '../../Domain/Entities/Transaction/Ports/Serviceable'
import CashBoxTypeService from '../../Domain/Entities/CashBoxType/Ports/Serviceable'
import CashBoxService from '../../Domain/Entities/CashBox/Ports/Serviceable'
import UserService from '../../Domain/Entities/User/Ports/Serviceable'
import MovementOfServiceService from '../../Domain/Entities/MovementOfService/Ports/Serviceable'
import IncreaseableBalance from '../../Domain/Entities/Transaction/Ports/IncreaseableBalance'

import MovementOfCash from '../../Domain/Entities/MovementOfCash/Interface'
import SaveableMovementOfCash from '../../Domain/Entities/MovementOfCash/Ports/Saveable'
import SaveableTransactionTransacion from '../../Domain/Entities/TransactionTransaction/Ports/Saveable'
import TransactionTransaction from '../../Domain/Entities/TransactionTransaction/Interface'
import PersonType from '../../Domain/Entities/PersonType/Interface'
import User from '../../Domain/Entities/User/Interface'

import TrelloService from './Ports/TrelloService'

export default class Controller implements Uc {

	public async makeEffectiveAgreement(
		transactionTypeId: string,
		agreementId: string,
		agreementStatusId: string,
		originId: string,
		responserService: Responseable,
		agreementService: GeteableAllAgreement,
		agreementUpdateService: UpdateableAgreement,
		agreementStatusService: GeteableAllAgreementStatus,
		personService: GeteableAllPerson,
		propertyService: GeteableAllProperty,
		serviceService: GeteableAllService,
		transactionService: TransactionService,
		movementOfServiceSaveService: SaveableMovementOfService,
		transactionTypeService: GeteableAllTransactionType,
		originService: GeteableAllOrigin,
		serviceTypeService: GeteableAllServiceType,
		personTypeService: GeteableAllPersonType,
		userService: GeteableAllUser,
		vatConditionService: GeteableAllVatCondition,
		movementOfServiceService: MovementOfServiceService,
		increaseBalance: IncreaseableBalance,
		agreementModel: Model<Document, {}>,
		agreementStatusModel: Model<Document, {}>,
		personModel: Model<Document, {}>,
		propertyModel: Model<Document, {}>,
		serviceModel: Model<Document, {}>,
		transactionModel: Model<Document, {}>,
		movementOfServiceModel: Model<Document, {}>,
		transactionTypeModel: Model<Document, {}>,
		originModel: Model<Document, {}>,
		serviceTypeModel: Model<Document, {}>,
		personTypeModel: Model<Document, {}>,
		userModel: Model<Document, {}>,
		vatConditionModel: Model<Document, {}>,
		controller: Controlleable,
		idUser: string
	): Promise<Responseable> {
		return new Promise<Responseable>( async (resolve, reject) => {

			var agreement: Agreement
			var agreementStatus: AgreementStatus
			var agreementStatusReceived: AgreementStatus
			var transactionType: TransactionType
			var lessee: Person
			var contractType: string
			var properties: Property[]
			var startDate: Date
			var endDate: Date
			var duration: number = 1
			var numberOftransaction: number = 0
			var services: {
				service: Service,
				price: number
			}[]
			var serviceLocation: {
				service: Service,
				price: number
			}
			var transaction: Transaction
			var transactionList: Transaction[] = []
			var movementOfservice: MovementOfService
			var movementsOfService: MovementOfService[] = []
			var origin: Origin
			var number: number
			var letter: string
			var agreementType: any
			var serivicesIds: string[] = []
			var personType: PersonType
			var adjustmentPercentage: number
			var adjustmentFrecuency: number
			var expirationDay: number
			var invoiceNumber: number
			var vatCondition: VatCondition
			var companyId: Schema.Types.ObjectId
			var company: Company

			if (originId) {

				let project: {} = {
					_id: 1,
					'company._id': 1,
					number: 1
				}
				let match: {} = { _id: { $oid: originId } }
	
				await originService.getAll(controller, originModel, project, match, {}, {}, 1, 0)
					.then((res: Responseable) => {
						if (res && res.result !== undefined && res.result.company !== undefined) {
							origin = res.result
							companyId = res.result.company._id
						} else {
							responserService = { result: 'Nop', message: 'La capa superior contesto undefined 23 1', error: '', status: 500 }
							reject(responserService); return;
						}
					}).catch((err: Responseable) => {
						console.log(err)
						responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
						reject(responserService); return;
					})

				if (transactionTypeId) {

					let match: {} = { _id: { $oid: transactionTypeId } }
	
					await transactionTypeService.getAll(controller, transactionTypeModel, {}, match, {}, {}, 1, 0)
						.then((res: Responseable) => {
							if (res && res.result !== undefined) {
								transactionType = res.result
								// TODO resolver esto (sea cual sea el tipo de transaccion, se coloca en autonumeracion= false, para que el metodo de cerrar contrato defina cuales van a ser los numeros de las siguientes facturas.)
								transactionType.automaticNumbering = false
							} else {
								responserService = { result: 'Nop', message: 'La capa superior contesto undefined 2', error: '', status: 500 }
								reject(responserService); return;
							}
						}).catch((err: Responseable) => {
							responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
							reject(responserService); return;
						})
	
					switch(transactionType.accountingSeat) {
	
						case 'credit':
							
							if (agreementId && agreementStatusId) {
	
								let match: {} = { _id: { $oid: agreementId } }
				
								await agreementService.getAll(controller, agreementModel, {}, match, {}, {}, 1, 0)
									.then( async (res: Responseable) => {
										if (res && res.result !== undefined) {
											agreement = res.result
	
											if (agreement.services.length <= 0) {
												responserService = {
													result: 'Nop',
													message: 'Sin servicios',
													error: 'El contrato recibido no posee servicios',
													status: 428
												}
												reject(responserService); return;
											}
				
											if (agreement.agreementStatus) {
							
												let match: {} = { _id: { $oid: agreement.agreementStatus.toString() } }
												
												await agreementStatusService.getAll(controller, agreementStatusModel, {}, match, {}, {}, 1, 0)
													.then((res: Responseable) => {
														if (res && res.result !== undefined) {
															agreementStatus = res.result
														} else {
															responserService = { result: 'Nop', message: 'La capa superior contesto undefined 3', error: '', status: 500 }
															reject(responserService); return;
														}
													}).catch((err: Responseable) => {
														responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
														reject(responserService); return;
													})
											} else {
												responserService = {
													result: 'Nop',
													message: 'El contrato encontrado no posee un estado de contrato existente',
													error: 'Se deben ingresar un id de un contrato con un estado de contrato existente',
													status: 428
												}
												reject(responserService); return;
											}
							
											match = { _id: { $oid: agreementStatusId } }
				
											await agreementStatusService.getAll(controller, agreementStatusModel, {}, match, {}, {}, 1, 0)
												.then((res: Responseable) => {
													if (res && res.result !== undefined) {
														agreementStatusReceived = res.result
													} else {
														responserService = { result: 'Nop', message: 'La capa superior contesto undefined 4', error: '', status: 500 }
														reject(responserService); return;
													}
												}).catch((err: Responseable) => {
													responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
													reject(responserService); return;
												})
				
											if (agreementStatusReceived) {
												if (agreementStatusReceived.generateInvoices) {
													if (agreementStatus) {
														if (!agreementStatus.generateInvoices) {
															let updateAgreement = {
																agreementStatus: agreementStatusReceived
															}
															await agreementUpdateService.update(agreement._id, updateAgreement, agreementModel, controller, idUser, agreementStatusModel)
																.then( async (res: Responseable) => {
																	if (res && res.result !== undefined) {
							
																		let match: {} = { _id: { $oid: res.result._id } }
							
																		await agreementService.getAll(controller, agreementModel, {}, match, {}, {}, 1, 0)
																			.then((res: Responseable) => {
																				if (res && res.result !== undefined) {
																					agreement = res.result
																				} else {
																					responserService = { result: 'Nop', message: 'La capa superior contesto undefined 5', error: '', status: 500 }
																					reject(responserService); return;
																				}
																			}).catch((err: Responseable) => {
																				responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
																				reject(responserService); return;
																			})
																			
																		if (
																			agreement.lessee &&
																			agreement.adjustmentPercentage &&
																			agreement.adjustmentFrecuency &&
																			agreement.expirationDay &&
																			agreement.invoiceNumber &&
																			agreement.property &&
																			agreement.startDate &&
																			agreement.endDate &&
																			agreement.services
																		) {
														
																			let match: {} = { _id: { $oid: agreement.lessee.toString() } }
														
																			await personService.getAll(controller, personModel, {}, match, {}, {}, 1, 0)
																				.then( async (res: Responseable) => {
																					if (res && res.result !== undefined) {
																						lessee = res.result
	
																						let match: {} = { _id: { $oid: lessee.vatCondition.toString() } }
	
																						await vatConditionService.getAll(controller, vatConditionModel, {}, match, {}, {}, 1, 0)
																							.then( async (res: Responseable) => {
																								if (res && res.result !== undefined) {
																									vatCondition = res.result
																									letter = vatCondition.letter
																								} else {
																									responserService = { result: 'Nop', message: 'La capa superior contesto undefined 6', error: '', status: 500 }
																									reject(responserService); return;
																								}
																							}).catch((err: Responseable) => {
																								responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
																								reject(responserService); return;
																							})
	
																					} else {
																						responserService = { result: 'Nop', message: 'La capa superior contesto undefined 7', error: '', status: 500 }
																						reject(responserService); return;
																					}
																				}).catch((err: Responseable) => {
																					responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
																					reject(responserService); return;
																				})
	
																				adjustmentPercentage = agreement.adjustmentPercentage
																				adjustmentFrecuency = agreement.adjustmentFrecuency
																				expirationDay = agreement.expirationDay
																				invoiceNumber = agreement.invoiceNumber
														
																			if (agreement.property.length > 0) {
											
																				properties = await Promise.all(
																					agreement.property.map( async (property: {
																						property: Schema.Types.ObjectId
																					}) => {
													
																						let match: {} = { _id: { $oid: property.property.toString() } }
											
																						var propertyAux
																						
																						await propertyService.getAll(controller, propertyModel, {}, match, {}, {}, 1, 0)
																							.then((res: Responseable) => {
																								if (res && res.result !== undefined) {
																									if (res.status === 200) {
																										propertyAux = res.result
																									}
																								} else {
																									responserService = { result: 'Nop', message: 'La capa superior contesto undefined 8', error: '', status: 500 }
																									reject(responserService); return;
																								}
																							}).catch((err: Responseable) => {
																								responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
																								reject(responserService); return;
																							})
																						return propertyAux
																					})
																				)

																			} else {
																				responserService = {
																					result: 'Nop',
																					message: 'Contrato incompleto',
																					error: 'El contrato no posee propiedades',
																					status: 428
																				}
																				reject(responserService); return;
																			}

																			startDate = agreement.startDate
																			endDate = agreement.endDate
											
																			if (agreement && agreement.services && agreement.services.length > 0) {
																				agreement.services.map((service: {
																					service: Schema.Types.ObjectId
																				}) => {
																					serivicesIds.push(service.service.toString())
																				})
																			} else {
																				responserService = {
																					result: 'Nop',
																					message: 'Contrato incompleto',
																					error: 'El contrato no posee servicios',
																					status: 428
																				}
																				reject(responserService); return;
																			}

																			var servicesHidrate = await Promise.all(
																				serivicesIds.map(async (id: string) => {

																					let project: {} = {
																						_id: 1,
																						name: 1,
																						'serviceType._id': 1,
																						'serviceType.invoicing': 1
																					}
																					let match: {} = { _id: { $oid: id } }
											
																					let serviceHidrate
												
																					await serviceService.getAll(controller, serviceModel, project, match, {}, {}, 1, 0)
																						.then((res: Responseable) => {
																							if (res && res.result !== undefined) {
																								if (res.status === 200) {
																									serviceHidrate = res.result
																									if(res.result.serviceType.invoicing) {
																										serviceLocation = {
																											service: res.result,
																											price: 0
																										}
																									}
																								}
																							} else {
																								responserService = { result: 'Nop', message: 'La capa superior contesto undefined 9', error: '', status: 500 }
																								reject(responserService); return;
																							}
																						}).catch((err: Responseable) => {
																							responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
																							reject(responserService); return;
																						})
																					return serviceHidrate
																				})
																			)

																			var agreementServices = await Promise.all(
																				servicesHidrate.map(async (serviceHidrate: Service) => {

																					var serviceReturn: {
																						service: Schema.Types.ObjectId | Service,
																						price: number
																					} = {
																						service: null,
																						price: 0
																					}

																					agreement.services.map((service : {
																						service: Schema.Types.ObjectId,
																						price: number
																					}) => {

																						if (serviceHidrate._id.toString() === service.service.toString()) {
																							serviceReturn = {
																								service: serviceHidrate,
																								price: service.price
																							}
																						}
																					})

																					return serviceReturn

																				})
																			)

																			agreement.services = agreementServices
																			
																			let totalTransaction: number = 0
																			let dates: {
																				date: Date,
																				starDate: Date
																				endDate: Date,
																				expirationDate: Date
																			}[] = []
																			let endDates: Date[] = []

																			if(adjustmentFrecuency > invoiceNumber) {
																				responserService = {
																					result: 'Nop',
																					message: 'La frecuencia de ajuste es mayor a la cantidad de facturas',
																					error: 'La frecuencia de ajuste debe ser menor o igual a la cantidad de facturas',
																					status: 428
																				}
																				reject(responserService); return;
																			}


																			let year = moment(startDate).year();
																			let month = moment(startDate).month() - 1;

																			while(totalTransaction < invoiceNumber) {
																				for (let i = 0; i < adjustmentFrecuency; i++) {
																					if(totalTransaction < invoiceNumber) {
																						month = month + 1
																						let myDate: string = moment(year.toString() + '-' + '1' + '-' + expirationDay.toString() + '-' + 20 + ':' + 59 + ':' + 59, 'YYYY-MM-DDTHH:mm:ssZ', false).set('month', month).format()
																						let starDateTransaction: string = moment(year.toString() + '-' + '1' + '-' + '1' + '-' + 20 + ':' + 59 + ':' + 59, 'YYYY-MM-DDTHH:mm:ssZ', false).set('month', month).format()
																						let lastDayOfMonth: number = moment(year.toString() + '-' + '1' + '-' + '1' + '-' + 20 + ':' + 59 + ':' + 59, 'YYYY-MM-DDTHH:mm:ssZ', false).set('month', month).endOf('month').date()
																						let endDateTransaction: string = moment(year.toString() + '-' + '1' + '-' + lastDayOfMonth.toString() + '-' + 20 + ':' + 59 + ':' + 59, 'YYYY-MM-DDTHH:mm:ssZ', false).set('month', month).format()
																						endDates.push(new Date(myDate))
																						dates.push({
																							expirationDate: new Date(myDate),
																							date: new Date(starDateTransaction),
																							starDate: new Date(starDateTransaction),
																							endDate: new Date(endDateTransaction)
																						})
																						totalTransaction = totalTransaction + 1
																						if(month === 11) {
																							month = (-1)
																							year = year + 1
																						}
																					}
																				}
																			}

																			company = origin.company as Company

																			let project = {
																				_id: 1,
																				company: 1,
																				origin: 1,
																				letter: 1,
																				number: 1,
																				operationType: 1
																			}
																			match = {
																				company: {
																					$oid: company._id
																				},
																				origin: origin.number,
																				letter: letter,
																				operationType: { $ne: 'D' },
																			}
																			let sort = {
																				number: -1
																			}
													
																			await transactionService.getAll(controller, transactionModel, project, match, sort, {}, 1, 0)
																				.then((res: Responseable) => {
																					if(res && res.result !== undefined) {
																						if(res.result.number) {
																							number = res.result.number
																						} else {
																							number = 0
																						}
																					} else {
																						responserService = { result: 'Nop', message: 'La capa superior contesto undefined 10', error: '', status: 500 }
																						reject(responserService)
																					}
																				})
																				.catch((err: any) => {
																					responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
																					reject(responserService)
																				})

																			let priceAux: number = 0

																			agreement.services.map((service: {
																				service: Service,
																				price: number
																			}) => {
																				priceAux = priceAux + service.price
																			})

																			let period: number = agreement.adjustmentFrecuency
																			let adjust: number = 1 + (agreement.adjustmentPercentage / 100)

																			dates.map((dateAux: {
																				date: Date,
																				starDate: Date
																				endDate: Date,
																				expirationDate: Date
																			}) => {

																				number = number + 1
																				
																				if(period < 1) {
																					period = agreement.adjustmentFrecuency
																					priceAux = priceAux * adjust
																				}
																				period = period - 1

																				transactionList.push({
																					_id: null,
																					person: lessee,
																					agreement: agreement,
																					date: dateAux.date,
																					startDate: dateAux.starDate,
																					endDate: dateAux.endDate,
																					expirationDate: dateAux.expirationDate,
																					totalPrice: priceAux,
																					balance: priceAux,
																					transactionType: transactionType,
																					origin: origin.number,
																					number: number,
																					letter: letter,
																					CAE: '',
																					expirationCAE: null,
																					operationType: 'C',
																					company: origin.company as Company
																				})
																			})


																			await Promise.all(
																				transactionList.map(async (transaction: Transaction) => {
																					await transactionService.save(transaction, controller, transactionModel, idUser)
																						.then((res: Responseable) => {
																							if (res && res.result !== undefined) {
																								transaction._id = res.result._id
																							} else {
																								responserService = { result: 'Nop', message: 'La capa superior contesto undefined 11', error: '', status: 500 }
																								reject(responserService); return;
																							}
																						}).catch((err: Responseable) => {
																							responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
																							reject(responserService); return;
																						})
																				})
																			)

																			let movementList: any[] = await Promise.all(
																				transactionList.map(async (transaction: Transaction) => {
																					let movementOfserviceListb: any[] = await Promise.all(
																						agreement.services.map(async (service: {
																							service: Service,
																							price: number
																						}) => {
																							if(service.service && (service.price !== undefined) && service.price >= 0) {
																								movementOfservice = {
																									_id: null,
																									transaction: transaction._id,
																									startDate: transaction.startDate,
																									endDate: transaction.endDate,
																									expirationDate: transaction.expirationDate,
																									service: service.service,
																									price: service.price ,
																									balanceCanceled: 0,
																									refundable: false,
																									operationType: 'C',
																								}
	
																								let movementOfServiceReturn: string

																								await movementOfServiceSaveService.save(
																									movementOfservice,
																									controller,
																									movementOfServiceModel,
																									idUser,
																									transactionModel,
																									transaction._id,
																									transactionService,
																									controller
																								).then((res: Responseable) => {
																										if (res && res.result !== undefined) {
																											movementOfServiceReturn = res.result._id
																										} else {
																											responserService = { result: 'Nop', message: 'La capa superior contesto undefined 12', error: '', status: 500 }
																											reject(responserService); return;
																										}
																									}).catch((err: Responseable) => {
																										responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
																										reject(responserService); return;
																									})
																								
																								return movementOfServiceReturn
	
																							} else {
																								responserService = {
																									result: 'Nop',
																									message: 'Contrato incompleto',
																									error: 'Faltan los servicios',
																									status: 428
																								}
																								reject(responserService); return;
																							}
																						})
																					)
																					return movementOfserviceListb
																				})
																			)

																			let movementOfServiceListList = await Promise.all(
																				movementList.map(async (movementListAux: []) => {
																					let movementOfServiceListGet = await Promise.all(
																						movementListAux.map(async (movementOfServiceId: string) => {
		
																							let movementOfService: MovementOfService
		
																							let match: {} = { _id: { $oid: movementOfServiceId } }
		
																							await movementOfServiceService.getAll(controller, movementOfServiceModel, {}, match, {}, {}, 1, 0)
																								.then((res: Responseable) => {
																									if (res && res.result !== undefined) {
																										if (res.status === 200) {
																											movementOfService = res.result
																										}
																									} else {
																										responserService = { result: 'Nop', message: 'La capa superior contesto undefined 8', error: '', status: 500 }
																										reject(responserService); return;
																									}
																								}).catch((err: Responseable) => {
																									responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
																									reject(responserService); return;
																								})
																							return movementOfService
																							
																						})
																					)
																					return movementOfServiceListGet
																				})
																			)

																			period = agreement.adjustmentFrecuency
																			adjust = 1

																			movementOfServiceListList.map((movementOfServiceList: MovementOfService[]) => {

																				if(period < 1) {
																					period = agreement.adjustmentFrecuency
																					adjust = adjust * (1 + (agreement.adjustmentPercentage / 100))
																				}
																				period = period - 1

																				movementOfServiceList.map((movementOfService: MovementOfService) => {
																					movementOfService.price = movementOfService.price * adjust
																				})
																			})

																			let asd = await Promise.all(
																				movementOfServiceListList.map(async (movementOfServiceList: MovementOfService[]) => {
																					let asd = await Promise.all(
																						movementOfServiceList.map(async (movementOfService: MovementOfService) => {
		
																							let asd
																							let id = movementOfService._id
																							delete movementOfService._id
		
																							await movementOfServiceService.update(id, movementOfService, movementOfServiceModel, controller, idUser)
																								.then((res: Responseable) => {
																									if (res && res.result !== undefined) {
																										if (res.status === 200) {
																											asd = res.result._id
																										}
																									} else {
																										responserService = { result: 'Nop', message: 'La capa superior contesto undefined 8', error: '', status: 500 }
																										reject(responserService); return;
																									}
																								}).catch((err: Responseable) => {
																									responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
																									reject(responserService); return;
																								})
																							return asd
																						})
																					)
																					return asd
																				})
																			)

																			responserService = {
																				result: '',
																				message: 'Generación exitosa de contratos',
																				error: '',
																				status: 200
																			}
																			resolve(responserService)
														
																		} else {
																			responserService = {
																				result: 'Nop',
																				message: 'Contrato incompleto',
																				error: 'Se deben completar los campos: inquilino, ajuste de precio de contrato, frecuencia de ajuste, dia de vencimiento de factura, numero de facturas, tipo de contrato, propiedades, fecha de inicio, fecha de fin, o los servicios.',
																				status: 428
																			}
																			reject(responserService); return;
																		}
																		
																	} else {
																		responserService = { result: 'Nop', message: 'La capa superior contesto undefined 13', error: '', status: 500 }
																		reject(responserService); return;
																	}
																}).catch((err: Responseable) => {
																	responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
																	reject(responserService); return;
																})
														} else {
															responserService = {
																result: 'Nop',
																message: 'No admite facturacion',
																error: 'El estado de contrato del contrato recibido, no admite facturacion, porque ya fue generada.',
																status: 428
															}
															reject(responserService); return;
														}
													} else {
														responserService = {
															result: 'Nop',
															message: 'No existe el estado de contrato del contrato recibido',
															error: 'Se deben ingresar un identificador de contrato que posea un estado de contrato valido',
															status: 428
														}
														reject(responserService); return;
													}
												} else {
													responserService = {
														result: 'Nop',
														message: 'No admite facturacion',
														error: 'El estado de contrato al cual se quiere cambiar el contrato, no admite facturacion.',
														status: 428
													}
													reject(responserService); return;
												}
											} else {
												responserService = {
													result: 'Nop',
													message: 'No existe el estado de contrato recibido',
													error: 'Se deben ingresar un identificador de estado de contrato valido',
													status: 428
												}
												reject(responserService); return;
											}
				
										} else {
											responserService = { result: 'Nop', message: 'La capa superior contesto undefined 14', error: '', status: 500 }
											reject(responserService); return;
										}
									}).catch((err: Responseable) => {
										responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
										reject(responserService); return;
									})
								
							} else {
								responserService = {
									result: 'Nop',
									message: 'Faltan los ids',
									error: 'Se deben ingresar ids validos de contrato, del tipo de transaccion, y del estado de contrato',
									status: 428
								}
								reject(responserService); return;
							}
	
							break;
						case 'debit':
	
							break;
	
						case 'nothing':
							console.log('nothing');
							break;
	
						default:
	
							responserService = {
								result: 'Nop',
								message: 'Tipo de transaccion invalida',
								error: 'El tipo de transaccion enviado, posee un valor en la variable generate, invalido.',
								status: 428
							}
							reject(responserService); return;
							
					}
					
				} else {
					responserService = {
						result: 'Nop',
						message: 'Identificador de tipo de transaccion inexistente',
						error: 'No se recibio un identificador de tipo de transaccion valido',
						status: 428
					}
					reject(responserService); return;
				}
				
			} else {
				responserService = {
					result: 'Nop',
					message: 'Identificador de punto de venta inexistente',
					error: 'No se recibio un identificador de punto de venta valido',
					status: 428
				}
				reject(responserService); return;
			}

			
			
		})
	}

	public async debitTransaction(
		movementOfCashs: MovementOfCash[],
		transactionCreditIds: string[],
		transactionTypeDebitId: string,
		responserService: Responseable,
		controller: Controlleable,
		idUser: string,
		movementOfCashSaveService: SaveableMovementOfCash,
		transactionTransactionSaveService: SaveableTransactionTransacion,
		transactionService: TransactionService,
		cashBoxTypeService: CashBoxTypeService,
		cashBoxService: CashBoxService,
		userService: UserService,
		transactionTypeService: GeteableAllTransactionType,
		personService: GeteableAllPerson,
		movementOfCashModel: Model<Document, {}>,
		transactionTransactionModel: Model<Document, {}>,
		transactionModel: Model<Document, {}>,
		cashBoxTypeModel: Model<Document, {}>,
		cashBoxModel: Model<Document, {}>,
		userModel: Model<Document, {}>,
		transactionTypeModel: Model<Document, {}>,
		personModel: Model<Document, {}>,
	): Promise<Responseable> {
		return new Promise<Responseable>( async (resolve, reject) => {

			var movementOfCashsReceived: any[] = movementOfCashs
			var transactionCredits: Transaction[]
			var transactionTypeDebit: TransactionType
			var transactionDebit: Transaction
			var personTransactionDebit: Person
			var totalPriceTransactionDebit: number = 0
			var totalPriceTransactionCredit: number = 0
			var transactionDebitId: string
			var transactionTransactionIds: string[]

			if(transactionCreditIds) {

				transactionCredits = await Promise.all(
					transactionCreditIds.map( async (transactionCreditId: string) =>  {
	
						let match: {} = { _id: { $oid: transactionCreditId } }
	
						let transactionReturn: Transaction
						
						await transactionService.getAll(controller, transactionModel, {}, match, {}, {}, 1, 0)
							.then((res: Responseable) => {
								if (res && res.result !== undefined) {
									if(res.status === 200) {
										transactionReturn = res.result
									} else {
										responserService = { result: res.result, message: res.message, error: res.error, status: res.status }
										reject(responserService); return;
									}
								} else {
									responserService = { result: 'Nop', message: 'La capa superior contesto undefined 15', error: '', status: 500 }
									reject(responserService); return;
								}
							}).catch((err: Responseable) => {
								responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
								reject(responserService); return;
							})
	
						return transactionReturn
					})
				)

				movementOfCashs.map((movementOfCash: MovementOfCash) => {
					if(movementOfCash && movementOfCash.amount && movementOfCash.amount > 0) {
						totalPriceTransactionDebit = totalPriceTransactionDebit + movementOfCash.amount
					}
				})

				transactionCredits.map((transactionCredit: Transaction) => {
					if(transactionCredit && transactionCredit.balance && transactionCredit.balance > 0) {
						totalPriceTransactionCredit = totalPriceTransactionCredit + transactionCredit.balance
					}
				})

				if(totalPriceTransactionCredit <= totalPriceTransactionDebit) {

					if(transactionTypeDebitId) {

						let match: {} = { _id: { $oid: transactionTypeDebitId } }

						await transactionTypeService.getAll(controller, transactionTypeModel, {}, match, {}, {}, 1, 0)
							.then((res: Responseable) => {
								if (res && res.result !== undefined) {
									if(res.status === 200) {
										transactionTypeDebit = res.result
									} else {
										responserService = { result: res.result, message: res.message, error: res.error, status: res.status }
										reject(responserService); return;
									}
								} else {
									responserService = { result: 'Nop', message: 'La capa superior contesto undefined 16', error: '', status: 500 }
									reject(responserService); return;
								}
							}).catch((err: Responseable) => {
								responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
								reject(responserService); return;
							})
	
						
	
					} else {
						responserService = {
							result: 'Nop',
							message: 'Identificador de tipo de transaccion de debito inexistente',
							error: 'No se recibio un identificador de tipo de transaccion de debito valido',
							status: 428
						}
						reject(responserService); return;
					}
	
					if(transactionCredits && transactionCredits.length > 0) {
						let transactionCreditAux = transactionCredits[0]
	
						let match: {} = { _id: { $oid: transactionCreditAux.person } }
	
						await personService.getAll(controller, personModel, {}, match, {}, {}, 1, 0)
							.then((res: Responseable) => {
								if (res && res.result !== undefined) {
									if(res.status === 200) {
										personTransactionDebit = res.result
									} else {
										responserService = { result: res.result, message: res.message, error: res.error, status: res.status }
										reject(responserService); return;
									}
								} else {
									responserService = { result: 'Nop', message: 'La capa superior contesto undefined 17', error: '', status: 500 }
									reject(responserService); return;
								}
							}).catch((err: Responseable) => {
								responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
								reject(responserService); return;
							})
	
						// TODO arreglar los campos origin y company y letter
						transactionDebit = {
							_id: '',
							person: personTransactionDebit,
							transactionType: transactionTypeDebit,
							number: 0,
							totalPrice: totalPriceTransactionDebit,
							date: null,
							startDate: null,
							endDate: null,
							operationType: '',
							company: null,
							origin: 1,
							letter: 'C'
						}
	
						await transactionService.save(transactionDebit, controller, transactionModel, idUser)
							.then((res: Responseable) => {
								if (res && res.result !== undefined) {
									if(res.status === 200) {
										transactionDebitId = res.result._id
									} else {
										responserService = { result: res.result, message: res.message, error: res.error, status: res.status }
										reject(responserService); return;
									}
								} else {
									responserService = { result: 'Nop', message: 'La capa superior contesto undefined 18', error: '', status: 500 }
									reject(responserService); return;
								}
							}).catch((err: Responseable) => {
								responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
								reject(responserService); return;
							})

						match = { _id: { $oid: transactionDebitId } }

						await transactionService.getAll(controller, transactionModel, {}, match, {}, {}, 1, 0)
							.then((res: Responseable) => {
								if (res && res.result !== undefined) {
									if(res.status === 200) {
										transactionDebit = res.result
									} else {
										responserService = { result: res.result, message: res.message, error: res.error, status: res.status }
										reject(responserService); return;
									}
								} else {
									responserService = { result: 'Nop', message: 'La capa superior contesto undefined 19', error: '', status: 500 }
									reject(responserService); return;
								}
							}).catch((err: Responseable) => {
								responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
								reject(responserService); return;
							})
	
						transactionTransactionIds = await Promise.all(
							transactionCredits.map( async (transactionCredit: Transaction) => {
		
								let transactionTransactionAux: TransactionTransaction = {
									_id: '',
									credit: transactionCredit,
									debit: transactionDebit,
									balance: 0,
									operationType: ''
								}
		
								let transactionTransactionIdReturn: string
		
								await transactionTransactionSaveService.save(transactionTransactionAux, controller, transactionTransactionModel, transactionModel, idUser)
									.then((res: Responseable) => {
										if (res && res.result !== undefined) {
											if(res.status === 200) {
												transactionTransactionIdReturn = res.result._id
											} else {
												responserService = { result: res.result, message: res.message, error: res.error, status: res.status }
												reject(responserService); return;
											}
										} else {
											responserService = { result: 'Nop', message: 'La capa superior contesto undefined 20', error: '', status: 500 }
											reject(responserService); return;
										}
									}).catch((err: Responseable) => {
										responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
										reject(responserService); return;
									})
		
								return transactionTransactionIdReturn
							})
						)
	
						transactionCredits.map( async (transactionCredit: Transaction) => {
							transactionCredit.balance = 0
							let transactionIdReturn
							await transactionService.update(transactionCredit._id, transactionCredit, transactionModel, controller, idUser)
								.then((res: Responseable) => {
									if (res && res.result !== undefined) {
										if(res.status === 200) {
											transactionIdReturn = res.result
										} else {
											responserService = { result: res.result, message: res.message, error: res.error, status: res.status }
											reject(responserService); return;
										}
									} else {
										responserService = { result: 'Nop', message: 'La capa superior contesto undefined 21', error: '', status: 500 }
										reject(responserService); return;
									}
								}).catch((err: Responseable) => {
									responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
									reject(responserService); return;
								})
							return transactionIdReturn
						})



						await Promise.all(
							movementOfCashs.map( async (movementOfCash: MovementOfCash) => {
								let movementOfCashAux: MovementOfCash = {
									_id: '',
									transaction: transactionDebit,
									paymentMethod: movementOfCash.paymentMethod,
									cashBox: movementOfCash.cashBox,
									amount: movementOfCash. amount,
									operationType: ''
								}
								let movementOfCashIdReturn: string
								await movementOfCashSaveService.save(
									movementOfCashAux,
									controller,
									movementOfCashModel,
									idUser,
									transactionCreditIds,
									transactionService,
									cashBoxTypeService,
									cashBoxService,
									userService,
									transactionModel,
									cashBoxTypeModel,
									cashBoxModel,
									userModel,
									controller)
									.then((res: Responseable) => {
										if (res && res.result !== undefined) {
											if(res.status === 200) {
												movementOfCashIdReturn = res.result._id
											} else {
												responserService = { result: res.result, message: res.message, error: res.error, status: res.status }
												reject(responserService); return;
											}
										} else {
											responserService = { result: 'Nop', message: 'La capa superior contesto undefined 22', error: '', status: 500 }
											reject(responserService); return;
										}
									}).catch((err: Responseable) => {
										responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
										reject(responserService); return;
									})
								return movementOfCashIdReturn
							})
						)

						responserService = {
							result: {
								_id: transactionDebit._id
							},
							message: 'Consulta exitosa',
							error: '',
							status: 200
						}
						reject(responserService); return;
	
					} else {
						responserService = {
							result: 'Nop',
							message: 'Transacciones de credito inexistentes',
							error: 'No existen transacciones de credito para debitar',
							status: 428
						}
						reject(responserService); return;
					}

				} else {
					if(totalPriceTransactionCredit < totalPriceTransactionDebit) {
						responserService = {
							result: 'Nop',
							message: 'Montos de debe y haber diferentes',
							error: 'El total de credito a pagar, es menor que la cantidad de debito a cobrar',
							status: 428
						}
						reject(responserService); return;
					} else {
						responserService = {
							result: 'Nop',
							message: 'Montos de debe y haber diferentes',
							error: 'El total de credito a pagar, es mayor que la cantidad de debito a cobrar',
							status: 428
						}
						reject(responserService); return;
					}
				}

			} else {
				responserService = {
					result: 'Nop',
					message: 'Identificadores de transaccion de credito inexistente',
					error: 'No se recibio ningun identificador de transaccion de credito valido',
					status: 428
				}
				reject(responserService); return;
			}
		})
	}

	public async sendCardToTrello(
		responserService: Responseable,
		trelloService: TrelloService,
		claimName: string,
		claimDescription: string,
		database: string
	){

		return new Promise<Responseable>( async (resolve, reject) => {
			
			let shortURL: string = 'uKfT7lDS'
			let key: string = '9540e14f03a44a295564e04cdc0eeef1'
			let token: string = 'c68839bba6173f20d0aba1c6366d5a1b7360c4a0602108e31e4cbaddede9a98d'
			var keyColo = '6fe243c6fdd64eb6266af30e9538e623';
			var tokenColo = 'cd4972acad0d6eacc5b7a57ac686de8479d494cca779b61b7ebc309bf8288112';
			let listName: string = 'SOPORTE'
			let boardId: string = ''
			let listId: string = ''
			let cardId: string = ''

			await trelloService.getBoardId(responserService, shortURL, key, token)
				.then(async (res: Responseable) => {
					if(res !== undefined && res.result !== undefined) {

						boardId = res.result

						await trelloService.getListId(listName, responserService, boardId, key, token)
							.then(async (res: Responseable) => {
								if(res !== undefined && res.result !== undefined) {
			
									listId = res.result

									await trelloService.sendCard(claimName, claimDescription, responserService, listId , key, token)
										.then(async (res: Responseable) => {
											if(res !== undefined && res.result !== undefined) {
												if(res.status === 200) cardId = res.result.id
												responserService = { result: res.result, message: res.message, error: res.error, status: res.status }

												//await trelloService.saveLabel(database, 'blue', responserService, boardId, key, token)

												await trelloService.getLabelId(database, responserService, boardId, key, token)
													.then(async (res: Responseable) => {
														if(res !== undefined && res.result !== undefined) {

															if(res.status === 200) {

																await trelloService.saveCard(res.result, responserService, cardId, key, token)
																	.then(async (res: Responseable) => {
																		if(res !== undefined && res.result !== undefined) {
																			if(res.status !== 200) console.log(res)
																		} else { console.log(res) }
																	}).catch((err: any) => {
																		console.log(err)
																	})

															} else {

																if(res.status === 404) {

																	await trelloService.saveLabel(database, 'blue', responserService, boardId, key, token)
																		.then(async (res: Responseable) => {
																			await trelloService.getLabelId(database, responserService, boardId, key, token)
																				.then(async (res: Responseable) => {
																					if(res !== undefined && res.result !== undefined) {
							
																						if(res.status === 200) {
							
																							await trelloService.saveCard(res.result, responserService, cardId, key, token)
																								.then(async (res: Responseable) => {
																									if(res !== undefined && res.result !== undefined) {
																										if(res.status !== 200) console.log(res)
																									} else { console.log(res) }
																								}).catch((err: any) => {
																									console.log(err)
																								})
							
																						}
																						
																					} else {
																						console.log(res)
																					}
																				}).catch((err: any) => {
																					console.log(err)
																				})
																		})

																} else {
																	console.log(res)
																}

															}
			
															
														} else {
															console.log(res)
														}
													}).catch((err: any) => {
														console.log(err)
													})
												

												if(res.status === 200) {
													resolve(responserService)
												} else {
													reject(responserService)
												}
											} else {
												responserService = { result: 'Nop', message: 'Error en api/src/Aplication/UC/Controller.ts/Controller/sendCardToTrello().sendCard()', error: '', status: 500 }
												reject(responserService)
											}
										}).catch((err: any) => {
											responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
											reject(responserService)
										})
			
								} else {
									responserService = { result: 'Nop', message: 'Error en api/src/Aplication/UC/Controller.ts/Controller/sendCardToTrello().getListId()', error: '', status: 500 }
									reject(responserService)
								}
							}).catch((err: any) => {
								responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
								reject(responserService)
							})

					} else {
						responserService = { result: 'Nop', message: 'Error en api/src/Aplication/UC/Controller.ts/Controller/sendCardToTrello().getBoardId()', error: '', status: 500 }
						reject(responserService)
					}
				}).catch((err: any) => {
					responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
					reject(responserService)
				})

		})

	}

}
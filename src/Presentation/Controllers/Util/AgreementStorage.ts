import * as multer from 'multer';
import * as fs from 'fs'
import * as util from 'util'
import { injectable } from 'inversify'

import GeteableCompanyStorage from '../Ports/GeteableCompanyStorage';
import GeteableAgreementStorage from '../Ports/GeteableAgreementStorage';
import GeteablePropertyStorage from '../Ports/GeteablePropertyStorage';
import GeteableClaimStorage from '../Ports/GeteableClaimStorage';
import RequestWithUser from '../../Ports/RequestWithUser';
import * as moment from 'moment'

@injectable()
export default class Storage implements
	GeteableAgreementStorage,
	GeteableCompanyStorage,
	GeteablePropertyStorage,
	GeteableClaimStorage
{

	public getAgreementStorage(): multer.StorageEngine {

		var plataform: string = process.platform
		var path: string = ''

		if (plataform ==='linux') {
			path = '/home/some'
		} else {
			if (plataform === 'win32') {
				path = 'C:/temp/some'
			} else {
				console.log('Unrecognized platform. Files cannot be stored.')
			}
		}

		var storage = multer.diskStorage({
			destination: function (req: RequestWithUser, file, cb) {

				if (plataform ==='linux') {
					path = '/home/clients'
				} else {
					if (plataform === 'win32') {
						path = 'C:/temp/clients'
					} else {
						console.log('Unrecognized platform. Files cannot be stored.')
					}
				}

				if (req.database) {
					path = path + '/' + req.database + '/agreement'
					if (req.params.id) {
						path = path + '/' +req.params.id
					}
				}

				fs.mkdirSync(path, { recursive: true });
				cb(null, path)
			},
			filename: function (req, file, cb) {

				var name: string = moment().format('YYYY-MM-DDTHH:mm:ssZ').toString() + '-' + file.originalname.normalize('NFD').replace(/[\u0300-\u036f]/g, "")

				cb(null, name)
			}
		})
		
		return storage
	}

	public getCompanyStorage(): multer.StorageEngine {

		var plataform: string = process.platform
		var path: string = ''

		if (plataform ==='linux') {
			path = '/home/some'
		} else {
			if (plataform === 'win32') {
				path = 'C:/temp/some'
			} else {
				console.log('Unrecognized platform. Files cannot be stored.')
			}
		}

		var storage = multer.diskStorage({
			destination: function (req: RequestWithUser, file, cb) {

				if (plataform ==='linux') {
					path = '/home/clients'
				} else {
					if (plataform === 'win32') {
						path = 'C:/temp/clients'
					} else {
						console.log('Unrecognized platform. Files cannot be stored.')
					}
				}

				if (req.database) {
					path = path + '/' + req.database + '/company'
				}

				fs.mkdirSync(path, { recursive: true });
				cb(null, path)
			},
			filename: function (req, file, cb) {

				var name: string = moment().format('YYYY-MM-DDTHH:mm:ssZ').toString() + '-' + file.originalname.normalize('NFD').replace(/[\u0300-\u036f]/g, "")

				cb(null, name)
			}
		})
		
		return storage
	}

	public getPropertyStorage(): multer.StorageEngine {

		var plataform: string = process.platform
		var path: string = ''

		if (plataform ==='linux') {
			path = '/home/some'
		} else {
			if (plataform === 'win32') {
				path = 'C:/temp/some'
			} else {
				console.log('Unrecognized platform. Files cannot be stored.')
			}
		}

		var storage = multer.diskStorage({
			destination: function (req: RequestWithUser, file, cb) {

				if (plataform ==='linux') {
					path = '/home/clients'
				} else {
					if (plataform === 'win32') {
						path = 'C:/temp/clients'
					} else {
						console.log('Unrecognized platform. Files cannot be stored.')
					}
				}

				if (req.database) {
					path = path + '/' + req.database + '/property'
					if (req.params.id) {
						path = path + '/' +req.params.id
					}
				}

				fs.mkdirSync(path, { recursive: true });
				cb(null, path)
			},
			filename: function (req, file, cb) {

				var name: string = moment().format('YYYY-MM-DDTHH:mm:ssZ').toString() + '-' + file.originalname.normalize('NFD').replace(/[\u0300-\u036f]/g, "")

				cb(null, name)
			}
		})
		
		return storage
	}

	public getClaimStorage(): multer.StorageEngine {

		var plataform: string = process.platform
		var path: string = ''

		if (plataform ==='linux') {
			path = '/home/some'
		} else {
			if (plataform === 'win32') {
				path = 'C:/temp/some'
			} else {
				console.log('Se intento uploadear un file in Claim, y...')
				console.log('Unrecognized platform. Files cannot be stored.')
			}
		}

		var storage = multer.diskStorage({
			destination: function (req: RequestWithUser, file, cb) {

				if (plataform ==='linux') {
					path = '/home/clients'
				} else {
					if (plataform === 'win32') {
						path = 'C:/temp/clients'
					} else {
						console.log('Se intento uploadear un file in Claim, y...')
						console.log('Unrecognized platform. Files cannot be stored.')
					}
				}

				if (req.database) {
					path = path + '/' + req.database + '/claim'
				}

				fs.mkdirSync(path, { recursive: true });
				cb(null, path)
			},
			filename: function (req, file, cb) {

				var name: string = moment().format('YYYY-MM-DDTHH:mm:ssZ').toString() + '-' + file.originalname.normalize('NFD').replace(/[\u0300-\u036f]/g, "")

				cb(null, name)
			}
		})
		
		return storage
	}

	public getTransactionStorage(): multer.StorageEngine {

		var plataform: string = process.platform
		var path: string = ''

		if (plataform ==='linux') {
			path = '/home/some'
		} else {
			if (plataform === 'win32') {
				path = 'C:/temp/some'
			} else {
				console.log('Unrecognized platform. Files cannot be stored.')
			}
		}

		var storage = multer.diskStorage({
			destination: function (req: RequestWithUser, file, cb) {

				if (plataform ==='linux') {
					path = '/home/clients'
				} else {
					if (plataform === 'win32') {
						path = 'C:/temp/clients'
					} else {
						console.log('Unrecognized platform. Files cannot be stored.')
					}
				}

				if (req.database) {
					path = path + '/' + req.database + '/transaction'
					if (req.params.folder) {
						path = path + '/' +req.params.folder
					}
				}

				fs.mkdirSync(path, { recursive: true });
				cb(null, path)
			},
			filename: function (req, file, cb) {

				// var name: string = moment().format('YYYY-MM-DDTHH:mm:ssZ').toString() + '-' + file.originalname.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
				var name: string = req.params.name

				cb(null, name)
			}
		})
		
		return storage
	}

}
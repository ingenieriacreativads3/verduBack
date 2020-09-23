import * as multer from 'multer';

export default interface GeteableTransactionStorage {
	getTransactionStorage(): multer.StorageEngine
}
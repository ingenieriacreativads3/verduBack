import { Model, Document } from 'mongoose'

import Responseable from '../../../Domain/Entities/Util/Ports/Responseable'
import Controlleable from '../../../Domain/Entities/Util/Ports/Controlleable'

import GeteableAllTransactionType from '../../../Domain/Entities/TransactionType/Ports/GeteableAll'

export default interface GeteableTransactionType {
	getTransactionType(
		controller: Controlleable,
		transactionTypeId: string,
		transactionTypeService: GeteableAllTransactionType,
		transactionTypeModel: Model<Document, {}>,
	): Promise<Responseable>
}
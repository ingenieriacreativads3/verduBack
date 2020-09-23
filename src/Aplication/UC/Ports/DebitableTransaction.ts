import { Model, Document } from 'mongoose'

import Responseable from '../../../Domain/Entities/Util/Ports/Responseable'
import Controlleable from '../../../Domain/Entities/Util/Ports/Controlleable'

import MovementOfCash from '../../../Domain/Entities/MovementOfCash/Interface'
import SaveableMovementOfCash from '../../../Domain/Entities/MovementOfCash/Ports/Saveable'
import SaveableTransactionTransacion from '../../../Domain/Entities/TransactionTransaction/Ports/Saveable'
import ServiceTransaction from '../../../Domain/Entities/Transaction/Ports/Serviceable'
import ServiceCashBoxType from '../../../Domain/Entities/CashBoxType/Ports/Serviceable'
import ServiceCashBox from '../../../Domain/Entities/CashBox/Ports/Serviceable'
import ServiceUser from '../../../Domain/Entities/User/Ports/Serviceable'
import GeteableAllTransactionType from '../../../Domain/Entities/TransactionType/Ports/GeteableAll'
import GeteableAllPerson from '../../../Domain/Entities/Person/Ports/GeteableAll'

export default interface DebitableTransaction {
	debitTransaction(
		movementOfCashs: MovementOfCash[],
		transactionCreditIds: string[],
		transactionTypeDebitId: string,
		responserService: Responseable,
		controller: Controlleable,
		idUser: string,
		movementOfCashSaveService: SaveableMovementOfCash,
		transactionTransactionSaveService: SaveableTransactionTransacion,
		transactionService: ServiceTransaction,
		cashBoxTypeService: ServiceCashBoxType,
		cashBoxService: ServiceCashBox,
		userService: ServiceUser,
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
	): Promise<Responseable>
}
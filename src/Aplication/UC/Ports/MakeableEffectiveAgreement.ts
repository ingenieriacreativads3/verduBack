import { Model, Document } from 'mongoose'

import Responseable from '../../../Domain/Entities/Util/Ports/Responseable';
import Controlleable from '../../../Domain/Entities/Util/Ports/Controlleable'

import GeteableAllAgreement from '../../../Domain/Entities/Agreement/Ports/GeteableAll'
import UpdateableAgreement from '../../../Domain/Entities/Agreement/Ports/Updateable'
import GeteableAllAgreementStatus from '../../../Domain/Entities/AgreementStatus/Ports/GeteableAll'
import GeteableAllProperty from '../../../Domain/Entities/Property/Ports/GeteableAll'
import GeteableAllService from '../../../Domain/Entities/Service/Ports/GeteableAll'
import SaveableTransaction from '../../../Domain/Entities/Transaction/Ports/Saveable'
import GeteableAllTransaction from '../../../Domain/Entities/Transaction/Ports/GeteableAll'
import SaveableMovementOfService from '../../../Domain/Entities/MovementOfService/Ports/Saveable'
import GeteableAllTransactionType from '../../../Domain/Entities/TransactionType/Ports/GeteableAll'
import GeteableAllPerson from '../../../Domain/Entities/Person/Ports/GeteableAll'
import GeteableAllOrigin from '../../../Domain/Entities/Origin/Ports/GeteableAll'
import GeteableAllServiceType from '../../../Domain/Entities/ServiceType/Ports/GeteableAll'
import GeteableAllPersonType from '../../../Domain/Entities/PersonType/Ports/GeteableAll'
import GeteableAllUser from '../../../Domain/Entities/User/Ports/GeteableAll'
import GeteableAllVatCondition from '../../../Domain/Entities/VatCondition/Ports/GeteableAll'
import GeteableAllMovementOfService from '../../../Domain/Entities/MovementOfService/Ports/GeteableAll'
import TransactionService from '../../../Domain/Entities/Transaction/Ports/Serviceable'
import MovementOfServiceService from '../../../Domain/Entities/MovementOfService/Ports/Serviceable'
import IncreaseableBalance from '../../../Domain/Entities/Transaction/Ports/IncreaseableBalance'

export default interface MakeableEffectiveAgreement {
	makeEffectiveAgreement(
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
		increaseBalanceService: IncreaseableBalance,
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
	): Promise<Responseable>
}
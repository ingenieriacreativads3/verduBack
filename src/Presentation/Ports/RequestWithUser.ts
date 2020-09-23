import { Request } from 'express'
import User from '../../Domain/Entities/User/Interface'
import Agreement from '../../Domain/Entities/Agreement/Interface'

interface RequestWithUser extends Request {
	user: User;
	database: string;
	agreement: Agreement
	file: any
}

export default RequestWithUser;

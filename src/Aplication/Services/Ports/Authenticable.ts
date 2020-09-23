import { Model, Document } from 'mongoose'

import Logueable from '../../../Domain/Entities/User/Ports/Logueable'
import Registrable from '../../../Domain/Entities/User/Ports/Registrable'

import Responseable from '../../../Domain/Entities/Util/Ports/Responseable'

export default interface Authenticable {

	register(
		userData: Registrable,
		database: string,
		model: Model<Document, {}>,
		companyModel: Model<Document, {}>
	): Promise<Responseable>

	login(
		loginData: Logueable,
		database: string,
		model: Model<Document, {}>
	): Promise<Responseable>
}
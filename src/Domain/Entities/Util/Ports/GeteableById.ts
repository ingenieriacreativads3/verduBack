import { Model, Document } from 'mongoose'
import Responseable from './Responseable'

export default interface GeteableById {
	getById(
		id: string,
		model: Model<Document, {}>,
		userModel: Model<Document, {}>
	): Promise<Responseable>
}
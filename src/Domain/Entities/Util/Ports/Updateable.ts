import { Model, Document } from 'mongoose'
import GeteableById from './GeteableById'
import Responseable from './Responseable'

export default interface Updateable extends GeteableById {
	update(
		id: string,
		objData: {},
		model: Model<Document, {}>,
		userModel: Model<Document, {}>,
		idUser: string
	): Promise<Responseable>
}
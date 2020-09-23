import { Model, Document } from 'mongoose'

import ObjInterface from '../Interface'
import Updateableable from '../../Util/Ports/Updateable'
import Responseable from 'Domain/Entities/Util/Ports/Responseable'

export default interface Updateable {
	update(
		id: string,
		obj: {},
		model: Model<Document, {}>,
		idUser: string
	): Promise<Responseable>
}
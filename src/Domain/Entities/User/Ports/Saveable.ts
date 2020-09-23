import { Model, Document } from 'mongoose'

import Registrable from './Registrable'
import ObjInterface from '../Interface'

import Sabeable from '../../Util/Ports/Saveable'
import Responseable from '../../Util/Ports/Responseable'

export default interface Saveable {

	save(
		obj: Registrable,
		model: Model<Document, {}>,
		idUser?: string
	): Promise<Responseable>

}
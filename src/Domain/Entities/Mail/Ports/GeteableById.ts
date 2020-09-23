import { Model, Document } from 'mongoose'

import ObjInterface from '../Interface'
import Responseable from '../../Util/Ports/Responseable'

import GeteableByIdable from '../../Util/Ports/GeteableById'

export default interface GeteableById {
	getById(
		id: string,
		model: Model<Document, {}>,
		controllerService: GeteableByIdable
	): Promise<Responseable>
}
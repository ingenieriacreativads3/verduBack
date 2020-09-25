import { Model, Document } from 'mongoose'

import Registrable from './Registrable'

import Responseable from '../../Util/Ports/Responseable'

export default interface Saveable {

	save(
		obj: Registrable,
		model: Model<Document, {}>,
		userModel: Model<Document, {}>,
		providerModel: Model<Document, {}>,
		idUser: string
	): Promise<Responseable>

}
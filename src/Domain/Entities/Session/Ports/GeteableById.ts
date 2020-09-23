import { Model, Document } from 'mongoose'

import Responseable from '../../Util/Ports/Responseable'

export default interface GeteableById {
	getById(
		id: string,
		model: Model<Document, {}>,
	): Promise<Responseable>
}
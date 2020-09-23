import { Model, Document } from 'mongoose'

import Responseable from '../../Util/Ports/Responseable'

export default interface GeteableAll {
	getAll(
		model: Model<Document, {}>,
		project: {},
		match: {},
		sort: {},
		group: {},
		limit: number,
		skip: number
	): Promise<Responseable>
}
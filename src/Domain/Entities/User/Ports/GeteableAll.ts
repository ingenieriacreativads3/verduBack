import { Model, Document } from 'mongoose'

import Responseable from '../../Util/Ports/Responseable'

import GeteableableAll from '../../Util/Ports/GeteableAll'

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
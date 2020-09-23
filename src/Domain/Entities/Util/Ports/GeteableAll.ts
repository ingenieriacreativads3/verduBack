import { Model, Document } from 'mongoose'
import GeteableById from './GeteableById'
import Responseable from './Responseable'

export default interface GeteableAll extends GeteableById {

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
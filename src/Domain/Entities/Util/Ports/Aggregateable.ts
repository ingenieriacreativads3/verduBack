import { Model, Document } from 'mongoose'
import Responseable from './Responseable'

export default interface Aggregateable {

	aggregate(
		model: Model<Document, {}>,
		aggregation: any[],
	): Promise<Responseable>

}
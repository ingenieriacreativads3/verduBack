import { Model, Document } from 'mongoose'
import GeteableById from '../../Util/Ports/GeteableById'
import Responseable from '../../Util/Ports/Responseable'

export default interface IsableEnable {
	isEnable(
		id: string,
		model: Model<Document, {}>
	): Promise<Responseable>
}
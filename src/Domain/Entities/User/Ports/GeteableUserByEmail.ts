import { Model, Document } from 'mongoose'

import ObjInterface from '../Interface'
import GeteableAll from '../../Util/Ports/GeteableAll'
import Responseable from 'Domain/Entities/Util/Ports/Responseable'

export default interface GeteableUserByEmail {
	getUserByEmail(
		email: string,
		model: Model<Document, {}>
	): Promise<Responseable>
}
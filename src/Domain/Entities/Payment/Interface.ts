import { Schema } from 'mongoose'
import InterfaceUtil from './../Util/Ports/Dtoable'

export default interface Interface extends InterfaceUtil {

	provider: Schema.Types.ObjectId
	totalPrice: number
	
}
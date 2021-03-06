import { Schema } from 'mongoose'
import InterfaceUtil from './../Util/Ports/Dtoable'

export default interface Interface extends InterfaceUtil {

	totalPrice: number
	turn: string
	paymentMethod: Schema.Types.ObjectId
	
}
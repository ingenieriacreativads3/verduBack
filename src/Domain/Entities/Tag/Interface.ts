import { Schema } from 'mongoose'
import InterfaceUtil from './../Util/Ports/Dtoable'

export default interface Interface extends InterfaceUtil {

	name: string
	price: number
	cost: number
	item: Schema.Types.ObjectId
	
}
import { Schema } from 'mongoose'
import InterfaceUtil from './../Util/Ports/Dtoable'

export default interface Interface extends InterfaceUtil {

	employee: Schema.Types.ObjectId
	start: Date
	end: Date
	
}
import { Schema } from 'mongoose'
import { injectable } from 'inversify';

import Schemable from '../Util/Model'
import Nameable from '../Util/Ports/Nameable'

@injectable()
export default class ENTITY_SCHEMA extends Schemable implements Nameable {
	
	public name: string

	constructor() {

		let entity: string = 'schedule'

		super({

			employee: {
				ref: 'employee',
				typed: 'id',
				type: Schema.Types.ObjectId,
			},
			start: {
				type: Date,
				typed: 'date'
			},
			end: {
				type: Date,
				typed: 'date'
			},
			startNumber: {
				type: Number,
				typed: 'number'
			},
			endNumber: {
				type: Number,
				typed: 'number'
			},
			entity: { // este json no se toca
				type: String,
				typed: entity
			}
	
		}, { 
			collection: entity
		})

		this.name = entity

	}
}
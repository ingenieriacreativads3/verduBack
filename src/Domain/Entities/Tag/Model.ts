import { Schema } from 'mongoose'
import { injectable } from 'inversify';

import Schemable from '../Util/Model'
import Nameable from '../Util/Ports/Nameable'

@injectable()
export default class ENTITY_SCHEMA extends Schemable implements Nameable {
	
	public name: string

	constructor() {

		let entity: string = 'bank'

		super({

			name: {
				type: String,
				typed: 'string'
			},
			price: {
				type: Number,
				typed: 'number'
			},
			cost: {
				type: Number,
				typed: 'number'
			},
			item: {
				ref: 'item',
				typed: 'id',
				type: Schema.Types.ObjectId,
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
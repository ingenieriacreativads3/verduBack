import { Schema } from 'mongoose'
import { injectable } from 'inversify';

import Schemable from '../Util/Model'
import Nameable from '../Util/Ports/Nameable'

@injectable()
export default class ENTITY_SCHEMA extends Schemable implements Nameable {
	
	public name: string

	constructor() {

		let entity: string = 'payment'

		super({

			provider: {
				ref: 'provider',
				typed: 'id',
				type: Schema.Types.ObjectId,
			},
			totalPrice: {
				type: Number,
				typed: 'number'
			},
			turn: {
				type: String,
				typed: 'string'
			},
			who: {
				type: String,
				typed: 'string'
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
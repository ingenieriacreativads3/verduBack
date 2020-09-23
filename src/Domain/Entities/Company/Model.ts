import { Schema } from 'mongoose'
import { injectable } from 'inversify'

import Schemable from '../Util/Model'
import Nameable from '../Util/Ports/Nameable'

@injectable()
export default class ENTITY_SCHEMA extends Schemable implements Nameable {
	
	public name: string

	constructor() {
		super({

			name: {
				type: String,
				typed: 'string'
			},
			logo: {
				type: String,
				typed: 'string'
			},
			cuit: {
				type: String,
				typed: 'string'
			},
			fantasyName: {
				type: String,
				typed: 'string'
			},
			businessName: {
				type: String,
				typed: 'string'
			},

		}, {
			collection: 'company'
		})

		this.name = 'company'

	}
}
import Schema from '../Util/Model'
import Nameable from '../Util/Ports/Nameable'
import { injectable } from 'inversify';

@injectable()
export default class ENTITY_SCHEMA extends Schema implements Nameable {
	
	public name: string

	constructor() {
		super({
			name: {
				type: String,
				typed: 'string'
			},
			email: {
				type: String,
				typed: 'string',
				lowercase: true,
			},
			password: {
				type: String,
				typed: 'string'
			},
			enabled: {
				type: Boolean,
				typed: 'string',
				default: false,
			},
			token: {
				type: String,
				typed: 'string'
			},
			tokenExpiration: {
				type: Number,
				typed: 'string',
				default: 1440
			},
		}, {
			collection: 'user'
		})

		this.name = 'user'

	}
}
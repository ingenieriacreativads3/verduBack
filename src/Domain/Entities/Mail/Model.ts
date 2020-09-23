import Schemable from '../Util/Model'
import Nameable from '../Util/Ports/Nameable'

export default class ENTITY_SCHEMA extends Schemable implements Nameable {
	
	public name: string

	constructor() {
		super({

			to: {
				type: String,
			},
			subject: {
				type: String,
			},
			body: {
				type: String,
			},
			nameFile: {
				type: String,
			},
			folder: {
				type: String,
			}

		})

		this.name = 'mail'

	}
}
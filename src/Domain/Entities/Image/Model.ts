import Schemable from '../Util/Model'
import Nameable from '../Util/Ports/Nameable'

export default class ENTITY_SCHEMA extends Schemable implements Nameable {
	
	public name: string

	constructor() {
		super({

			name: {
				type: String,
				
			}

		})

		this.name = 'image'

	}
}
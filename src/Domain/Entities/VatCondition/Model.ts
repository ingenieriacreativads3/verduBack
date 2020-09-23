import Schemable from '../Util/Model'
import Nameable from '../Util/Ports/Nameable'

export default class ENTITY_SCHEMA extends Schemable implements Nameable {
	
	public name: string

	constructor() {
		super({

			letter: {
				type: String,
				enum: ['A', 'B', 'C', 'E', 'X', 'R', ''],
				default: ''
			},
			discriminate: {
				type: Boolean,
			},
			description: {
				type: String,
			},
			code: {
				type: Number,
			},


		})

		this.name = 'vatCondition'

	}
}
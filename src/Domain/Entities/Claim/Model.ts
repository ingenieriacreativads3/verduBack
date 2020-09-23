import Schemable from '../Util/Model'
import Nameable from '../Util/Ports/Nameable'

export default class ENTITY_SCHEMA extends Schemable implements Nameable {
	
	public name: string

	constructor() {
		super({

			name: {
				type: String
			},
			description: {
				type: String
			},
			type: {
				type: String,
				enum: [ClaimType.Err, ClaimType.Implementation, ClaimType.Improvement, ClaimType.Suggestion],
				default: ClaimType.Suggestion
			},
			priority: {
				type: String,
				enum: [ClaimPriority.Half, ClaimPriority.High, ClaimPriority.Low],
				default: ClaimPriority.Low
			},
			author: {
				type: String
			},
			email: {
				type: String
			},
			listName: {
				type: String
			},
			file: {
				type: String
			}

		})

		this.name = 'claim'

	}
}

export enum ClaimPriority {
	High = <any> "Alta",
	Half = <any> "Media",
	Low = <any> "Baja",
}

export enum ClaimType {
	Suggestion = <any> "Sugerencia",
	Improvement = <any> "Mejora",
	Err = <any> "Error",
	Implementation = <any> "Nueva Implementación",
}
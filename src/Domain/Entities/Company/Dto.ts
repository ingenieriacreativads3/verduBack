import { IsDefined, IsString, IsNumber } from 'class-validator';
import { Schema } from 'mongoose'
import { injectable } from 'inversify'

import DtoUtil from '../Util/Dto'
import Interface from './Interface'

@injectable()
export default class EntityDto extends DtoUtil implements Interface {

	public name: string
	public logo: string
	public cuit: string
	public fantasyName: string
	public businessName: string
	public vatCondition: Schema.Types.ObjectId

}

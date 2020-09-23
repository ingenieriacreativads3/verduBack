import { IsDefined, IsString } from 'class-validator';
import Validable from "../Validable";
import DtoUtil from '../Util/Dto'

export default class EntityDto implements Validable {

	@IsDefined()
	@IsString()
	public name: string

}

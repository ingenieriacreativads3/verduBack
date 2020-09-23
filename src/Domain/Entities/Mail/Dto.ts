import { IsDefined, IsString } from 'class-validator';
import Validable from "../Validable";
import DtoUtil from '../Util/Dto'

export default class EntityDto implements Validable {

	@IsDefined()
	@IsString()
	public to: string
	@IsDefined()
	@IsString()
	public subject: string
	@IsDefined()
	@IsString()
	public body: string

	public nameFile: string

	public folder: string

}

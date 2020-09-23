import { IsDefined, IsString } from 'class-validator';
import Validable from "../Validable";
import DtoUtil from '../Util/Dto'

export default class EntityDto implements Validable {

	@IsDefined()
	public totalPrice: number
	@IsDefined()
	public origin: number
	@IsDefined()
	public letter: string
	@IsDefined()
	public CUIT: number
	public identificationType: string
	public identificationValue: number
	
}

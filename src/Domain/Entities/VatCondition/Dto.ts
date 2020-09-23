import { IsDefined, IsString } from 'class-validator';
import Validable from "../Validable";
import DtoUtil from '../Util/Dto'

export default class EntityDto implements Validable {

	public letter: string
	public discriminate: boolean
	public description: string
	public code: number

}

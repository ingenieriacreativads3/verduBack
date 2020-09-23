import { IsDefined, IsString } from 'class-validator';
import Validable from "../Validable";
import DtoUtil from '../Util/Dto'

import { ClaimType, ClaimPriority } from './Model'

export default class EntityDto implements Validable {

	public name: string
	public description: string
	public type: ClaimType
	public priority: ClaimPriority
	public author: string
	public email: string
	public listName: string
	public file: string

}

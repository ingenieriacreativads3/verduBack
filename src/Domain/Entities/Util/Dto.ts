import { IsArray, IsBoolean, IsDefined, IsEmail, IsNumber, IsString, MinLength, ValidateIf } from 'class-validator'
import Interface from './Ports/Dtoable'
import { injectable } from 'inversify'

import User from '../User/Interface'

@injectable()
class DtoUtil implements Interface {
	
	public _id: string
	
	public creationUser: User
	public creationDate: Date
	
	@IsString()
	public operationType: string
	public updateUser: User
	public updateDate: Date
	public observation: string

}

export default DtoUtil
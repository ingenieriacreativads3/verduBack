import { IsArray, IsDefined, IsEmail, IsNumber, IsString, MinLength, ValidateIf } from 'class-validator'
import { Schema } from 'mongoose'
import { injectable } from 'inversify'

import DtoUtil from '../Util/Dto'
import Interface from './Interface'

@injectable()
export default class EntityDto extends DtoUtil implements Interface {

	@ValidateIf(o => o.name !== undefined)
	@IsString()
	public name: string;

	@IsDefined()
	@IsEmail({}, {
		message: "Se debe ingresar un email válido."
	})
	public email: string;

	@ValidateIf(o => o.password !== undefined)
	@MinLength(6,{
		message: "La contraseña debe tener minimo 6 carácteres."
	})
	@IsString()
	public password: string;

	@ValidateIf(o => o.password !== undefined)
	public enabled: boolean;

	@ValidateIf(o => o.token !== undefined)
	@IsString()
	public token: string;

	@ValidateIf(o => o.tokenExpiration !== undefined)
	@IsNumber()
	public tokenExpiration: number;

}

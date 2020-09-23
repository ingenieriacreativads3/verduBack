import { Schema } from 'mongoose'

import Registrable from './Ports/Registrable'
import Enableable from './Ports/Enableable'
import InterfaceUtil from './../Util/Ports/Dtoable'

export default interface Interface extends InterfaceUtil, Registrable, Enableable {
	name: string,
	token: string,
	tokenExpiration: number,
}
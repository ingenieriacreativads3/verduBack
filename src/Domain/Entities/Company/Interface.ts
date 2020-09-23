import { Schema } from 'mongoose'

import Registrable from './Ports/Registrable';

import Identificable from '../Identificable';
import OperationableType from '../OperationableType'

export default interface Interface extends Identificable, Registrable, OperationableType {

	name: string
	logo: string
	cuit: string
	fantasyName: string
	businessName: string
	
}
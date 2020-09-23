import Registrable from './Ports/Registrable';

import Identificable from '../Identificable';
import OperationableType from '../OperationableType'

import { ClaimType, ClaimPriority } from './Model'


export default interface Interface extends Identificable, Registrable, OperationableType {

	name: string
	description: string
	type: ClaimType
	priority: ClaimPriority
	author: string
	email: string
	listName: string
	file: string
	
}
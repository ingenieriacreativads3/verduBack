import Registrable from './Ports/Registrable';

import Identificable from '../Identificable';
import OperationableType from '../OperationableType'

export default interface Interface extends Identificable, Registrable, OperationableType {

	letter: string
	discriminate: boolean
	description: string
	code: number
	
}
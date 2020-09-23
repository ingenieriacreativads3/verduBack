import Registrable from './Ports/Registrable';

import Identificable from '../Identificable';
import OperationableType from '../OperationableType'

export default interface Interface extends Identificable, Registrable, OperationableType {

	to: string
	subject: string
	body: string
	nameFile: string
	folder: string
	
}
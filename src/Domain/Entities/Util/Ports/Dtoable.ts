import Registrable from './../../Registrable'
import Identificable from './../../Identificable'
import OperationableType from './../../OperationableType'
import Observationable from './../../Observationable'
import Validable from './../../Validable'

export default interface Dtoable extends 
	Registrable,
	Identificable,
	OperationableType,
	Observationable,
	Validable {

	creationUser: string | {}
	creationDate: string | Date
	updateUser: string | {}
	updateDate: string | Date

}
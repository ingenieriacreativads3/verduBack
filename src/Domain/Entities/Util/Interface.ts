import Registrable from '../Registrable'
import OperationableType from '../OperationableType'
import Identificable from '../Identificable'
import Observationable from '../Observationable'

export default interface Interface extends 
  Registrable,
  OperationableType,
  Identificable,
  Observationable {}
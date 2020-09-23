import ExistableUserWithThatEmail from './ExistableUserWithThatEmail'
import Saveable from './Saveable'
import GeteableAll from './GeteableAll'
import GeteableById from './GeteableById'
import HashablePassword from './HashablePassword'
import Updateable from './Updateable'
import IsableEnable from './IsableEnable'
import IsableMatch from './IsableMatch'
import GeteableUserByEmail from './GeteableUserByEmail'

export default interface Serviceable extends
	ExistableUserWithThatEmail,
	Saveable,
	GeteableAll,
	GeteableById,
	HashablePassword,
	Updateable,
	IsableEnable,
	IsableMatch,
	GeteableUserByEmail {}
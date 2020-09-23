import Responseable from '../../Util/Ports/Responseable'
export default interface HashablePassword {
	hashPassword(
		pass: string
	): Promise<Responseable>
}
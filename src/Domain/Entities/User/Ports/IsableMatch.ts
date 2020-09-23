import Responseable from '../../Util/Ports/Responseable'

export default interface IsableMatch {
	isMatch(
		loginPass: string,
		userPass: string
	): Promise<Responseable>
}
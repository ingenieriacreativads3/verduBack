import Responseable from '../../../Domain/Entities/Util/Ports/Responseable'

export default interface GeteableBoardId {
	getBoardId(
		responserService: Responseable,
		shortURL: string,
		key: string,
		token: string
	): Promise<Responseable>
}
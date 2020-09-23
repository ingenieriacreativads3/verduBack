import Responseable from '../../../Domain/Entities/Util/Ports/Responseable'

export default interface GeteableListId {
	getListId(
		name: string,
		responserService: Responseable,
		boardId: string,
		key: string,
		token: string
	): Promise<Responseable>
}
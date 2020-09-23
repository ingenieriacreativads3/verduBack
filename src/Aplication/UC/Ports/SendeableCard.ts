import Responseable from '../../../Domain/Entities/Util/Ports/Responseable'

export default interface GeteableBoardId {
	sendCard(
		claimName: string,
		claimDescription: string,
		responserService: Responseable,
		listId: string,
		key: string,
		token: string
	): Promise<Responseable>
}
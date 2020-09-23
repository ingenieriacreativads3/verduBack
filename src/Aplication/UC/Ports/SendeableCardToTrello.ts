import Responseable from '../../../Domain/Entities/Util/Ports/Responseable'
import GeteableBoardId from './GeteableBoardId'

export default interface SendeableCardToTrello {
	sendCardToTrello(
		responserService: Responseable,
		trelloService: GeteableBoardId,
		claimName: string,
		claimDescription: string,
		database: string
	): Promise<Responseable>
}
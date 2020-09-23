import Responseable from '../../../Domain/Entities/Util/Ports/Responseable'

export default interface SaveableCard {
	saveCard(
		labelId: string,
		responserService: Responseable,
		cardId: string,
		key: string,
		token: string
	): Promise<Responseable>
}
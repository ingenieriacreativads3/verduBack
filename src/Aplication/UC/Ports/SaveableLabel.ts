import Responseable from '../../../Domain/Entities/Util/Ports/Responseable'

export default interface SaveableLabel {
	saveLabel(
		label: string,
		color: string,
		responserService: Responseable,
		boardId: string,
		key: string,
		token: string
	): Promise<Responseable>
}
import Responseable from '../../../Domain/Entities/Util/Ports/Responseable'

export default interface GeteableLabelId {
	getLabelId(
		name: string,
		responserService: Responseable,
		boardId: string,
		key: string,
		token: string
	): Promise<Responseable>
}
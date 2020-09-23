import Tokenizable from '../../Aplication/Services/Ports/Tokenizable'

export default interface CreateableCookie {
	createCookie(token: Tokenizable): string
}
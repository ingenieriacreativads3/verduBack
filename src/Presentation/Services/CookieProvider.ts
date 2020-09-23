import CreateableCookie from '../Ports/CreateableCookie'
import Tokenizable from '../../Aplication/Services/Ports/Tokenizable'

export default class CookieProvider implements CreateableCookie {

	createCookie(token: Tokenizable): string {

		let cookie: string = `Authorization=${token.token}; path=/; HttpOnly; Max-Age=${token.expiresIn}`

		return cookie

	}
	
}
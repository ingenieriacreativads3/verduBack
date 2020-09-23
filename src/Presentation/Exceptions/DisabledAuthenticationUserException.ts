import HttpException from './HttpException'

class DisabledAuthenticationUserException extends HttpException {
	constructor() {
		super(401, 'Disabled authentication user');
	}
}

export default DisabledAuthenticationUserException;

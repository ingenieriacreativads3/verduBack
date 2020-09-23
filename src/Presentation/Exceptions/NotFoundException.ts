import HttpException from './HttpException'

class NotFoundException extends HttpException {
	constructor(id: string) {
		super(404, `Id ${id} not found`);
	}
}

export default NotFoundException;

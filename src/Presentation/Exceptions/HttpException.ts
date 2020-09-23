export default class HttpException{
	public status: number;
	public message: string;
	constructor(status: number, message: string) {
		//super(message.toString());
		this.status = status;
		this.message = message.toString();
	}
}
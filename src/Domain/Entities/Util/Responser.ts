import Responseable from "./Ports/Responseable";
import { injectable } from 'inversify';

@injectable()
export default class Responser implements Responseable {
	public result: any;
	public message: string;
	public error: any;
	public status: number;
}
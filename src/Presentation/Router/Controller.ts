import { Express } from "express";
import Routeable from '../Controllers/Ports/Routeable'
import Initiable from '../Ports/Initiable'

export default class Router implements Initiable {

	public init(app: Express, controllers: Routeable[]) {
		controllers.forEach((controller) => {
			app.use('/', controller.router);
		})
	}

}
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as cors from 'cors'
import { Express } from 'express'
import * as express from 'express'
import { injectable, inject, named, multiInject } from 'inversify';
import "reflect-metadata";

import TYPES from './TYPES';
import container from './inversify.config';

import Routeable from './Presentation/Controllers/Ports/Routeable'
import Initiable from './Presentation/Ports/Initiable'

import ErrorMiddleware from './Presentation/Middlewares/Error'
import Appeable from 'Appeable'

@injectable()
export default class App implements Appeable {

	public app: Express = express();
	@multiInject(TYPES.Routeable) public controllers: Routeable[] = []

	constructor() {
		this.initializeMiddlewares();
		this.initializeErrorHandling();
	}
	
	public async run(router: Initiable) {

		this.listen()
		router.init(this.app, this.controllers)

	}

	public listen(): void {
		const port = 303
		this.app.listen(port, function() {
				console.log("Server is running in port " + port)
		});
	}

	public getServer(): Express {
		return this.app
	}

	private initializeMiddlewares() {
		this.app.use(bodyParser.urlencoded({ extended: true }))
		this.app.use(bodyParser.json())
		this.app.use(cookieParser())
		this.app.use('*', cors())
	}

	private initializeErrorHandling() {
		this.app.use(ErrorMiddleware);
	}

}
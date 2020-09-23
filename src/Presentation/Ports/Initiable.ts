import { Express } from 'express'
import Routeable from '../Controllers/Routeable'

export default interface Initiable {
	init(app: Express, controllers: Routeable[]): void
}
import { NextFunction, Response } from 'express'
import RequestWithUser from '../../Ports/RequestWithUser'

export default interface Authenticateable {
	authenticate(
		request: RequestWithUser,
		response: Response,
		next: NextFunction
	): Promise<void>
}
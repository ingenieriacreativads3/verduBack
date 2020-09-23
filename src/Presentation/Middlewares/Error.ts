import { NextFunction, Request, Response } from 'express'
import HttpException from '../Exceptions/HttpException'

export default function errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {
	const status = error.status || 500;
	const message = error.message || 'Something went wrong'
	const result: { message: string, status: number } = { message, status }
	response
		.status(status)
		.send({result: 'asd'})
}
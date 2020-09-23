import axios, { AxiosResponse } from 'axios';

import Responseable from '../../../Domain/Entities/Util/Ports/Responseable'

import TrelloService from '../Ports/TrelloService';

export default class Controller implements TrelloService {

	public async getBoardId(
		responserService: Responseable,
		shortURL: string,
		key: string,
		token: string
	){

		return new Promise<Responseable>( async (resolve, reject) => {

			await axios.get('https://api.trello.com/1/boards/' + shortURL, {
				params: {
					key: key,
					token: token
				}
			}).then((res: AxiosResponse) => {
				if(res !== undefined) {
					responserService = {
						result: res.data.id,
						message: res.statusText,
						error: {},
						status: res.status,
					}
					if(res.status == 200) {
						resolve(responserService)
					} else {
						reject(responserService)
					}
				} else {
					responserService = { result: {}, message: 'No se pudo realizar la consulta', error: {}, status: 500 }
					reject(responserService)
				}
			}).catch((res: any) => {
				responserService = {
					result: {},
					message: 'No se pudo obtener el board desde trello',
					error: res,
					status: 500
				}
				reject(responserService)
			})
			
		})

	}

	public async getListId(
		name: string,
		responserService: Responseable,
		boardId: string,
		key: string,
		token: string
	){

		return new Promise<Responseable>( async (resolve, reject) => {

			await axios.get(`https://api.trello.com/1/boards/${boardId}/lists`, {
				params: {
					key: key,
					token: token
				}
			}).then((res: AxiosResponse) => {
				if(res !== undefined) {

					let resolveList: {
						id: string,
						name: string
					} = {
						id: '',
						name: ''
					};
					res.data.map((list: {
						id: string,
						name: string
					}) => {
						if (list.name === name) {
							resolveList = list;
						}
					})

					responserService = {
						result: resolveList.id,
						message: res.statusText,
						error: {},
						status: res.status,
					}
					if(res.status == 200) {
						resolve(responserService)
					} else {
						reject(responserService)
					}
				} else {
					responserService = { result: {}, message: 'No se pudo realizar la consulta', error: {}, status: 500 }
					reject(responserService)
				}
			}).catch((err: any) => {
				responserService = {
					result: {},
					message: 'No se pudo obtener el board desde trello',
					error: err,
					status: 500
				}
				reject(responserService)
			})
			
		})

	}

	public async sendCard(
		claimName: string,
		claimDescription: string,
		responserService: Responseable,
		listId: string,
		key: string,
		token: string
	){

		return new Promise<Responseable>( async (resolve, reject) => {

			let url: string = 'https://api.trello.com/1/cards'

			url = url + '?'
			url = url + 'name=' + claimName
			url = url + '&desc=' + claimDescription
			url = url + '&pos=top'
			url = url + '&subscribed=true'
			url = url + '&idList=' + listId
			url = url + '&keepFromSource=all'
			url = url + '&key=' + key
			url = url + '&token=' + token

			await axios.post(url).then((res: AxiosResponse) => {
				if(res !== undefined) {

					responserService = {
						result: res.data,
						message: res.statusText,
						error: {},
						status: res.status,
					}
					if(res.status == 200) {
						resolve(responserService)
					} else {
						reject(responserService)
					}
				} else {
					responserService = { result: {}, message: 'No se pudo realizar la consulta', error: {}, status: 500 }
					reject(responserService)
				}
			}).catch((err: any) => {
				responserService = {
					result: {},
					message: 'No se pudo obtener el board desde trello',
					error: err,
					status: 500
				}
				reject(responserService)
			})
			
		})

	}

	public async saveCard(
		labelId: string,
		responserService: Responseable,
		cardId: string,
		key: string,
		token: string
	){

		return new Promise<Responseable>( async (resolve, reject) => {

			let url: string = `https://api.trello.com/1/cards/${cardId}/idLabels`

			url = url + '?'
			url = url + 'value=' + labelId
			url = url + '&key=' + key
			url = url + '&token=' + token

			await axios.post(url).then((res: AxiosResponse) => {
				if(res !== undefined) {

					responserService = {
						result: res.data,
						message: res.statusText,
						error: {},
						status: res.status,
					}
					if(res.status == 200) {
						resolve(responserService)
					} else {
						reject(responserService)
					}
				} else {
					responserService = { result: {}, message: 'No se pudo realizar la consulta', error: {}, status: 500 }
					reject(responserService)
				}
			}).catch((err: any) => {
				responserService = {
					result: {},
					message: 'No se pudo obtener el board desde trello',
					error: err,
					status: 500
				}
				reject(responserService)
			})
			
		})

	}

	public async saveLabel(
		label: string,
		color: string,
		responserService: Responseable,
		boardId: string,
		key: string,
		token: string
	){

		return new Promise<Responseable>( async (resolve, reject) => {

			let url: string = `https://api.trello.com/1/labels`

			url = url + '?'
			url = url + 'name=' + label
			url = url + '&color=' + color
			url = url + '&idBoard=' + boardId
			url = url + '&key=' + key
			url = url + '&token=' + token

			await axios.post(url).then((res: AxiosResponse) => {
				if(res !== undefined) {

					responserService = {
						result: res.data,
						message: res.statusText,
						error: {},
						status: res.status,
					}
					if(res.status == 200) {
						resolve(responserService)
					} else {
						reject(responserService)
					}
				} else {
					responserService = { result: {}, message: 'No se pudo realizar la consulta', error: {}, status: 500 }
					reject(responserService)
				}
			}).catch((err: any) => {
				responserService = {
					result: {},
					message: 'No se pudo obtener el board desde trello',
					error: err,
					status: 500
				}
				reject(responserService)
			})
			
		})

	}

	public async getLabelId(
		name: string,
		responserService: Responseable,
		boardId: string,
		key: string,
		token: string
	){

		return new Promise<Responseable>( async (resolve, reject) => {

			await axios.get(`https://api.trello.com/1/boards/${boardId}/labels`, {
				params: {
					key: key,
					token: token
				}
			}).then((res: AxiosResponse) => {
				if(res !== undefined) {

					let isFind: boolean = false

					let resolveLabel: {
						id: string,
						name: string
					} = {
						id: '',
						name: ''
					};
					res.data.map((label: {
						id: string,
						name: string
					}) => {
						if (label.name === name) {
							isFind = true
							resolveLabel = label;
						}
					})

					responserService = {
						result: resolveLabel.id,
						message: res.statusText,
						error: {},
						status: res.status,
					}

					
					if(res.status == 200) {
						if(!isFind) {
							responserService = {
								result: resolveLabel.id,
								message: res.statusText,
								error: {},
								status: 404,
							}
						}
						resolve(responserService)
					} else {
						reject(responserService)
					}
				} else {
					responserService = { result: {}, message: 'No se pudo realizar la consulta', error: {}, status: 500 }
					reject(responserService)
				}
			}).catch((err: any) => {
				responserService = {
					result: {},
					message: 'No se pudo obtener el board desde trello',
					error: err,
					status: 500
				}
				reject(responserService)
			})
			
		})

	}

}
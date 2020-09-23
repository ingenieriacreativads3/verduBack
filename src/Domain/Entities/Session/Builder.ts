import { Model, Document } from 'mongoose'
import { injectable, inject } from 'inversify';
import TYPES from './../../../TYPES'

import Responseable from '../Util/Ports/Responseable'
import GeteableAll from '../Util/Ports/GeteableAll'
import Saveable from '../Util/Ports/Saveable'
import Updateable from '../Util/Ports/Updateable'

import Builderable from './Ports/Builderable'

import Interface from './Interface'

@injectable()
export default class Builder implements Builderable {

  @inject(TYPES.ResponseableDomain) private responserService: Responseable
  @inject(TYPES.Saveable) private saveableService: Saveable
  @inject(TYPES.GeteableAll) private geteableAllService: GeteableAll
  @inject(TYPES.SessionInterface) private session: Interface

  getInstance(requiered: any[]): Promise<Responseable> {
    return new Promise<Responseable>( async (resolve, reject) => {

      //requiere el model de user, para buscar
      //el id de user

      let sessionModel: Model<Document, {}> = requiered[0]
      let userId: string = requiered[1]

      await this.saveableService.save(this.session, sessionModel, sessionModel, userId)
				.then(async (res: Responseable) => {
					if(res && res.result !== undefined) {
						
						this.responserService = { result: res.result, message: res.message, error: res.error, status: res.status }
						
            if(res.status === 200) {

							let match = {
								_id: {
									$oid: res.result._id
								}
							}
	
							await this.geteableAllService.getAll(sessionModel, {}, match, {}, {}, 1, 0)
								.then((res: Responseable) => {
									this.responserService = { result: res.result, message: res.message, error: res.error, status: res.status }
									if(res.status === 200) {
										resolve(this.responserService)
									} else {
										reject(this.responserService)
									}
								}).catch((err: Responseable) => {
									this.responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
									reject(this.responserService)
								})

            } else {
              reject(this.responserService)
            }
					} else {
						this.responserService = { result: 'Nop', message: 'La capa superior contesto undefined', error: '', status: 500 }
			      reject(this.responserService)
					}
				}).catch((err: Responseable) => {
					this.responserService = { result: err.result, message: err.message, error: err.error, status: err.status }
			    reject(this.responserService)
				})
    })
  }
  
}
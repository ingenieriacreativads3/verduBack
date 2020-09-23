import 'dotenv/config'

import TYPES from './TYPES'
import container from './inversify.config'

import Appeable from './utils/Appeable'

import RouterApp from './Presentation/Router/Controller'

const routerApp: RouterApp = new RouterApp()

const app = container.get<Appeable>(TYPES.Appeable)

app.run(routerApp);
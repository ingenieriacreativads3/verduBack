import { Container, interfaces } from "inversify";
import { Router } from 'express'
import TYPES from "./TYPES";

// Interfaces
// Single
import Appeable from './utils/Appeable'

import Authenticable from './Aplication/Services/Ports/Authenticable'
import CreateableToken from './Aplication/Services/Ports/CreateableToken'

import Responseable from './Presentation/Controllers/Responseable'
import Routeable from './Presentation/Controllers/Ports/Routeable'
import Authenticateable from './Presentation/Middlewares/Ports/Authenticateable'

import ConnectionableProvider from './Infrastructure/Persistence/Ports/ConnectionableProvider'
import GeteableModel from './Infrastructure/Persistence/Ports/GeteableModel'

import Validateable from './Domain/Middleware/Ports/Validateable'
import Validable from './Domain/Entities/Util/Ports/Validable'
import Schemable from './Domain/Entities/Util/Ports/Schemable'
import ResponseableDomain from './Domain/Entities/Util/Ports/Responseable'

import Controlleable from './Domain/Entities/Util/Ports/Controlleable'
import GeteableAll from './Domain/Entities/Util/Ports/GeteableAll'
import GeteableById from './Domain/Entities/Util/Ports/GeteableById'
import Updateable from './Domain/Entities/Util/Ports/Updateable'
import Saveable from './Domain/Entities/Util/Ports/Saveable'

// Repeat
import GeteableCompanyStorage from './Presentation/Controllers/Ports/GeteableCompanyStorage'

import UserServiceableDomain from './Domain/Entities/User/Ports/Serviceable'
import BankServiceableDomain from './Domain/Entities/Bank/Ports/Serviceable'
import CompanyServiceableDomain from './Domain/Entities/Company/Ports/Serviceable'
import SessionServiceableDomain from './Domain/Entities/Session/Ports/Serviceable'
import SaleServiceableDomain from './Domain/Entities/Sale/Ports/Serviceable'
import ProviderServiceableDomain from './Domain/Entities/Provider/Ports/Serviceable'
import PaymentServiceableDomain from './Domain/Entities/Payment/Ports/Serviceable'
import PaymentMethodServiceableDomain from './Domain/Entities/PaymentMethod/Ports/Serviceable'

import UserInterface from './Domain/Entities/User/Interface'
import BankInterface from './Domain/Entities/Bank/Interface'
import CompanyInterface from './Domain/Entities/Company/Interface'
import SessionInterface from './Domain/Entities/Session/Interface'
import SaleInterface from './Domain/Entities/Sale/Interface'
import ProviderInterface from './Domain/Entities/Provider/Interface'
import PaymentInterface from './Domain/Entities/Payment/Interface'
import PaymentMethodInterface from './Domain/Entities/PaymentMethod/Interface'

import SessionBuilderable from './Domain/Entities/Session/Ports/Builderable'

// Implementations
// Single
import App from './app'

import AuthenticationAplication from './Aplication/Services/Authentication'
import TokenProvider from './Aplication/Services/TokenProvider'

import Responser from './Presentation/Controllers/Util/Responser'
import Authentication from './Presentation/Middlewares/Authentication'
import Storage from './Presentation/Controllers/Util/AgreementStorage'

import ConnectionProvider from './Infrastructure/Persistence/ConnectionProvider'

import Validation from './Domain/Middleware/Validation'
import Controller from './Domain/Entities/Util/Controller'
import ResponserDomain from './Domain/Entities/Util/Responser'

// Repeat
import UserModel from './Domain/Entities/User/Model'
import BankModel from './Domain/Entities/Bank/Model'
import CompanyModel from './Domain/Entities/Company/Model'
import SessionModel from './Domain/Entities/Session/Model'
import SaleModel from './Domain/Entities/Sale/Model'
import ProviderModel from './Domain/Entities/Provider/Model'
import PaymentModel from './Domain/Entities/Payment/Model'
import PaymentMethodModel from './Domain/Entities/PaymentMethod/Model'

import UserServiceDomain from './Domain/Entities/User/Controller'
import BankServiceDomain from './Domain/Entities/Bank/Controller'
import CompanyServiceDomain from './Domain/Entities/Company/Controller'
import SessionServiceDomain from './Domain/Entities/Session/Controller'
import SaleServiceDomain from './Domain/Entities/Sale/Controller'
import ProviderServiceDomain from './Domain/Entities/Provider/Controller'
import PaymentServiceDomain from './Domain/Entities/Payment/Controller'
import PaymentMethodServiceDomain from './Domain/Entities/PaymentMethod/Controller'

import LoginDto from './Presentation/Controllers/Authentication/Dto'
import UserDto from './Domain/Entities/User/Dto'
import BankDto from './Domain/Entities/Bank/Dto'
import CompanyDto from './Domain/Entities/Company/Dto'
import SessionDto from './Domain/Entities/Session/Dto'
import SaleDto from './Domain/Entities/Sale/Dto'
import ProviderDto from './Domain/Entities/Provider/Dto'
import PaymentDto from './Domain/Entities/Payment/Dto'
import PaymentMethodDto from './Domain/Entities/PaymentMethod/Dto'

import SessionBuilder from './Domain/Entities/Session/Builder'

import AuthenticationServicePresentation from './Presentation/Controllers/Authentication/Controller'
import BankServicePresentation from './Presentation/Controllers/Bank/Controller'
import UserServicePresentation from './Presentation/Controllers/User/Controller'
import CompanyServicePresentation from './Presentation/Controllers/Company/Controller'
import SessionServicePresentation from './Presentation/Controllers/Session/Controller'
import SaleServicePresentation from './Presentation/Controllers/Sale/Controller'
import ProviderServicePresentation from './Presentation/Controllers/Provider/Controller'
import PaymentServicePresentation from './Presentation/Controllers/Payment/Controller'
import PaymentMethodServicePresentation from './Presentation/Controllers/PaymentMethod/Controller'

import EmployeeServiceableDomain from './Domain/Entities/Employee/Ports/Serviceable'
import EmployeeInterface from './Domain/Entities/Employee/Interface'
import EmployeeModel from './Domain/Entities/Employee/Model'
import EmployeeServiceDomain from './Domain/Entities/Employee/Controller'
import EmployeeDto from './Domain/Entities/Employee/Dto'
import EmployeeServicePresentation from './Presentation/Controllers/Employee/Controller'

import ScheduleServiceableDomain from './Domain/Entities/Schedule/Ports/Serviceable'
import ScheduleInterface from './Domain/Entities/Schedule/Interface'
import ScheduleModel from './Domain/Entities/Schedule/Model'
import ScheduleServiceDomain from './Domain/Entities/Schedule/Controller'
import ScheduleDto from './Domain/Entities/Schedule/Dto'
import ScheduleServicePresentation from './Presentation/Controllers/Schedule/Controller'

import ItemServiceableDomain from './Domain/Entities/Item/Ports/Serviceable'
import ItemInterface from './Domain/Entities/Item/Interface'
import ItemModel from './Domain/Entities/Item/Model'
import ItemServiceDomain from './Domain/Entities/Item/Controller'
import ItemDto from './Domain/Entities/Item/Dto'
import ItemServicePresentation from './Presentation/Controllers/Item/Controller'

import TagServiceableDomain from './Domain/Entities/Tag/Ports/Serviceable'
import TagInterface from './Domain/Entities/Tag/Interface'
import TagModel from './Domain/Entities/Tag/Model'
import TagServiceDomain from './Domain/Entities/Tag/Controller'
import TagDto from './Domain/Entities/Tag/Dto'
import TagServicePresentation from './Presentation/Controllers/Tag/Controller'


var container = new Container()
container.bind<Appeable>(TYPES.Appeable).to(App)
container.bind<Responseable>(TYPES.Responseable).to(Responser)
container.bind<Authenticateable>(TYPES.Authenticateable).to(Authentication)
container.bind<ConnectionableProvider>(TYPES.ConnectionableProvider).to(ConnectionProvider)
container.bind<GeteableModel>(TYPES.GeteableModel).to(ConnectionProvider)
container.bind<Validateable>(TYPES.Validateable).to(Validation)
container.bind<Router>(TYPES.Router).toConstantValue(Router())
container.bind<ResponseableDomain>(TYPES.ResponseableDomain).to(ResponserDomain)
container.bind<Authenticable>(TYPES.Authenticable).to(AuthenticationAplication)
container.bind<CreateableToken>(TYPES.CreateableToken).to(TokenProvider)

container.bind<Controlleable>(TYPES.Controlleable).to(Controller)
container.bind<Updateable>(TYPES.Updateable).to(Controller)
container.bind<GeteableAll>(TYPES.GeteableAll).to(Controller)
container.bind<GeteableById>(TYPES.GeteableById).to(Controller)
container.bind<Saveable>(TYPES.Saveable).to(Controller)

container.bind<GeteableCompanyStorage>(TYPES.GeteableCompanyStorage).to(Storage)

container.bind<Schemable>(TYPES.Schemable).toConstantValue(new UserModel).whenTargetNamed(TYPES.User)
container.bind<Schemable>(TYPES.Schemable).toConstantValue(new BankModel).whenTargetNamed(TYPES.Bank)
container.bind<Schemable>(TYPES.Schemable).toConstantValue(new CompanyModel).whenTargetNamed(TYPES.Company)
container.bind<Schemable>(TYPES.Schemable).toConstantValue(new SessionModel).whenTargetNamed(TYPES.Session)
container.bind<Schemable>(TYPES.Schemable).toConstantValue(new SaleModel).whenTargetNamed(TYPES.Sale)
container.bind<Schemable>(TYPES.Schemable).toConstantValue(new ProviderModel).whenTargetNamed(TYPES.Provider)
container.bind<Schemable>(TYPES.Schemable).toConstantValue(new PaymentModel).whenTargetNamed(TYPES.Payment)
container.bind<Schemable>(TYPES.Schemable).toConstantValue(new PaymentMethodModel).whenTargetNamed(TYPES.PaymentMethod)

container.bind<Validable>(TYPES.Validable).to(LoginDto).whenTargetNamed(TYPES.Login)
container.bind<Validable>(TYPES.Validable).to(UserDto).whenTargetNamed(TYPES.User)
container.bind<Validable>(TYPES.Validable).to(BankDto).whenTargetNamed(TYPES.Bank)
container.bind<Validable>(TYPES.Validable).to(CompanyDto).whenTargetNamed(TYPES.Company)
container.bind<Validable>(TYPES.Validable).to(SessionDto).whenTargetNamed(TYPES.Session)
container.bind<Validable>(TYPES.Validable).to(SaleDto).whenTargetNamed(TYPES.Sale)
container.bind<Validable>(TYPES.Validable).to(ProviderDto).whenTargetNamed(TYPES.Provider)
container.bind<Validable>(TYPES.Validable).to(PaymentDto).whenTargetNamed(TYPES.Payment)
container.bind<Validable>(TYPES.Validable).to(PaymentMethodDto).whenTargetNamed(TYPES.PaymentMethod)

container.bind<UserInterface>(TYPES.UserInterface).toConstantValue(new UserDto)
container.bind<BankInterface>(TYPES.BankInterface).toConstantValue(new BankDto)
container.bind<CompanyInterface>(TYPES.CompanyInterface).toConstantValue(new CompanyDto)
container.bind<SessionInterface>(TYPES.SessionInterface).toConstantValue(new SessionDto)
container.bind<SaleInterface>(TYPES.SaleInterface).toConstantValue(new SaleDto)
container.bind<ProviderInterface>(TYPES.ProviderInterface).toConstantValue(new ProviderDto)
container.bind<PaymentInterface>(TYPES.PaymentInterface).toConstantValue(new PaymentDto)
container.bind<PaymentMethodInterface>(TYPES.PaymentMethodInterface).toConstantValue(new PaymentMethodDto)

container .bind<SessionBuilderable>(TYPES.SessionBuilderable).to(SessionBuilder)

container.bind<UserServiceableDomain>(TYPES.UserServiceableDomain).to(UserServiceDomain)
container.bind<BankServiceableDomain>(TYPES.BankServiceableDomain).to(BankServiceDomain)
container.bind<CompanyServiceableDomain>(TYPES.CompanyServiceableDomain).to(CompanyServiceDomain)
container.bind<SessionServiceableDomain>(TYPES.SessionServiceableDomain).to(SessionServiceDomain)
container.bind<SaleServiceableDomain>(TYPES.SaleServiceableDomain).to(SaleServiceDomain)
container.bind<ProviderServiceableDomain>(TYPES.ProviderServiceableDomain).to(ProviderServiceDomain)
container.bind<PaymentServiceableDomain>(TYPES.PaymentServiceableDomain).to(PaymentServiceDomain)
container.bind<PaymentMethodServiceableDomain>(TYPES.PaymentMethodServiceableDomain).to(PaymentMethodServiceDomain)

container.bind<Routeable>(TYPES.Routeable).to(AuthenticationServicePresentation)
container.bind<Routeable>(TYPES.Routeable).to(UserServicePresentation)
container.bind<Routeable>(TYPES.Routeable).to(BankServicePresentation)
container.bind<Routeable>(TYPES.Routeable).to(CompanyServicePresentation)
container.bind<Routeable>(TYPES.Routeable).to(SessionServicePresentation)
container.bind<Routeable>(TYPES.Routeable).to(SaleServicePresentation)
container.bind<Routeable>(TYPES.Routeable).to(ProviderServicePresentation)
container.bind<Routeable>(TYPES.Routeable).to(PaymentServicePresentation)
container.bind<Routeable>(TYPES.Routeable).to(PaymentMethodServicePresentation)

container.bind<Schemable>(TYPES.Schemable).toConstantValue(new EmployeeModel).whenTargetNamed(TYPES.Employee)
container.bind<Validable>(TYPES.Validable).to(EmployeeDto).whenTargetNamed(TYPES.Employee)
container.bind<EmployeeInterface>(TYPES.EmployeeInterface).toConstantValue(new EmployeeDto)
container.bind<EmployeeServiceableDomain>(TYPES.EmployeeServiceableDomain).to(EmployeeServiceDomain)
container.bind<Routeable>(TYPES.Routeable).to(EmployeeServicePresentation)

container.bind<Schemable>(TYPES.Schemable).toConstantValue(new ScheduleModel).whenTargetNamed(TYPES.Schedule)
container.bind<Validable>(TYPES.Validable).to(ScheduleDto).whenTargetNamed(TYPES.Schedule)
container.bind<ScheduleInterface>(TYPES.ScheduleInterface).toConstantValue(new ScheduleDto)
container.bind<ScheduleServiceableDomain>(TYPES.ScheduleServiceableDomain).to(ScheduleServiceDomain)
container.bind<Routeable>(TYPES.Routeable).to(ScheduleServicePresentation)

container.bind<Schemable>(TYPES.Schemable).toConstantValue(new ItemModel).whenTargetNamed(TYPES.Item)
container.bind<Validable>(TYPES.Validable).to(ItemDto).whenTargetNamed(TYPES.Item)
container.bind<ItemInterface>(TYPES.ItemInterface).toConstantValue(new ItemDto)
container.bind<ItemServiceableDomain>(TYPES.ItemServiceableDomain).to(ItemServiceDomain)
container.bind<Routeable>(TYPES.Routeable).to(ItemServicePresentation)

container.bind<Schemable>(TYPES.Schemable).toConstantValue(new TagModel).whenTargetNamed(TYPES.Tag)
container.bind<Validable>(TYPES.Validable).to(TagDto).whenTargetNamed(TYPES.Tag)
container.bind<TagInterface>(TYPES.TagInterface).toConstantValue(new TagDto)
container.bind<TagServiceableDomain>(TYPES.TagServiceableDomain).to(TagServiceDomain)
container.bind<Routeable>(TYPES.Routeable).to(TagServicePresentation)


export default container
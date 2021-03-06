const TYPES = {
  Routeable: Symbol.for('Routeable'),
  Responseable: Symbol.for('Responseable'),
  Appeable: Symbol.for('Appeable'),
  Schemable: Symbol.for('Schemable'),
  ConnectionableProvider: Symbol.for('ConnectionableProvider'),
  GeteableModel: Symbol.for('GeteableModel'),
  Authenticateable: Symbol.for('Authenticateable'),
  Validateable: Symbol.for('Validateable'),
  Router: Symbol.for('Router'),
  Validable: Symbol.for('Validable'),
  ResponseableDomain: Symbol.for('ResponseableDomain'),
  Authenticable: Symbol.for('Authenticable'),
  CreateableToken: Symbol.for('CreateableToken'),
  Modelable: Symbol.for('Modelable'),

  Controlleable: Symbol.for('Controlleable'),
  Updateable: Symbol.for('Updateable'),
  GeteableById: Symbol.for('GeteableById'),
  Saveable: Symbol.for('Saveable'),
  GeteableAll: Symbol.for('GeteableAll'),
  
  GeteableCompanyStorage: Symbol.for('GeteableCompanyStorage'),
  
  Login: Symbol.for('Login'),
  User: Symbol.for('User'),
  Bank: Symbol.for('Bank'),
  Company: Symbol.for('Company'),
  Session: Symbol.for('Session'),
  Sale: Symbol.for('Sale'),
  Provider: Symbol.for('Provider'),
  Payment: Symbol.for('Payment'),
  PaymentMethod: Symbol.for('PaymentMethod'),
  
  LoginBuilderable: Symbol.for('LoginBuilderable'),
  UserBuilderable: Symbol.for('UserBuilderable'),
  BankBuilderable: Symbol.for('BankBuilderable'),
  CompanyBuilderable: Symbol.for('CompanyBuilderable'),
  SessionBuilderable: Symbol.for('SessionBuilderable'),
  SaleBuilderable: Symbol.for('SaleBuilderable'),
  ProviderBuilderable: Symbol.for('ProviderBuilderable'),
  PaymentBuilderable: Symbol.for('PaymentBuilderable'),
  PaymentMethodBuilderable: Symbol.for('PaymentMethodBuilderable'),

  LoginInterface: Symbol.for('LoginInterface'),
  UserInterface: Symbol.for('UserInterface'),
  BankInterface: Symbol.for('BankInterface'),
  CompanyInterface: Symbol.for('CompanyInterface'),
  SessionInterface: Symbol.for('SessionInterface'),
  SaleInterface: Symbol.for('SaleInterface'),
  ProviderInterface: Symbol.for('ProviderInterface'),
  PaymentInterface: Symbol.for('PaymentInterface'),
  PaymentMethodInterface: Symbol.for('PaymentMethodInterface'),

  LoginServiceableDomain: Symbol.for('LoginServiceableDomain'),
  UserServiceableDomain: Symbol.for('UserServiceableDomain'),
  BankServiceableDomain: Symbol.for('BankServiceableDomain'),
  CompanyServiceableDomain: Symbol.for('CompanyServiceableDomain'),
  SessionServiceableDomain: Symbol.for('SessionServiceableDomain'),
  SaleServiceableDomain: Symbol.for('SaleServiceableDomain'),
  ProviderServiceableDomain: Symbol.for('ProviderServiceableDomain'),
  PaymentServiceableDomain: Symbol.for('PaymentServiceableDomain'),
  PaymentMethodServiceableDomain: Symbol.for('PaymentMethodServiceableDomain'),

  Employee: Symbol.for('Employee'),
  EmployeeBuilderable: Symbol.for('EmployeeBuilderable'),
  EmployeeInterface: Symbol.for('EmployeeInterface'),
  EmployeeServiceableDomain: Symbol.for('EmployeeServiceableDomain'),

  Schedule: Symbol.for('Schedule'),
  ScheduleBuilderable: Symbol.for('ScheduleBuilderable'),
  ScheduleInterface: Symbol.for('ScheduleInterface'),
  ScheduleServiceableDomain: Symbol.for('ScheduleServiceableDomain'),

  Item: Symbol.for('Item'),
  ItemBuilderable: Symbol.for('ItemBuilderable'),
  ItemInterface: Symbol.for('ItemInterface'),
  ItemServiceableDomain: Symbol.for('ItemServiceableDomain'),

  Tag: Symbol.for('Tag'),
  TagBuilderable: Symbol.for('TagBuilderable'),
  TagInterface: Symbol.for('TagInterface'),
  TagServiceableDomain: Symbol.for('TagServiceableDomain'),
  
};

export default TYPES;
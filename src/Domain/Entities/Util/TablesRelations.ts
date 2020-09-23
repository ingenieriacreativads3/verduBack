export default class TablesRelations {

	public relations: [{ relation: string }] = [{ relation: '' }]

	public getRelations(property: string): {
		table: string,
		localField: string
	} {

		var propertyJson: {
			table: string,
			localField: string
		}

		const tables: {
			agreement: string,
			agreementType: string,
			agreementStatus: string,
			announcement: string,
			bank: string,
			branch: string,
			cancelationType: string,
			cashBox: string,
			company: string,
			habitationalType: string,
			movementOfCash: string,
			origin: string,
			paymentMethod: string,
			person: string,
			personType: string,
			property: string,
			roomType: string,
			service: string,
			serviceType: string,
			tax: string,
			transaction: string,
			transactionType: string,
			vatCondition: string,
			user: string
		} = {
			agreement: 'agreements',
			agreementType: 'agreementtypes',
			agreementStatus: 'agreementstatuses',
			announcement: 'announcements',
			bank: 'banks',
			branch: 'branches',
			cancelationType: 'cancelationtypes',
			cashBox: 'cashboxes',
			company: 'companies',
			habitationalType: 'habitationaltypes',
			movementOfCash: 'movementOfCashs',
			origin: 'origins',
			paymentMethod: 'paymentmethods',
			person: 'people',
			personType: 'persontypes',
			property: 'properties',
			roomType: 'roomtypes',
			service: 'services',
			serviceType: 'servicetypes',
			tax: 'taxes',
			transaction: 'transactions',
			transactionType: 'transactiontypes',
			vatCondition: 'vatconditions',
			user: 'users'
		}

		if (property.includes('creationUser.')) propertyJson = { table: tables.user, localField: 'creationUser' }
		if (property.includes('toCancel.')) propertyJson = { table: tables.transactionType, localField: 'toCancel' }
		if (property.includes('thisCancel.')) propertyJson = { table: tables.transactionType, localField: 'thisCancel' }
		if (property.includes('updateUser.')) propertyJson = { table: tables.user, localField: 'updateUser' }
		if (property.includes('origin.')) propertyJson = { table: tables.origin, localField: 'origin' }
		if (property.includes('person.')) propertyJson = { table: tables.person, localField: 'person' }
		if (property.includes('user.')) propertyJson = { table: tables.user, localField: 'user' }
		if (property.includes('debit.')) propertyJson = { table: tables.transaction, localField: 'debit' }
		if (property.includes('credit.')) propertyJson = { table: tables.transaction, localField: 'credit' }
		if (property.includes('own.')) propertyJson = { table: tables.person, localField: 'own' }
		if (property.includes('habitationalType.')) propertyJson = { table: tables.habitationalType, localField: 'habitationalType' }
		if (property.includes('lessee.')) propertyJson = { table: tables.person, localField: 'lessee' }
		if (property.includes('property.')) propertyJson = { table: tables.property, localField: 'property' }
		if (property.includes('agreement.')) propertyJson = { table: tables.agreement, localField: 'agreement' }
		if (property.includes('announcer.')) propertyJson = { table: tables.person, localField: 'announcer' }
		if (property.includes('transactionType.')) propertyJson = { table: tables.transactionType, localField: 'transactionType' }
		if (property.includes('announcement.')) propertyJson = { table: tables.announcement, localField: 'announcement' }
		if (property.includes('transaction.')) propertyJson = { table: tables.transaction, localField: 'transaction' }
		if (property.includes('liquidation.')) propertyJson = { table: tables.transaction, localField: 'liquidation' }
		if (property.includes('tax.')) propertyJson = { table: tables.tax, localField: 'tax' }
		if (property.includes('vatCondition.')) propertyJson = { table: tables.vatCondition, localField: 'vatCondition' }
		if (property.includes('cashBox.')) propertyJson = { table: tables.cashBox, localField: 'cashBox' }
		if (property.includes('company.')) propertyJson = { table: tables.company, localField: 'company' }
		if (property.includes('contractType.')) propertyJson = { table: tables.agreementType, localField: 'contractType' }
		if (property.includes('bank.')) propertyJson = { table: tables.bank, localField: 'bank' }
		if (property.includes('personType.')) propertyJson = { table: tables.personType, localField: 'personType' }
		if (property.includes('branch.')) propertyJson = { table: tables.branch, localField: 'branch' }
		if (property.includes('guaranteeProperty')) propertyJson = { table: tables.property, localField: 'guaranteeProperty' }
		if (property.includes('guaranteePerson')) propertyJson = { table: tables.person, localField: 'guaranteePerson' }
		if (property.includes('agreementStatus')) propertyJson = { table: tables.agreementStatus, localField: 'agreementStatus' }
		if (property.includes('paymentMethod.')) propertyJson = { table: tables.paymentMethod, localField: 'paymentMethod' }
		if (property.includes('rooms')) propertyJson = { table: tables.roomType, localField: 'rooms' }

		if (property.includes('property')) propertyJson = { table: tables.property, localField: 'property.property' }
		if (property.includes('service')) propertyJson = { table: tables.service, localField: 'services.service' }
		if (property.includes('pricing')) propertyJson = { table: tables.agreementType, localField: 'pricing.agreementType' }

		if (property.includes('service.')) propertyJson = { table: tables.service, localField: 'service' }
		if (property.includes('serviceType.')) propertyJson = { table: tables.serviceType, localField: 'serviceType' }
		if (property.includes('property.')) propertyJson = { table: tables.property, localField: 'property' }

		return propertyJson
	}

	public exist(property: string): boolean {
		var exist: boolean = false
		if (property.includes('creationUser.')) { if (!this.isRelationsUpdate('creationUser.')) { exist = true; this.relations.push({ relation: 'creationUser.' }) } }
		if (property.includes('thisCancel.')) { if (!this.isRelationsUpdate('thisCancel.')) { exist = true; this.relations.push({ relation: 'thisCancel.' }) } }
		if (property.includes('toCancel.')) { if (!this.isRelationsUpdate('toCancel.')) { exist = true; this.relations.push({ relation: 'toCancel.' }) } }
		if (property.includes('updateUser.')) { if (!this.isRelationsUpdate('updateUser.')) { exist = true; this.relations.push({ relation: 'updateUser.' }) } }
		if (property.includes('origin.')) { if (!this.isRelationsUpdate('origin.')) { exist = true; this.relations.push({ relation: 'origin.' }) } }
		if (property.includes('person.')) { if (!this.isRelationsUpdate('person.')) { exist = true; this.relations.push({ relation: 'person.' }) } }
		if (property.includes('user.')) { if (!this.isRelationsUpdate('user.')) { exist = true; this.relations.push({ relation: 'user.' }) } }
		if (property.includes('own.')) { if (!this.isRelationsUpdate('own.')) { exist = true; this.relations.push({ relation: 'own.' }) } }
		if (property.includes('debit.')) { if (!this.isRelationsUpdate('debit.')) { exist = true; this.relations.push({ relation: 'debit.' }) } }
		if (property.includes('credit.')) { if (!this.isRelationsUpdate('credit.')) { exist = true; this.relations.push({ relation: 'credit.' }) } }
		if (property.includes('habitationalType.')) { if (!this.isRelationsUpdate('habitationalType.')) { exist = true; this.relations.push({ relation: 'habitationalType.' }) } }
		if (property.includes('lessee.')) { if (!this.isRelationsUpdate('lessee.')) { exist = true; this.relations.push({ relation: 'lessee.' }) } }
		if (property.includes('property.')) { if (!this.isRelationsUpdate('property.')) { exist = true; this.relations.push({ relation: 'property.' }) } }
		if (property.includes('agreement.')) { if (!this.isRelationsUpdate('agreement.')) { exist = true; this.relations.push({ relation: 'agreement.' }) } }
		if (property.includes('announcer.')) { if (!this.isRelationsUpdate('announcer.')) { exist = true; this.relations.push({ relation: 'announcer.' }) } }
		if (property.includes('transactionType.')) { if (!this.isRelationsUpdate('transactionType.')) { exist = true; this.relations.push({ relation: 'transactionType.' }) } }
		if (property.includes('serviceType.')) { if (!this.isRelationsUpdate('serviceType.')) { exist = true; this.relations.push({ relation: 'serviceType.' }) } }
		if (property.includes('announcement.')) { if (!this.isRelationsUpdate('announcement.')) { exist = true; this.relations.push({ relation: 'announcement.' }) } }
		if (property.includes('transaction.')) { if (!this.isRelationsUpdate('transaction.')) { exist = true; this.relations.push({ relation: 'transaction.' }) } }
		if (property.includes('liquidation.')) { if (!this.isRelationsUpdate('liquidation.')) { exist = true; this.relations.push({ relation: 'liquidation.' }) } }
		if (property.includes('tax.')) { if (!this.isRelationsUpdate('tax.')) { exist = true; this.relations.push({ relation: 'tax.' }) } }
		if (property.includes('vatCondition.')) { if (!this.isRelationsUpdate('vatCondition.')) { exist = true; this.relations.push({ relation: 'vatCondition.' }) } }
		if (property.includes('cashBox.')) { if (!this.isRelationsUpdate('cashBox.')) { exist = true; this.relations.push({ relation: 'cashBox.' }) } }
		if (property.includes('company.')) { if (!this.isRelationsUpdate('company.')) { exist = true; this.relations.push({ relation: 'company.' }) } }
		if (property.includes('contractType.')) { if (!this.isRelationsUpdate('contractType.')) { exist = true; this.relations.push({ relation: 'contractType.' }) } }
		if (property.includes('bank.')) { if (!this.isRelationsUpdate('bank.')) { exist = true; this.relations.push({ relation: 'bank.' }) } }
		if (property.includes('personType.')) { if (!this.isRelationsUpdate('personType.')) { exist = true; this.relations.push({ relation: 'personType.' }) } }
		if (property.includes('branch.')) { if (!this.isRelationsUpdate('branch.')) { exist = true; this.relations.push({ relation: 'branch.' }) } }
		if (property.includes('service.')) { if (!this.isRelationsUpdate('service.')) { exist = true; this.relations.push({ relation: 'service.' }) } }
		if (property.includes('guaranteeProperty')) { if (!this.isRelationsUpdate('guaranteeProperty')) { exist = true; this.relations.push({ relation: 'guaranteeProperty' }) } }
		if (property.includes('guaranteePerson')) { if (!this.isRelationsUpdate('guaranteePerson')) { exist = true; this.relations.push({ relation: 'guaranteePerson' }) } }
		if (property.includes('agreementStatus')) { if (!this.isRelationsUpdate('agreementStatus')) { exist = true; this.relations.push({ relation: 'agreementStatus' }) } }
		if (property.includes('paymentMethod.')) { if (!this.isRelationsUpdate('paymentMethod.')) { exist = true; this.relations.push({ relation: 'paymentMethod.' }) } }
		if (property.includes('rooms.')) { if (!this.isRelationsUpdate('rooms.')) { exist = true; this.relations.push({ relation: 'rooms.' }) } }
		return exist
	}

	private isRelationsUpdate(relation: string): boolean {
		var exist: boolean = false

		this.relations.forEach((item) => {
			if (item.relation.includes(relation)) exist = true
		})

		return exist
	}

}

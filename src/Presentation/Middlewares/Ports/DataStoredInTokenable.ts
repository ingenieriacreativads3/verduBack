import Agreement from '../../../Domain/Entities/Agreement/Interface'

export default interface DataStoredInTokenable {
	_id: string;
	database: string;
}
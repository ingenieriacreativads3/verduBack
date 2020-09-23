import GeteableBoardId from './GeteableBoardId'
import GeteableListId from './GeteableListId';
import SendeableCard from './SendeableCard'
import SaveableCard from './SaveableCard';
import SaveableLabel from './SaveableLabel';
import GeteableLabelId from './GeteableLabelId';

export default interface TrelloService extends
	GeteableBoardId,
	GeteableListId,
	SendeableCard,
	SaveableCard,
	SaveableLabel,
	GeteableLabelId {}
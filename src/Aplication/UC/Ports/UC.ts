import DebitableTransaction from "./DebitableTransaction";
import MakeableEffectiveAgreement from "./MakeableEffectiveAgreement";
import SendeableCardToTrello from "./SendeableCardToTrello";

export default interface Uc extends
	DebitableTransaction,
	MakeableEffectiveAgreement,
	SendeableCardToTrello {}
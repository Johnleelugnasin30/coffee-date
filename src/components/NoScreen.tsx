import { invitation } from "../config/invitation";
import { InvitationCard } from "./InvitationCard";

type NoScreenProps = {
  onBack: () => void;
};

export function NoScreen({ onBack }: NoScreenProps) {
  const { customMessages } = invitation;
  return (
    <InvitationCard>
      <h1 tabIndex={-1}>{customMessages.noTitle}</h1>
      <p className="lede">{customMessages.noBody}</p>
      <p className="lede">{customMessages.noOffer}</p>
      <p className="confirm">{customMessages.noThanks}</p>
      <button type="button" className="btn btn-ghost" onClick={onBack}>
        {customMessages.back}
      </button>
    </InvitationCard>
  );
}

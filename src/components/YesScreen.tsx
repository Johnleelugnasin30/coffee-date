import { invitation } from "../config/invitation";
import { CoffeeAnimation } from "./CoffeeAnimation";
import { Confetti } from "./Confetti";
import { HeartAnimation } from "./HeartAnimation";
import { InvitationCard } from "./InvitationCard";

type YesScreenProps = {
  onContinue: () => void;
};

export function YesScreen({ onContinue }: YesScreenProps) {
  const { customMessages } = invitation;
  return (
    <>
      <HeartAnimation count={14} celebrate />
      <CoffeeAnimation mode="drift" />
      <Confetti />
      <InvitationCard>
        <CoffeeAnimation mode="hero" />
        <p className="burst line-in">{customMessages.yesBurst}</p>
        <h1 tabIndex={-1} className="line-in delay-1">
          {customMessages.yesTitle}
        </h1>
        <p className="lede line-in delay-2">{customMessages.yesSmile}</p>
        <p className="confirm line-in delay-3">{customMessages.yesConfirm}</p>
        <button type="button" className="btn btn-yes" onClick={onContinue}>
          {customMessages.yesContinue}
        </button>
      </InvitationCard>
    </>
  );
}

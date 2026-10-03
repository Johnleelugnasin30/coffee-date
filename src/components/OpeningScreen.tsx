import { useState } from "react";
import seal from "../assets/seal.svg";
import { invitation } from "../config/invitation";
import type { SoundKind } from "../lib/sounds";
import { useReducedMotion } from "../lib/motion";
import { InvitationCard } from "./InvitationCard";

type OpeningScreenProps = {
  onOpen: () => void;
  onPlay: (kind: SoundKind) => void;
};

export function OpeningScreen({ onOpen, onPlay }: OpeningScreenProps) {
  const reduced = useReducedMotion();
  const [opening, setOpening] = useState(false);
  const { customMessages } = invitation;

  function open() {
    if (opening) return;
    setOpening(true);
    onPlay("envelope");
    window.setTimeout(onOpen, reduced ? 0 : 780);
  }

  return (
    <InvitationCard className={opening ? "is-opening" : ""}>
      <div className={opening ? "envelope is-open" : "envelope"} aria-hidden="true">
        <div className="pocket" />
        <div className="letter" />
        <div className="flap">
          <img className="seal" src={seal} alt="" />
        </div>
      </div>
      <h1 tabIndex={-1}>{customMessages.opening}</h1>
      <button type="button" className="btn btn-yes" onClick={open} disabled={opening}>
        {customMessages.openButton}
      </button>
    </InvitationCard>
  );
}

type GreetingScreenProps = {
  onContinue: () => void;
};

export function GreetingScreen({ onContinue }: GreetingScreenProps) {
  const { recipientName, senderName, customMessages } = invitation;
  return (
    <InvitationCard>
      <p className="eyebrow">a little note</p>
      <h1 tabIndex={-1}>
        {customMessages.greetingLead}, {recipientName}...
      </h1>
      <p className="lede line-in delay-1">{customMessages.greetingAsk}</p>
      <p className="lede line-in delay-2">{customMessages.greetingLittle}</p>
      <p className="signoff">— {senderName}</p>
      <button type="button" className="btn btn-yes" onClick={onContinue}>
        {customMessages.continueButton}
      </button>
    </InvitationCard>
  );
}

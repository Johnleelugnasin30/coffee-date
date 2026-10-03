import { useRef, useState } from "react";
import { invitation } from "../config/invitation";
import { CoffeeAnimation } from "./CoffeeAnimation";
import { InvitationCard } from "./InvitationCard";

function formatWhen(value: string) {
  if (!value) return "a time we'll choose";
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function DateDetails() {
  const { recipientName, senderName, date, location, coffeeShop, customMessages, emoji } =
    invitation;
  const [withName, setWithName] = useState(recipientName);
  const [when, setWhen] = useState(date);
  const [where, setWhere] = useState(location);
  const [shop, setShop] = useState(coffeeShop);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");
  const dateRef = useRef<HTMLInputElement>(null);
  const shopRef = useRef<HTMLInputElement>(null);
  const suggestion = useRef(0);

  function pickDate() {
    const field = dateRef.current;
    if (!field) return;
    field.focus();
    try {
      field.showPicker();
    } catch {
      /* Safari throws when the picker is unavailable. Focusing is enough. */
    }
  }

  function pickShop() {
    shopRef.current?.focus();
    if (shop.trim()) return;
    const ideas = invitation.coffeeShopSuggestions;
    const next = ideas[suggestion.current % ideas.length] ?? "";
    suggestion.current += 1;
    setShop(next);
  }

  async function shareDetails() {
    const message = [
      `${emoji.coffee} ${customMessages.dateHeading}`,
      `With: ${withName.trim() || recipientName}`,
      `When: ${formatWhen(when)}`,
      `Where: ${where.trim() || "somewhere we'll choose"}`,
      `Coffee shop: ${shop.trim() || "still deciding"}`,
      "",
      `From ${senderName}`,
      "",
      customMessages.privacy,
    ].join("\n");

    setNote(message);
    try {
      await navigator.clipboard.writeText(message);
      setStatus(customMessages.nothingSent);
    } catch {
      setStatus("Nothing was sent. The note is below if you want to copy it yourself.");
    }
  }

  return (
    <InvitationCard>
      <CoffeeAnimation mode="hero" />
      <p className="eyebrow">
        {emoji.coffee} {emoji.heart}
      </p>
      <h1 className="date-title" tabIndex={-1}>
        {customMessages.dateHeading}
      </h1>
      <p className="confirm">{customMessages.decide}</p>
      <div className="fields">
        <label className="field">
          <span>With</span>
          <input
            value={withName}
            onChange={(event) => setWithName(event.target.value)}
            autoComplete="name"
          />
        </label>
        <label className="field">
          <span>When</span>
          <input
            ref={dateRef}
            type="date"
            value={when}
            onChange={(event) => setWhen(event.target.value)}
          />
        </label>
        <label className="field">
          <span>Where</span>
          <input
            value={where}
            onChange={(event) => setWhere(event.target.value)}
            placeholder="Choose a place"
            autoComplete="off"
          />
        </label>
        <label className="field">
          <span>Coffee shop</span>
          <input
            ref={shopRef}
            value={shop}
            onChange={(event) => setShop(event.target.value)}
            placeholder="Choose a coffee shop"
            autoComplete="off"
          />
        </label>
      </div>
      <div className="chips" aria-label="Coffee shop ideas">
        {invitation.coffeeShopSuggestions.map((idea) => (
          <button key={idea} type="button" className="chip" onClick={() => setShop(idea)}>
            {idea}
          </button>
        ))}
      </div>
      <div className="detail-actions">
        <button type="button" className="btn btn-ghost" onClick={pickDate}>
          Pick the date
        </button>
        <button type="button" className="btn btn-ghost" onClick={pickShop}>
          Pick the coffee shop
        </button>
        <button type="button" className="btn btn-yes" onClick={() => void shareDetails()}>
          Send me the details
        </button>
      </div>
      <p className="settle-note" role="status">
        {status}
      </p>
      {note ? (
        <textarea className="note" readOnly value={note} aria-label="Coffee date note" />
      ) : null}
      <p className="hint">{customMessages.privacy}</p>
      <p className="signoff">— {senderName}</p>
    </InvitationCard>
  );
}

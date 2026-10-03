import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { invitation } from "./config/invitation";
import { CoffeeAnimation } from "./components/CoffeeAnimation";
import { DateDetails } from "./components/DateDetails";
import { HeartAnimation } from "./components/HeartAnimation";
import { GreetingScreen, OpeningScreen } from "./components/OpeningScreen";
import { NoScreen } from "./components/NoScreen";
import { QuestionScreen } from "./components/QuestionScreen";
import { SoundToggle } from "./components/SoundToggle";
import { YesScreen } from "./components/YesScreen";
import { playSound, startAmbience, stopAmbience, unlockAudio, type SoundKind } from "./lib/sounds";

type Screen = "opening" | "greeting" | "question" | "yes" | "details" | "no";

const announcements: Record<Screen, string> = {
  opening: "Someone has a question for you.",
  greeting: `Hey, ${invitation.recipientName}. I wanted to ask you something.`,
  question: invitation.question,
  yes: "You said yes.",
  details: "Coffee date details. You can edit them. Nothing is sent automatically.",
  no: "Okay. No hard feelings.",
};

export function App() {
  const [screen, setScreen] = useState<Screen>("opening");
  const [soundOn, setSoundOn] = useState(false);
  const [questionVisit, setQuestionVisit] = useState(0);
  const { colors, background } = invitation;

  const theme = {
    "--ink": colors.ink,
    "--rose": colors.rose,
    "--cream": colors.cream,
    "--espresso": colors.espresso,
    "--gold": colors.gold,
    "--blush": colors.blush,
    "--bg-from": background.from,
    "--bg-via": background.via,
    "--bg-to": background.to,
  } as CSSProperties;

  useEffect(() => () => stopAmbience(), []);

  useEffect(() => {
    const heading = document.querySelector<HTMLElement>(".screen h1");
    heading?.focus();
  }, [screen]);

  const play = useCallback(
    (kind: SoundKind) => {
      if (!soundOn) return;
      playSound(kind);
    },
    [soundOn],
  );

  function toggleSound() {
    const next = !soundOn;
    if (next) {
      unlockAudio();
      startAmbience();
      playSound("click");
    } else {
      stopAmbience();
    }
    setSoundOn(next);
  }

  const showAmbient = screen === "opening" || screen === "greeting" || screen === "question";

  return (
    <div className="app" style={theme}>
      <a className="skip" href="#invitation">
        Skip to invitation
      </a>
      <SoundToggle on={soundOn} onToggle={toggleSound} />
      {showAmbient ? <HeartAnimation /> : null}
      {screen === "question" ? <CoffeeAnimation mode="drift" /> : null}
      <main className="stage" id="invitation">
        <p className="sr-only" aria-live="polite">
          {announcements[screen]}
        </p>
        <div key={screen} className="screen">
          {screen === "opening" ? (
            <OpeningScreen onOpen={() => setScreen("greeting")} onPlay={play} />
          ) : null}
          {screen === "greeting" ? (
            <GreetingScreen
              onContinue={() => {
                play("click");
                setScreen("question");
              }}
            />
          ) : null}
          {screen === "question" ? (
            <QuestionScreen
              resetKey={questionVisit}
              onYes={() => {
                play("success");
                setScreen("yes");
              }}
              onNo={() => {
                play("click");
                setScreen("no");
              }}
            />
          ) : null}
          {screen === "yes" ? (
            <YesScreen
              onContinue={() => {
                play("click");
                setScreen("details");
              }}
            />
          ) : null}
          {screen === "details" ? <DateDetails /> : null}
          {screen === "no" ? (
            <NoScreen
              onBack={() => {
                play("click");
                setQuestionVisit((visit) => visit + 1);
                setScreen("question");
              }}
            />
          ) : null}
        </div>
      </main>
    </div>
  );
}

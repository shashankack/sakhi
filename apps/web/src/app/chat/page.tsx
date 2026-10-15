"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUp,
  HeartHandshake,
  MessageCircleHeart,
  Mic,
  Plus,
  ShieldAlert,
  Sparkles,
  Square,
} from "lucide-react";
import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChatRequest,
  ChatResponse,
  getThemeLabel,
  normalizeChatResponse,
  themeCardCopy,
  themeOptions,
  ThemeId,
  type RedFlag,
} from "@/lib/chat";
import {
  getSpeechRecognitionCtor,
  readStoredVoiceLocale,
  speechSupported,
  storeVoiceLocale,
  transcriptMismatchesLocale,
  voiceBcp47,
  VOICE_LANG_OPTIONS,
  type SpeechRecognitionLike,
  type VoiceLocale,
} from "@/lib/speech";

type Turn = {
  id: number;
  prompt: string;
  response: ChatResponse;
};

const demos: {
  label: string;
  hint: string;
  text: string;
}[] = [
  {
    label: "Periods, facial hair & weight",
    hint: "Hinglish",
    text: "periods 2 mahine se nahi aaye, chehre pe baal aa rahe hain, weight badh raha hai",
  },
  {
    label: "Heavy bleeding & feeling faint",
    hint: "Urgent",
    text: "I have heavy bleeding soaking through pads every hour and I feel dizzy and about to faint",
  },
  {
    label: "Acne & mood changes",
    hint: "English",
    text: "I've had more acne lately and my mood has been changing",
  },
  {
    label: "पीरियड्स में बदलाव",
    hint: "हिन्दी",
    text: "मेरे पीरियड्स अनियमित हैं और मुझे थकान रहती है",
  },
  {
    label: "ಅನಿಯಮಿತ ಪೀರಿಯಡ್",
    hint: "ಕನ್ನಡ",
    text: "ನನ್ನ ಪೀರಿಯಡ್ ಅನಿಯಮಿತವಾಗಿದೆ ಮತ್ತು ನನಗೆ ತುಂಬಾ ಆಯಾಸವಾಗುತ್ತಿದೆ",
  },
];

const easeOut = [0.22, 1, 0.36, 1] as const;

function RedFlagPanel({ flags, summary }: { flags: RedFlag[]; summary: string }) {
  return (
    <section className="alert-panel" aria-live="assertive" aria-label="Urgent care guidance">
      <div className="alert-panel-head">
        <ShieldAlert aria-hidden="true" size={18} />
        <h3>Urgent symptoms  get help now</h3>
      </div>
      <p>{summary}</p>
      <p className="alert-panel-note">
        Sakhi cannot assess an emergency. If you may faint, ask someone nearby
        to help you get care.
      </p>
      <ul>
        {flags.map((flag) => (
          <li key={flag.id}>
            <strong>{flag.label}</strong>
            {flag.guidance && flag.guidance !== flag.label ? (
              <>  {flag.guidance}</>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

function ThemeCards({
  themes,
  reduceMotion,
}: {
  themes: ChatResponse["themes"];
  reduceMotion: boolean | null;
}) {
  if (themes.length === 0) return null;
  return (
    <section className="theme-rail" aria-label="Related education">
      <header className="section-label">
        <MessageCircleHeart aria-hidden="true" size={15} />
        Related topics
      </header>
      <div className="theme-grid">
        {themes.map((theme, index) => {
          const copy = themeCardCopy(theme);
          const softLine = [copy.context, copy.overlap].filter(Boolean)[0];
          return (
            <motion.article
              className="theme-card"
              key={theme.id}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: reduceMotion ? 0 : 0.08 + index * 0.06,
                duration: 0.35,
                ease: easeOut,
              }}
            >
              <span className="theme-kicker">{getThemeLabel(theme.id)}</span>
              <h3>{theme.title}</h3>
              <p>{copy.summary}</p>
              {softLine ? (
                <p className="theme-soft">
                  <span>Also useful to know</span>
                  {softLine}
                </p>
              ) : null}
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function CareCard({ care }: { care: ChatResponse["care"] }) {
  return (
    <section className="care-panel" aria-label="Care next steps">
      <header className="care-topline">
        <div className="section-label">
          <HeartHandshake aria-hidden="true" size={15} />
          Care next steps
        </div>
        <Badge className={`urgency-pill ${care.urgency}`} variant="outline">
          {care.urgency}
        </Badge>
      </header>
      <p className="care-summary">{care.summary}</p>
      {care.questions.length > 0 && (
        <>
          <p className="care-ask">Questions you can take to a clinician</p>
          <ul>
            {care.questions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

function SourceChips({ sources }: { sources: ChatResponse["sources"] }) {
  const unique = sources.filter(
    (source, index, list) =>
      list.findIndex(
        (item) => item.title === source.title && item.section === source.section,
      ) === index,
  );
  if (unique.length === 0) return null;
  return (
    <div className="source-list" aria-label="Sources">
      {unique.slice(0, 6).map((source, index) => (
        <span className="source-chip" key={`${source.title}-${source.section}-${index}`}>
          {source.title.replace(/\.md$/i, "").replace(/-/g, " ")}
          {source.section && !/alias/i.test(source.section)
            ? ` · ${source.section}`
            : ""}
        </span>
      ))}
    </div>
  );
}

function AssistantMessage({
  response,
  reduceMotion,
}: {
  response: ChatResponse;
  reduceMotion: boolean | null;
}) {
  const hasRedFlags = response.red_flags.length > 0;
  const stagger = reduceMotion ? 0 : 0.05;
  return (
    <div className="message-row assistant">
      {hasRedFlags && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: easeOut }}
        >
          <RedFlagPanel
            flags={response.red_flags}
            summary={response.care.summary}
          />
        </motion.div>
      )}
      <motion.div
        className="assistant-shell"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: stagger, duration: 0.38, ease: easeOut }}
      >
        <div className="assistant-text">{response.reply}</div>
        <div className="response-meta" aria-label="Response details">
          <span className="meta-pill">
            {response.language === "hi"
              ? "Hindi"
              : response.language === "kn"
                ? "Kannada"
                : "English"}
          </span>
        </div>
      </motion.div>
      <ThemeCards themes={response.themes} reduceMotion={reduceMotion} />
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduceMotion ? 0 : 0.18, duration: 0.35, ease: easeOut }}
      >
        <CareCard care={response.care} />
      </motion.div>
      <SourceChips sources={response.sources} />
      <p className="response-disclaimer">{response.disclaimer}</p>
    </div>
  );
}

function toHistory(turns: Turn[]) {
  return turns
    .flatMap((turn) => [
      { role: "user" as const, content: turn.prompt },
      { role: "assistant" as const, content: turn.response.reply },
    ])
    .slice(-6);
}

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceReady, setVoiceReady] = useState(false);
  // Default English (en-US). Do not use en-IN  Chrome often types Devanagari.
  const [voiceLocale, setVoiceLocale] = useState<VoiceLocale>("en");
  const [error, setError] = useState("");
  const threadRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const baseMessageRef = useRef("");
  const voiceLocaleRef = useRef<VoiceLocale>("en");
  const shouldReduceMotion = useReducedMotion();
  const animationDuration = shouldReduceMotion ? 0 : 0.32;

  useEffect(() => {
    const stored = readStoredVoiceLocale();
    setVoiceLocale(stored);
    voiceLocaleRef.current = stored;
  }, []);

  useEffect(() => {
    voiceLocaleRef.current = voiceLocale;
    storeVoiceLocale(voiceLocale);
  }, [voiceLocale]);

  useEffect(() => {
    setVoiceReady(speechSupported());
    return () => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    };
  }, []);

  function selectVoiceLocale(next: VoiceLocale) {
    if (next === voiceLocale) return;
    if (isListening) stopListening();
    setVoiceLocale(next);
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  }

  function appendTheme(id: ThemeId) {
    const label = getThemeLabel(id);
    setMessage((current) =>
      current ? `${current}, ${label.toLowerCase()}` : label,
    );
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setIsListening(false);
  }

  function toggleListening() {
    if (isLoading) return;

    if (isListening) {
      stopListening();
      return;
    }

    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setError(
        "Voice input needs Chrome or Edge on this device. You can still type.",
      );
      return;
    }

    setError("");
    baseMessageRef.current = message.trim();
    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    // Must be set before start(). en-US avoids Devanagari for English speech.
    const micLang = voiceBcp47(voiceLocaleRef.current);
    recognition.lang = micLang;
    recognition.onresult = (event) => {
      let interim = "";
      let finalChunk = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const piece = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalChunk += piece;
        else interim += piece;
      }
      const probe = `${finalChunk} ${interim}`.trim();
      if (
        probe &&
        transcriptMismatchesLocale(probe, voiceLocaleRef.current)
      ) {
        recognition.stop();
        setIsListening(false);
        setError(
          voiceLocaleRef.current === "en"
            ? "Mic is typing Hindi/Kannada script. Keep Speak in → English selected, stop, and try again  or switch to Hindi / ಕನ್ನಡ if that is what you are speaking."
            : "Mic language does not match the script it typed. Switch Speak in to match your language, then try again.",
        );
        return;
      }
      if (finalChunk) {
        baseMessageRef.current = [baseMessageRef.current, finalChunk.trim()]
          .filter(Boolean)
          .join(" ")
          .trim();
      }
      const next = [baseMessageRef.current, interim.trim()]
        .filter(Boolean)
        .join(" ")
        .trim();
      setMessage(next.slice(0, 4000));
    };
    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error === "not-allowed") {
        setError("Microphone permission is needed for voice input.");
      } else if (event.error !== "aborted" && event.error !== "no-speech") {
        setError("Voice input paused. Try again, or type your message.");
      }
    };
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };
    recognitionRef.current = recognition;
    try {
      recognition.start();
      setIsListening(true);
    } catch {
      setError("Could not start the microphone. Try again or type instead.");
      setIsListening(false);
    }
  }

  async function sendPrompt(prompt: string) {
    const trimmed = prompt.trim();
    if (trimmed.length < 3 || trimmed.length > 4000 || isLoading) return;

    setIsLoading(true);
    setError("");
    setMessage("");
    try {
      const payload: ChatRequest = {
        message: trimmed,
        history: toHistory(turns),
        // Detect reply language from the text (not the mic chip).
        locale: "auto",
      };
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        const detail =
          typeof result === "object" &&
          result !== null &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : "Sakhi could not respond. Please try again.";
        throw new Error(detail);
      }
      const normalized = normalizeChatResponse(result);
      if (!normalized) {
        throw new Error(
          "Sakhi returned a response that did not match the chat contract.",
        );
      }
      const nextTurn: Turn = {
        id: Date.now(),
        prompt: trimmed,
        response: normalized,
      };
      setTurns((current) => [...current, nextTurn]);
      requestAnimationFrame(() => {
        threadRef.current?.scrollTo({
          top: threadRef.current.scrollHeight,
          behavior: "smooth",
        });
      });
    } catch (caught) {
      setMessage(trimmed);
      setError(
        caught instanceof Error
          ? caught.message
          : "Sakhi could not respond. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendPrompt(message);
  }

  return (
    <section className="chat-page">
      <div className="chat-wrap">
        <motion.header
          className="chat-heading"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: easeOut }}
        >
          <p className="eyebrow">A private moment to ask</p>
          <h1>What&apos;s on your mind?</h1>
          <p>Share what you&apos;ve noticed. We&apos;ll take it one step at a time.</p>
        </motion.header>

        <motion.div
          className="chat-panel"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.08, duration: 0.5, ease: easeOut }}
        >
          {turns.length > 0 && (
            <div className="chat-toolbar">
              <span className="chat-session-note">
                <Sparkles aria-hidden="true" size={14} />
                Private to this browser tab
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="new-chat-button"
                    onClick={() => {
                      setTurns([]);
                      setMessage("");
                      setError("");
                    }}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    <Plus aria-hidden="true" size={14} />
                    New chat
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Clear this session</TooltipContent>
              </Tooltip>
            </div>
          )}

          <div
            className="chat-thread"
            ref={threadRef}
            aria-live="polite"
            aria-label="Conversation"
          >
            <AnimatePresence mode="wait">
              {turns.length === 0 && !isLoading ? (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="empty-state"
                  exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
                  key="empty"
                  transition={{ duration: animationDuration, ease: easeOut }}
                >
                  <motion.div
                    className="empty-orb"
                    aria-hidden="true"
                    animate={
                      shouldReduceMotion
                        ? undefined
                        : { scale: [1, 1.04, 1], rotate: [0, 2, 0] }
                    }
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles size={22} strokeWidth={1.5} />
                  </motion.div>
                  <h2>Start wherever you are</h2>
                  <p>Pick a starting point, or write in your own words.</p>
                  <div className="demo-list" aria-label="Example messages">
                    {demos.map((demo, index) => (
                      <motion.button
                        key={demo.label}
                        className="demo-button"
                        type="button"
                        onClick={() => {
                          setMessage(demo.text);
                          setError("");
                        }}
                        initial={
                          shouldReduceMotion ? false : { opacity: 0, y: 10 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: shouldReduceMotion ? 0 : 0.12 + index * 0.05,
                          duration: 0.35,
                          ease: easeOut,
                        }}
                        whileHover={shouldReduceMotion ? undefined : { y: -3 }}
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                      >
                        <span className="demo-button-label">{demo.label}</span>
                        <span className="demo-button-hint">{demo.hint}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  animate={{ opacity: 1 }}
                  className="turn-list"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  key="turns"
                  transition={{ duration: animationDuration }}
                >
                  <AnimatePresence initial={false}>
                    {turns.map((turn) => (
                      <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        className="turn-block"
                        exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
                        initial={{
                          opacity: 0,
                          y: shouldReduceMotion ? 0 : 16,
                        }}
                        key={turn.id}
                        layout={!shouldReduceMotion}
                        transition={{ duration: animationDuration, ease: easeOut }}
                      >
                        <div className="message-row user">
                          <div className="user-bubble">{turn.prompt}</div>
                        </div>
                        <AssistantMessage
                          response={turn.response}
                          reduceMotion={shouldReduceMotion}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isLoading && (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="loading-message"
                  exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 4 }}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
                  role="status"
                  transition={{ duration: animationDuration }}
                >
                  <span className="loading-dots" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                  Listening and gathering educational context…
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="chat-composer">
            <div className="theme-chips" aria-label="Optional topic prompts">
              {themeOptions.map((theme) => (
                <Tooltip key={theme.id}>
                  <TooltipTrigger asChild>
                    <button
                      className="theme-chip"
                      onClick={() => appendTheme(theme.id)}
                      type="button"
                    >
                      {theme.label}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Add {theme.label.toLowerCase()} to your message
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
            {voiceReady ? (
              <div
                className="voice-lang-row"
                role="group"
                aria-label="Microphone language"
              >
                <span className="voice-lang-label">Speak in</span>
                {VOICE_LANG_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`voice-lang-chip${voiceLocale === option.id ? " is-active" : ""}`}
                    aria-pressed={voiceLocale === option.id}
                    disabled={isListening}
                    onClick={() => selectVoiceLocale(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
                <span className="voice-lang-hint">
                  {voiceBcp47(voiceLocale)} · pick before using the mic
                </span>
              </div>
            ) : null}
            <form
              className="composer-form"
              onSubmit={submitMessage}
              ref={formRef}
            >
              <Textarea
                aria-label="Describe what you have noticed"
                className="composer-textarea"
                maxLength={4000}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={handleComposerKeyDown}
                placeholder={
                  isListening
                    ? `Listening… speak in ${
                        voiceLocale === "hi"
                          ? "Hindi"
                          : voiceLocale === "kn"
                            ? "Kannada"
                            : "English"
                      }`
                    : "Write in your own words, or use the mic…"
                }
                rows={2}
                value={message}
              />
              {voiceReady ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      aria-label={isListening ? "Stop listening" : "Start voice input"}
                      aria-pressed={isListening}
                      className={`mic-button${isListening ? " mic-button-live" : ""}`}
                      disabled={isLoading}
                      onClick={toggleListening}
                      size="lg"
                      type="button"
                      variant="outline"
                    >
                      {isListening ? (
                        <Square aria-hidden="true" size={15} />
                      ) : (
                        <Mic aria-hidden="true" size={16} />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isListening
                      ? "Stop listening"
                      : `Mic language: ${
                          voiceLocale === "hi"
                            ? "Hindi"
                            : voiceLocale === "kn"
                              ? "Kannada"
                              : "English"
                        }`}
                  </TooltipContent>
                </Tooltip>
              ) : null}
              <Button
                className="send-button"
                disabled={isLoading || message.trim().length < 3}
                size="lg"
                type="submit"
              >
                {isLoading ? (
                  "Sending…"
                ) : (
                  <>
                    Send <ArrowUp aria-hidden="true" size={16} />
                  </>
                )}
              </Button>
            </form>
            <AnimatePresence>
              {error && (
                <motion.p
                  animate={{ opacity: 1, height: "auto" }}
                  className="error-message"
                  exit={{ opacity: 0, height: 0 }}
                  initial={{ opacity: 0, height: 0 }}
                  role="alert"
                  transition={{ duration: animationDuration }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="composer-caption">
              <span>
                {isListening
                  ? "Listening  tap the square when you’re done."
                  : "Only share what you feel comfortable sharing."}
              </span>
              <span className="composer-hints">
                <span>{message.length}/4000</span>
                <span aria-hidden="true">·</span>
                <span>⌘ / Ctrl + Enter</span>
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

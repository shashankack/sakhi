"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp, Mic, Plus, Sparkles, Square } from "lucide-react";
import { FormEvent, KeyboardEvent, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  themeOptions,
  ThemeId,
  type RedFlag,
} from "@/lib/chat";

type Turn = {
  id: number;
  prompt: string;
  response: ChatResponse;
};

const demos = [
  {
    label: "Periods, facial hair & weight · Hinglish",
    text: "periods 2 mahine se nahi aaye, chehre pe baal aa rahe hain, weight badh raha hai",
  },
  {
    label: "Heavy bleeding & feeling faint · urgent",
    text: "I have heavy bleeding soaking through pads every hour and I feel dizzy and about to faint",
  },
  {
    label: "Acne & mood · English",
    text: "I've had more acne lately and my mood has been changing",
  },
  {
    label: "पीरियड्स में बदलाव · हिन्दी",
    text: "मेरे पीरियड्स अनियमित हैं और मुझे थकान रहती है",
  },
];

function UserBubble({ children }: { children: string }) {
  return <div className="user-bubble">{children}</div>;
}

function AssistantText({ children }: { children: string }) {
  return <div className="assistant-text">{children}</div>;
}

function RedFlagPanel({ flags, summary }: { flags: RedFlag[]; summary: string }) {
  return (
    <section className="red-flag-panel" aria-live="assertive" aria-label="Urgent care guidance">
      <h3>Urgent symptoms — get help now</h3>
      <p>{summary}</p>
      <p>
        Saheli cannot assess an emergency. If you may faint, ask someone nearby
        to help you get care.
      </p>
      <ul>
        {flags.map((flag) => (
          <li key={flag.id}>
            <strong>{flag.label}</strong>
            {flag.guidance && flag.guidance !== flag.label ? (
              <> — {flag.guidance}</>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

function ThemeCards({ themes }: { themes: ChatResponse["themes"] }) {
  if (themes.length === 0) return null;
  return (
    <section className="theme-grid" aria-label="Related education">
      {themes.map((theme) => (
        <Card
          className="response-card theme-card gap-0 py-0 ring-0"
          key={theme.id}
          role="article"
        >
          <span className="theme-label">{getThemeLabel(theme.id)}</span>
          <h3>{theme.title}</h3>
          <p>{theme.summary}</p>
          <p>{theme.pcos_context}</p>
          <p>{theme.overlap}</p>
        </Card>
      ))}
    </section>
  );
}

function CareCard({ care }: { care: ChatResponse["care"] }) {
  return (
    <Card
      className="response-card care-card gap-0 py-0 ring-0"
      aria-label="Care next steps"
      role="region"
    >
      <div className="care-topline">
        <h3>Care next steps</h3>
        <Badge
          className={`urgency-pill ${care.urgency}`}
          variant="outline"
        >
          {care.urgency}
        </Badge>
      </div>
      <p>{care.summary}</p>
      {care.questions.length > 0 && (
        <ul>
          {care.questions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function SourceChips({ sources }: { sources: ChatResponse["sources"] }) {
  if (sources.length === 0) return null;
  return (
    <div className="source-list" aria-label="Sources">
      {sources.map((source, index) => (
        <Badge
          className="source-chip"
          key={`${source.title}-${source.section}-${index}`}
          variant="outline"
        >
          {source.title} · {source.section}
        </Badge>
      ))}
    </div>
  );
}

function AssistantMessage({ response }: { response: ChatResponse }) {
  const hasRedFlags = response.red_flags.length > 0;
  return (
    <div className="message-row assistant">
      {hasRedFlags && (
        <RedFlagPanel
          flags={response.red_flags}
          summary={response.care.summary}
        />
      )}
      <AssistantText>{response.reply}</AssistantText>
      <div className="response-meta" aria-label="Response details">
        <Badge className="meta-pill" variant="outline">
          Language: {response.language}
        </Badge>
        <Badge className="meta-pill" variant="outline">
          Engine: {response.engine}
        </Badge>
      </div>
      <ThemeCards themes={response.themes} />
      <CareCard care={response.care} />
      <SourceChips sources={response.sources} />
      <span className="response-meta">{response.disclaimer}</span>
    </div>
  );
}

function toHistory(turns: Turn[]) {
  return turns.flatMap((turn) => [
    { role: "user" as const, content: turn.prompt },
    { role: "assistant" as const, content: turn.response.reply },
  ]).slice(-6);
}

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState("");
  const threadRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const shouldReduceMotion = useReducedMotion();
  const animationDuration = shouldReduceMotion ? 0 : 0.24;

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  }

  function appendTheme(id: ThemeId) {
    const label = getThemeLabel(id);
    setMessage((current) => (current ? `${current}, ${label.toLowerCase()}` : label));
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
            : "Saheli could not respond. Please try again.";
        throw new Error(detail);
      }
      const normalized = normalizeChatResponse(result);
      if (!normalized) {
        throw new Error(
          "Saheli returned a response that did not match the chat contract.",
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
          : "Saheli could not respond. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendPrompt(message);
  }

  async function toggleRecording() {
    if (isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        const form = new FormData();
        form.append("audio", blob, "recording.webm");
        setError("");
        setIsLoading(true);
        try {
          const res = await fetch("/api/stt", { method: "POST", body: form });
          const data: unknown = await res.json();
          if (!res.ok) {
            const detail =
              typeof data === "object" &&
              data !== null &&
              "error" in data &&
              typeof data.error === "string"
                ? data.error
                : "Speech recognition is unavailable. Set STT_API_URL on the server, or type instead.";
            throw new Error(detail);
          }
          const text =
            typeof data === "object" &&
            data !== null &&
            "text" in data &&
            typeof data.text === "string"
              ? data.text.trim()
              : "";
          if (text.length < 3) {
            throw new Error("Could not understand the recording. Try again or type.");
          }
          setIsLoading(false);
          setMessage(text);
          await sendPrompt(text);
        } catch (caught) {
          setError(
            caught instanceof Error
              ? caught.message
              : "Speech recognition failed.",
          );
          setIsLoading(false);
        }
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      setError("Microphone permission is required for voice input.");
    }
  }

  return (
    <section className="chat-page">
      <div className="chat-wrap">
        <header className="chat-heading">
          <p className="eyebrow">A private moment to ask</p>
          <h1>What&apos;s on your mind?</h1>
          <p>Share what you&apos;ve noticed. We&apos;ll take it one step at a time.</p>
        </header>
        <Card className="chat-panel gap-0 py-0 ring-0">
          {turns.length > 0 && (
            <div className="chat-toolbar">
              <span className="chat-session-note">
                <Sparkles aria-hidden="true" size={14} />
                A private, session-only conversation
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
                    <Plus aria-hidden="true" />
                    New conversation
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Clear this session&apos;s conversation</TooltipContent>
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
                  exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                  key="empty"
                  transition={{ duration: animationDuration }}
                >
                  <div className="empty-orb" aria-hidden="true">
                    <Sparkles size={21} strokeWidth={1.6} />
                  </div>
                  <h2>Start wherever you are.</h2>
                  <p>Try a prompt, or write in the words that feel right.</p>
                  <div className="demo-list" aria-label="Example messages">
                    {demos.map((demo, index) => (
                      <motion.div
                        key={demo.label}
                        animate={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                        transition={{
                          delay: shouldReduceMotion ? 0 : index * 0.045,
                          duration: animationDuration,
                        }}
                        whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                      >
                        <Button
                          className="demo-button"
                          onClick={() => {
                            setMessage(demo.text);
                            setError("");
                          }}
                          type="button"
                          variant="outline"
                        >
                          {demo.label}
                        </Button>
                      </motion.div>
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
                        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
                        key={turn.id}
                        layout={!shouldReduceMotion}
                        transition={{ duration: animationDuration }}
                      >
                        <div className="message-row user">
                          <UserBubble>{turn.prompt}</UserBubble>
                        </div>
                        <AssistantMessage response={turn.response} />
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
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 4 }}
                  role="status"
                  transition={{ duration: animationDuration }}
                >
                  <span className="loading-dots" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                  Preparing an educational response…
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="chat-composer">
            <div className="theme-chips" aria-label="Optional topic prompts">
              {themeOptions.map((theme) => (
                <Tooltip key={theme.id}>
                  <TooltipTrigger asChild>
                    <Button
                      className="theme-chip"
                      onClick={() => appendTheme(theme.id)}
                      type="button"
                      variant="outline"
                    >
                      {theme.label}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Add {theme.label.toLowerCase()} to your message
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
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
                placeholder="Write in your own words…"
                rows={1}
                value={message}
              />
              <Button
                aria-label={isRecording ? "Stop recording" : "Record voice"}
                className="send-button"
                disabled={isLoading}
                onClick={() => void toggleRecording()}
                size="lg"
                type="button"
                variant={isRecording ? "destructive" : "outline"}
              >
                {isRecording ? (
                  <Square aria-hidden="true" size={16} />
                ) : (
                  <Mic aria-hidden="true" size={16} />
                )}
              </Button>
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
              <span>Only share what you feel comfortable sharing.</span>
              <span className="composer-hints">
                <span>{message.length}/4000</span>
                <span aria-hidden="true">·</span>
                <span>⌘ / Ctrl + Enter to send</span>
              </span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

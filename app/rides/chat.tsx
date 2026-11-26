import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import type { Driver, Message } from "./types";

export function Chat({ drivers, active, conversations, onSelect, onSend }: {
  drivers: Driver[];
  active: Driver | undefined;
  conversations: Record<string, Message[]>;
  onSelect: (driver: Driver) => void;
  onSend: (driver: Driver, text: string) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="panel self-start p-3" aria-label="Conversations">
        {drivers.map((driver) => (
          <button key={driver.id} aria-pressed={active?.id === driver.id} className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-left font-semibold hover:bg-offwhite aria-pressed:bg-tint aria-pressed:text-maroon" onClick={() => onSelect(driver)}>
            <MessageCircle size={17} aria-hidden="true" /> {driver.name}
          </button>
        ))}
      </aside>
      {active && <Thread key={active.id} driver={active} messages={conversations[active.id] ?? []} onSend={(text) => onSend(active, text)} />}
    </div>
  );
}

function Thread({ driver, messages, onSend }: {
  driver: Driver;
  messages: Message[];
  onSend: (text: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const history = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const log = history.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages]);

  return (
    <section className="panel min-w-0 overflow-hidden">
      <div className="border-b border-line p-4">
        <h2 className="font-bold">{driver.name}</h2>
        <p className="mt-1 text-sm text-muted">Demo chat · Messages stay in this session.</p>
      </div>
      <div ref={history} role="log" aria-label={`Messages with ${driver.name}`} className="flex h-72 flex-col gap-3 overflow-y-auto bg-offwhite p-4">
        {messages.map((message) => {
          const sentByPassenger = message.from === "passenger";
          return (
            <div key={message.id} className={`max-w-[85%] rounded-xl px-4 py-3 [overflow-wrap:anywhere] ${sentByPassenger ? "self-end bg-maroon text-white" : "self-start border border-line bg-white"}`}>
              <p className="whitespace-pre-wrap">{message.text}</p>
              <time className="mt-1 block text-xs opacity-80" dateTime={new Date(message.sentAt).toISOString()}>
                {new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(message.sentAt)}
              </time>
            </div>
          );
        })}
      </div>
      <form className="flex flex-wrap gap-2 p-4 sm:flex-nowrap" onSubmit={(event) => {
        event.preventDefault();
        const text = draft.trim();
        if (text) {
          onSend(text);
          setDraft("");
        }
      }}>
        <label className="field grow">
          <span className="sr-only">Message</span>
          <input placeholder="Write a message" value={draft} maxLength={1000} onChange={(event) => setDraft(event.target.value)} />
        </label>
        <button className="primary" disabled={!draft.trim()}><Send size={16} aria-hidden="true" /> Send</button>
      </form>
    </section>
  );
}

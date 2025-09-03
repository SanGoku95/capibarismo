import React, { useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { Send, Shield, Users, Leaf, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// Update premade questions to include icons
const premadeQuestions = [
  {
    text: "Propuestas de Antauro sobre seguridad",
    icon: <Shield className="w-4 h-4 mr-2" />,
  },
  {
    text: "Experiencia política de Keiko y Verónika",
    icon: <Users className="w-4 h-4 mr-2" />,
  },
  {
    text: "¿Qué candidato prioriza el medio ambiente?",
    icon: <Leaf className="w-4 h-4 mr-2" />,
  },
];

const TypingIndicator = () => (
  <div className="flex items-start gap-3 chat-bubble">
    <div className="assistant-avatar">C</div>
    <div className="bg-card text-card-foreground p-3 rounded-lg rounded-bl-none flex items-center space-x-1 h-10">
      <span className="w-2 h-2 bg-muted-foreground rounded-full typing-dot" />
      <span className="w-2 h-2 bg-muted-foreground rounded-full typing-dot" />
      <span className="w-2 h-2 bg-muted-foreground rounded-full typing-dot" />
    </div>
  </div>
);

export default function ChatPage() {
  const [searchParams] = useSearchParams();
  const prefilledQuestion = searchParams.get("question") || "";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initial greeting
  useEffect(() => {
    setMessages([
      {
        id: nanoid(),
        role: "assistant",
        content: "¡Hola! Soy Capy, tu IA para las elecciones. Elige una pregunta o escribe la tuya.",
      },
    ]);
  }, []);

  // Prefill via URL param
  useEffect(() => {
    if (prefilledQuestion) setInput(prefilledQuestion);
  }, [prefilledQuestion]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isStreaming) return;

    const userMsg: Message = { id: nanoid(), role: "user", content: content.trim() };
    const conversation = [...messages, userMsg]; // snapshot before async
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Placeholder assistant message for streaming
    const assistantId = nanoid();
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

    const controller = new AbortController();
    setAbortController(controller);
    setIsStreaming(true);

    try {
      const resp = await fetch("/api/deepseek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversation.map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: controller.signal,
      });

      if (!resp.ok || !resp.body) {
        throw new Error("No stream");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: acc } : m)),
        );
      }
    } catch (e) {
      if (controller.signal.aborted) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: (m.content || "") + "\n[Respuesta detenida]" }
              : m,
          ),
        );
      } else {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content:
                    (m.content || "") + "\n[Error al obtener la respuesta. Intenta nuevamente.]",
                }
              : m,
          ),
        );
      }
    } finally {
      setIsStreaming(false);
      setAbortController(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const stopStreaming = () => {
    abortController?.abort();
  };

  return (
    <div className="fighting-game-bg min-h-[calc(100vh-64px)] p-4 md:p-8 flex justify-center items-center">
      <div className="chat-container-modern w-full max-w-4xl h-[85vh] flex flex-col">
        <div className="chat-header-modern">
          <h1 className="text-center font-display">IA Capy</h1>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-6">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 chat-bubble ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.role === "assistant" && <div className="assistant-avatar">C</div>}
              <div
                className={`message-bubble ${
                  m.role === "user" ? "user-bubble" : "assistant-bubble"
                }`}
              >
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          ))}
          {isStreaming && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          {messages.length <= 1 && (
            <div className="mb-3 grid grid-cols-1 md:grid-cols-3 gap-2">
              {premadeQuestions.map((q) => (
                <Button
                  key={q.text}
                  variant="outline"
                  className="suggestion-button"
                  onClick={() => sendMessage(q.text)}
                  disabled={isStreaming}
                >
                  {q.icon}
                  <span className="flex-1">{q.text}</span>
                </Button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pregúntale algo al Capy..."
              rows={1}
              className="chat-textarea flex-grow"
              disabled={isStreaming}
            />
            {isStreaming && (
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="chat-send-button"
                onClick={stopStreaming}
                title="Detener"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
            <Button
              type="submit"
              size="icon"
              className="chat-send-button"
              disabled={!input.trim() || isStreaming}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
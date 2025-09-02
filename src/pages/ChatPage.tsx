import { nanoid } from 'nanoid';
import { Button } from '@/components/ui/button';
import { Send, Shield, Users, Leaf } from 'lucide-react'; // Import new icons
import React, { useEffect, useRef, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useSearchParams } from 'react-router-dom';

interface Message {
    id: string;
    role: 'user' | 'assistant';
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
    <div className="flex items-start gap-3 justify-start chat-bubble">
        <div className="assistant-avatar">C</div>
        <div className="bg-card text-card-foreground p-3 rounded-lg rounded-bl-none flex items-center space-x-1 h-10">
            <span className="w-2 h-2 bg-muted-foreground rounded-full typing-dot"></span>
            <span className="w-2 h-2 bg-muted-foreground rounded-full typing-dot"></span>
            <span className="w-2 h-2 bg-muted-foreground rounded-full typing-dot"></span>
        </div>
    </div>
);

export default function ChatPage() {
    const [searchParams] = useSearchParams();
    const prefilledQuestion = searchParams.get('question') || '';

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        setMessages([
            {
                id: nanoid(),
                role: 'assistant',
                content: '¡Hola! Soy Capy, tu IA para las elecciones. Elige una pregunta o escribe la tuya.',
            },
        ]);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);

    useEffect(() => {
        if (prefilledQuestion) {
            setInput(prefilledQuestion);
        }
    }, [prefilledQuestion]);

    const handleSend = (messageContent: string) => {
        if (!messageContent.trim()) return;

        const userMessage: Message = { id: nanoid(), role: 'user', content: messageContent };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const assistantMessage: Message = { id: nanoid(), role: 'assistant', content: 'Capy Capy' };
            setMessages((prev) => [...prev, assistantMessage]);
            setIsTyping(false);
        }, 1500);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSend(input);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend(input);
        }
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
                            className={`flex items-start gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'} chat-bubble`}
                        >
                            {m.role === 'assistant' && (
                                <div className="assistant-avatar">C</div>
                            )}
                            <div className={`message-bubble ${m.role === 'user' ? 'user-bubble' : 'assistant-bubble'}`}>
                                <p className="whitespace-pre-wrap">{m.content}</p>
                            </div>
                        </div>
                    ))}
                    {isTyping && <TypingIndicator />}
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
                                    onClick={() => handleSend(q.text)}
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
                            disabled={isTyping}
                        />
                        <Button type="submit" size="icon" className="chat-send-button" disabled={!input.trim() || isTyping}>
                            <Send className="h-5 w-5" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
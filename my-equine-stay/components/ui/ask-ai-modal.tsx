"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles } from "lucide-react";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
}

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  sender: "ai",
  text: "Hi! I can help you explore Ocala equestrian stays, understand how My Equine Stay works, or polish your listing description. How can I help?",
};

export function AskAiModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = input.trim();
    if (!query) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Smart simulated AI responses tailored to My Equine Stay
    setTimeout(() => {
      let reply =
        "My Equine Stay connects you directly with property owners for farms, barns, RV hookups, and homes in Ocala and Florida. There are no booking commissions!";

      const lower = query.toLowerCase();
      if (lower.includes("wec") || lower.includes("world equestrian center")) {
        reply =
          "Most of our featured Ocala listings are located within 2 to 6 miles of the World Equestrian Center (WEC), making morning commutes with your trailer quick and stress-free.";
      } else if (lower.includes("price") || lower.includes("cost") || lower.includes("plan")) {
        reply =
          "Listing plans run for 3 months: Standard is $59.97 ($19.99/mo) and Premium is $89.97 ($29.99/mo). My Equine Stay never takes booking fees from guests or owners.";
      } else if (lower.includes("stall") || lower.includes("horse") || lower.includes("barn")) {
        reply =
          "You can filter stays by exact stall count (from 1 to 10+ stalls), pasture acreage, round pens, and dressage or jumping arenas right from the search filters.";
      } else if (lower.includes("book") || lower.includes("contact")) {
        reply =
          "To book a stay, click on any listing and use the 'Contact Property' inquiry form to message the owner directly with your dates and horse count.";
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: reply,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-auto fixed bottom-5 right-5 w-[calc(100vw-2.5rem)] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-[#E5E0D6] overflow-hidden flex flex-col max-h-[560px]"
        >
          {/* Header */}
          <div className="bg-[#1F3A2B] text-white p-4 flex items-center justify-between shrink-0">
            <div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="size-4 text-[#E1B534]" />
                <h3 className="font-serif text-lg leading-none">
                  Stay Assistant
                </h3>
              </div>
              <p className="text-[9px] uppercase tracking-widest text-[#FAF7F2]/70 mt-1">
                MY EQUINE STAY · AI
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close assistant"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="p-4 space-y-3 overflow-y-auto flex-1 min-h-[260px] bg-[#FAF7F2]/50 text-sm"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#1F3A2B] text-white rounded-br-xs"
                      : "bg-white border border-[#E5E0D6] text-[#1B221E] rounded-bl-xs shadow-xs"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#E5E0D6] rounded-2xl px-4 py-2.5 text-xs text-[#6E7771] flex items-center gap-1.5 shadow-xs">
                  <span className="animate-pulse">●</span>
                  <span className="animate-pulse delay-100">●</span>
                  <span className="animate-pulse delay-200">●</span>
                </div>
              </div>
            )}
          </div>

          {/* Input form */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white border-t border-[#E5E0D6] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about stays, filters, or listing tips…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-full border border-[#E5E0D6] text-xs outline-none focus:border-[#1F3A2B] bg-[#FAF7F2]"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="size-9 rounded-full bg-[#1F3A2B] text-white grid place-items-center hover:opacity-90 disabled:opacity-40 transition-opacity"
              aria-label="Send message"
            >
              <Send size={15} />
            </button>
          </form>

          {/* Disclaimer */}
          <div className="bg-white px-4 pb-2.5 pt-0.5 text-center text-[10px] text-[#6E7771]/80 leading-tight">
            AI answers are general. For availability, pricing, and booking,
            contact the property owner directly.
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

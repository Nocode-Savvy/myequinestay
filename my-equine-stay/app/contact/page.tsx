"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
      <main className="mx-auto max-w-2xl px-4 py-16 flex-1 w-full">
        <h1 className="section-heading">Contact Us</h1>
        <p className="mt-2 text-sm text-[#6E7771]">
          Questions, feedback, or partnership ideas? Send us a message.
        </p>

        {submitted ? (
          <div className="mt-10 rounded-2xl bg-white border border-[#E5E0D6] p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#1F3A2B]/10 text-[#1F3A2B] flex items-center justify-center mx-auto">
              <CheckCircle className="size-6" />
            </div>
            <h2 className="font-serif text-2xl text-[#1F3A2B]">
              Message Sent
            </h2>
            <p className="text-sm text-[#6E7771] max-w-md mx-auto">
              Thank you for reaching out! We have received your message and will
              get back to you shortly at <strong>{email}</strong>.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setName("");
                setEmail("");
                setSubject("");
                setMessage("");
              }}
              className="inline-flex items-center justify-center rounded-full bg-[#E1B534] px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:opacity-90 transition-opacity"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#1B221E]">
                Name
              </label>
              <input
                type="text"
                required
                maxLength={100}
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#E5E0D6] bg-white px-3 py-2 text-sm outline-none focus:border-[#1F3A2B] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1B221E]">
                Email
              </label>
              <input
                type="email"
                required
                maxLength={255}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#E5E0D6] bg-white px-3 py-2 text-sm outline-none focus:border-[#1F3A2B] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1B221E]">
                Subject
              </label>
              <input
                type="text"
                required
                maxLength={200}
                placeholder="How can we help?"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#E5E0D6] bg-white px-3 py-2 text-sm outline-none focus:border-[#1F3A2B] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1B221E]">
                Message
              </label>
              <textarea
                required
                maxLength={4000}
                rows={6}
                placeholder="Write your message here…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#E5E0D6] bg-white px-3 py-2 text-sm outline-none focus:border-[#1F3A2B] resize-y transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center justify-center rounded-full bg-[#E1B534] px-6 py-3 text-sm font-medium text-white shadow-sm hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {sending ? "Sending…" : "Send Message"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}

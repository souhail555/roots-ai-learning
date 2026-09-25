"use client";
import { FormEvent, useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError(null);
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ enquiryType: data.get("enquiryType"), name: data.get("name"), email: data.get("email"), subject: data.get("subject"), message: data.get("message"), consent: data.get("consent") === "on" }) });
      const payload = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) throw new Error(payload?.error ?? "Your enquiry could not be sent.");
      setStatus("sent");
      form.reset();
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : "Your enquiry could not be sent. Please try again.");
      setStatus("error");
    }
  }

  return <main className="route-shell contact-page"><p className="marketing-kicker">ROOTS / CONTACT</p><h1>Start the Right Conversation</h1><p className="route-lede">Use the secure form for product support, privacy requests, research collaboration or business enquiries. Do not send urgent medical information.</p>{status === "sent" ? <section className="success-message" role="status"><h2>Thank you. Your enquiry has been received.</h2><p>We will respond through the contact details you provided.</p><button type="button" className="secondary-button" onClick={() => setStatus("idle")}>Send another enquiry</button></section> : <form className="contact-form" onSubmit={submit}><label htmlFor="enquiry-type">Enquiry type</label><select id="enquiry-type" name="enquiryType" defaultValue="support" required><option value="support">Product support</option><option value="privacy">Privacy request</option><option value="research">Research collaboration</option><option value="business">Business enquiry</option></select><label htmlFor="contact-name">Name</label><input id="contact-name" name="name" autoComplete="name" required /><label htmlFor="contact-email">Email</label><input id="contact-email" name="email" type="email" autoComplete="email" required /><label htmlFor="contact-subject">Subject</label><input id="contact-subject" name="subject" required /><label htmlFor="contact-message">Message</label><textarea id="contact-message" name="message" rows={6} maxLength={2000} required /><label className="consent-row" htmlFor="contact-consent"><input id="contact-consent" name="consent" type="checkbox" required /><span>I acknowledge the Privacy Notice and understand this form is not monitored for emergencies.</span></label>{error && <p className="form-error" role="alert">{error}</p>}<p className="field-help">Maximum 2,000 characters. Never include emergency information or unnecessary health details.</p><button className="primary-button" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending securely…" : "Send Enquiry"}</button></form>}<p className="review-boundary">If you may be in immediate danger, contact local emergency services or a qualified healthcare professional.</p></main>;
}

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insights",
  description: "Educational insights about biology, behaviour and responsible health technology from ROOTS-AI.",
};

const topics = ["Metabolism", "Hunger & appetite", "Sleep & recovery", "Circadian timing", "Stress", "Responsible health technology"];

export default function BlogPage() {
  return <main className="marketing-page inner-page blog-page">
    <section className="page-heading"><p className="marketing-kicker">ROOTS / INSIGHTS</p><h1>Medicine Before Symptoms™ — Insights</h1><p>Educational perspectives on metabolism, hunger, sleep, circadian biology, stress, behaviour and responsible health technology.</p></section>
    <section className="blog-launch-state"><span className="blog-launch-badge">LAUNCH STATE</span><h2>Our first evidence-informed insights are being prepared.</h2><p>We are publishing a small, carefully bounded library rather than filling this space with generic health advice. Please return soon for the first article.</p><div className="form-actions"><Link href="/how-it-works" className="primary-button">Explore the method</Link><Link href="/assessment/start" className="secondary-button">Start your assessment</Link></div></section>
    <section className="blog-topic-section"><p className="marketing-kicker">PLANNED TOPICS</p><h2>What we will cover</h2><div className="blog-topic-grid">{topics.map((topic) => <span key={topic}>{topic}</span>)}</div></section>
    <section className="blog-editorial-boundary"><strong>Editorial boundary</strong><p>Every published article will display its author, review date, sources and educational disclaimer. No article will be personalised medical advice.</p></section>
  </main>;
}

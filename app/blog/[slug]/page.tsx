import Link from "next/link";

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = slug.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  return <main className="route-shell route-shell-wide"><p className="marketing-kicker">ROOTS / JOURNAL</p><h1>{title}</h1><p className="route-lede">A ROOTS-AI perspective on biological context, responsible interpretation, and building trust into the way we use data.</p><article className="article-body"><h2>Context before conclusion</h2><p>Useful insight is more than a score. It includes where information came from, what it can support, and where uncertainty remains.</p><h2>Designed for understanding</h2><p>ROOTS-AI uses structured inputs and governed language to make reports easier to read while keeping their limits visible.</p></article><Link href="/blog" className="secondary-button">← Back to journal</Link></main>;
}

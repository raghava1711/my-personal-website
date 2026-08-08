import Link from "next/link";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { PublicNav } from "@/components/PublicNav";
import { ensureSeedData } from "@/lib/seed";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function BlogPostPage({ params }: Props) {
  await ensureSeedData();
  const { slug } = await params;
  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  if (!post || !post.published) notFound();

  return (
    <div className="min-h-screen">
      <PublicNav />
      <main className="px-4 py-16 sm:px-6 lg:px-8">
        <article className="glass mx-auto max-w-4xl rounded-[2rem] p-8 sm:p-12">
          <Link href="/#blog" className="text-sm font-semibold text-blue-600 dark:text-cyan-300">← Back to blog</Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-cyan-300">{post.category} · {formatDate(post.createdAt)}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">{post.title}</h1>
          <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{post.excerpt}</p>
          <div className="mt-10 grid aspect-video place-items-center rounded-[2rem] bg-gradient-to-br from-slate-950 to-blue-700 text-white">Technical article</div>
          <div className="prose prose-slate mt-10 max-w-none whitespace-pre-wrap text-[var(--foreground)] dark:prose-invert">
            {post.content}
          </div>
        </article>
      </main>
    </div>
  );
}

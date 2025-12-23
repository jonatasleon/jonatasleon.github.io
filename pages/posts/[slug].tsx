import { GetStaticPaths, GetStaticProps } from 'next';
import { getAllPosts, getPostBySlug, Post } from '@/lib/posts';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import 'highlight.js/styles/github-dark.css';

interface PostPageProps {
  post: Post;
}

// Helper function to format date-only strings without timezone issues
function formatDate(dateString: string): string {
  // Parse date string (handles both "YYYY-MM-DD" and "YYYY-MM-DD HH:mm:ss" formats)
  const dateOnly = dateString.split(' ')[0]; // Get just the date part
  const [year, month, day] = dateOnly.split('-').map(Number);

  // Create date in local timezone (not UTC)
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function PostPage({ post }: PostPageProps) {
  const siteUrl = 'https://jonatasleon.github.io';
  const postUrl = `${siteUrl}/posts/${post.slug}/`;
  
  // Format date for structured data (ISO 8601)
  const formatDateForSchema = (dateString: string): string => {
    const dateOnly = dateString.split(' ')[0];
    const [year, month, day] = dateOnly.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toISOString();
  };

  // Structured data for blog post
  const postStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.title,
    datePublished: formatDateForSchema(post.date),
    dateModified: formatDateForSchema(post.date),
    author: {
      '@type': 'Person',
      name: 'Jonatas Leon',
    },
    publisher: {
      '@type': 'Person',
      name: 'Jonatas Leon',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    url: postUrl,
  };

  return (
    <Layout>
      <SEO
        title={post.title}
        description={post.excerpt || post.title}
        url={`/posts/${post.slug}/`}
        type="article"
        publishedTime={formatDateForSchema(post.date)}
        modifiedTime={formatDateForSchema(post.date)}
        author="Jonatas Leon"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postStructuredData) }}
      />
      <article className="post">
        <header className="post-header">
          <h1>{post.title}</h1>
          <time dateTime={post.date}>
            {formatDate(post.date)}
          </time>
        </header>
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <style jsx>{`
        .post {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .post-header {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e0e0e0;
        }

        .post-header h1 {
          font-size: 2.5rem;
          margin: 0 0 1rem 0;
          color: #333;
        }

        .post-header time {
          font-size: 1rem;
          color: #666;
        }

        .post-content {
          line-height: 1.8;
          color: #333;
        }

        .post-content :global(h1),
        .post-content :global(h2),
        .post-content :global(h3),
        .post-content :global(h4) {
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #333;
        }

        .post-content :global(h1 .anchor-link),
        .post-content :global(h2 .anchor-link),
        .post-content :global(h3 .anchor-link),
        .post-content :global(h4 .anchor-link) {
          color: inherit;
          text-decoration: none;
          cursor: pointer;
        }

        .post-content :global(h1:hover),
        .post-content :global(h2:hover),
        .post-content :global(h3:hover),
        .post-content :global(h4:hover) {
          color: #2563eb;
        }

        .post-content :global(h1:hover .anchor-link),
        .post-content :global(h2:hover .anchor-link),
        .post-content :global(h3:hover .anchor-link),
        .post-content :global(h4:hover .anchor-link) {
          text-decoration: underline;
        }

        .post-content :global(h1) {
          font-size: 2rem;
        }

        .post-content :global(h2) {
          font-size: 1.75rem;
        }

        .post-content :global(h3) {
          font-size: 1.5rem;
        }

        .post-content :global(p) {
          margin-bottom: 1.5rem;
        }

        .post-content :global(ul),
        .post-content :global(ol) {
          margin-bottom: 1.5rem;
          padding-left: 2rem;
        }

        .post-content :global(li) {
          margin-bottom: 0.5rem;
        }

        .post-content :global(blockquote) {
          border-left: 4px solid #2563eb;
          padding-left: 1rem;
          margin: 1.5rem 0;
          color: #666;
          font-style: italic;
        }

        /* Inline code (single backticks) */
        .post-content :global(code:not(pre code)) {
          background: #f4f4f4;
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
          color: #333;
        }

        /* Code blocks (triple backticks) */
        .post-content :global(pre) {
          background: #0d1117;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin-bottom: 1.5rem;
          border: 1px solid #30363d;
        }

        .post-content :global(pre code) {
          background: none;
          padding: 0;
          color: #c9d1d9;
          font-size: 0.875rem;
          line-height: 1.6;
          display: block;
          overflow-x: auto;
        }

        .post-content :global(pre code.hljs) {
          display: block;
          overflow-x: auto;
          padding: 0;
        }

        .post-content :global(a) {
          color: #2563eb;
          text-decoration: underline;
        }

        .post-content :global(img) {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1.5rem 0;
        }

        .post-content :global(.math-display) {
          overflow-x: auto;
          overflow-y: hidden;
          margin: 1.5rem 0;
        }

        .post-content :global(.katex-display) {
          margin: 1.5rem 0;
        }

        .post-content :global(.katex) {
          font-size: 1.1em;
        }
      `}</style>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts();
  const slugs = (await posts).map((post) => post.slug);

  return {
    paths: slugs.map((slug) => ({
      params: { slug },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const post = await getPostBySlug(slug);

  return {
    props: {
      post,
    },
  };
};

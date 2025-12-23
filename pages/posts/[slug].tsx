import { GetStaticPaths, GetStaticProps } from 'next';
import { getAllPosts, getPostBySlug, Post } from '@/lib/posts';
import Layout from '@/components/Layout';

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
  return (
    <Layout>
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

        .post-content :global(code) {
          background: #f4f4f4;
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
        }

        .post-content :global(pre) {
          background: #f4f4f4;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin-bottom: 1.5rem;
        }

        .post-content :global(pre code) {
          background: none;
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

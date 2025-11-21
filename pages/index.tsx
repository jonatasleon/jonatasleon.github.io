import { GetStaticProps } from 'next';
import Link from 'next/link';
import { getAllPosts, Post } from '@/lib/posts';
import Layout from '@/components/Layout';

interface HomeProps {
  posts: Post[];
}

export default function Home({ posts }: HomeProps) {
  return (
    <Layout>
      <div className="container">
        <header className="header">
          <h1>My Personal Blog</h1>
          <p>Welcome to my blog where I share my thoughts and experiences.</p>
        </header>

        <section className="posts">
          <h2>Latest Posts</h2>
          {posts.length === 0 ? (
            <p>No posts yet. Create your first post in the <code>posts/</code> directory!</p>
          ) : (
            <ul className="post-list">
              {posts.map((post) => (
                <li key={post.slug} className="post-item">
                  <Link href={`/posts/${post.slug}`}>
                    <h3>{post.title}</h3>
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    {post.excerpt && <p className="excerpt">{post.excerpt}</p>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .header {
          margin-bottom: 3rem;
          text-align: center;
        }

        .header h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          color: #333;
        }

        .header p {
          font-size: 1.2rem;
          color: #666;
        }

        .posts h2 {
          font-size: 2rem;
          margin-bottom: 2rem;
          color: #333;
        }

        .post-list {
          list-style: none;
          padding: 0;
        }

        .post-item {
          margin-bottom: 2rem;
          padding: 1.5rem;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          transition: box-shadow 0.2s;
        }

        .post-item:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .post-item a {
          text-decoration: none;
          color: inherit;
        }

        .post-item h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.5rem;
          color: #2563eb;
        }

        .post-item time {
          display: block;
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.5rem;
        }

        .post-item .excerpt {
          margin: 0.5rem 0 0 0;
          color: #555;
          line-height: 1.6;
        }

        code {
          background: #f4f4f4;
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
        }
      `}</style>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getAllPosts();
  return {
    props: {
      posts,
    },
  };
};

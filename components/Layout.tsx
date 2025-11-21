import Link from 'next/link';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/" className="nav-link">
            Home
          </Link>
        </div>
      </nav>
      <main>{children}</main>
      <footer className="footer">
        <div className="footer-container">
          <p>&copy; {new Date().getFullYear()} June's Echo</p>
        </div>
      </footer>

      <style jsx>{`
        .navbar {
          background: #fff;
          border-bottom: 1px solid #e0e0e0;
          padding: 1rem 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-logo {
          font-size: 1.5rem;
          font-weight: bold;
          text-decoration: none;
          color: #2563eb;
        }

        .nav-link {
          text-decoration: none;
          color: #333;
          transition: color 0.2s;
        }

        .nav-link:hover {
          color: #2563eb;
        }

        main {
          min-height: calc(100vh - 200px);
        }

        .footer {
          background: #f9f9f9;
          border-top: 1px solid #e0e0e0;
          padding: 2rem 0;
          margin-top: 4rem;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          text-align: center;
          color: #666;
        }
      `}</style>
    </>
  );
}

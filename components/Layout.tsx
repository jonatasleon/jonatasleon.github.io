import Link from 'next/link';
import { ReactNode } from 'react';
import DarkModeToggle from './DarkModeToggle';

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
          <div className="nav-spacer" />
          <DarkModeToggle />
        </div>
      </nav>
      <main>{children}</main>
      <footer className="footer">
        <div className="footer-container">
          <p>&copy; {new Date().getFullYear()} Jonatas Leon</p>
        </div>
      </footer>

      <style jsx>{`
        .navbar {
          background: var(--bg-color);
          border-bottom: 1px solid var(--border-color);
          padding: 1rem 0;
          position: sticky;
          top: 0;
          z-index: 100;
          transition:
            background-color 0.2s,
            border-color 0.2s;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-spacer {
          flex: 1;
        }

        .nav-logo {
          font-size: 1.5rem;
          font-weight: bold;
          text-decoration: none;
          color: var(--link-color);
        }

        .nav-link {
          text-decoration: none;
          color: var(--text-color);
          transition: color 0.2s;
        }

        .nav-link:hover {
          color: var(--link-color);
        }

        main {
          min-height: calc(100vh - 200px);
        }

        .footer {
          background: var(--footer-bg);
          border-top: 1px solid var(--border-color);
          padding: 2rem 0;
          margin-top: 4rem;
          transition:
            background-color 0.2s,
            border-color 0.2s;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          text-align: center;
          color: var(--footer-text);
        }
      `}</style>
    </>
  );
}

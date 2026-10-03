import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Page = 'home' | 'about' | 'services' | 'portfolio' | 'packages' | 'testimonials' | 'contact' | 'ai-designer' | 'furniture' | 'feedback' | 'admin';

interface RouterContextValue {
  page: Page;
  navigate: (page: Page) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

const validPages: Page[] = [
  'home',
  'about',
  'services',
  'portfolio',
  'packages',
  'testimonials',
  'contact',
  'ai-designer',
  'furniture',
  'feedback',
  'admin',
];

function getPageFromHash(): Page {
  const hash = window.location.hash.replace('#/', '').replace('#', '') as Page;
  return validPages.includes(hash) ? hash : 'home';
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<Page>(() => {
    if (typeof window !== 'undefined') {
      return getPageFromHash();
    }
    return 'home';
  });

  useEffect(() => {
    const handleHashChange = () => setPage(getPageFromHash());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (newPage: Page) => {
    window.location.hash = `/${newPage}`;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return <RouterContext.Provider value={{ page, navigate }}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}

export type { Page };

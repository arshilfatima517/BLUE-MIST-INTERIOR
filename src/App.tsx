import { RouterProvider, useRouter } from '@/router/Router';
import { CurrencyProvider } from '@/lib/currency-context';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ServicesPage from '@/pages/ServicesPage';
import PortfolioPage from '@/pages/PortfolioPage';
import PackagesPage from '@/pages/PackagesPage';
import TestimonialsPage from '@/pages/TestimonialsPage';
import ContactPage from '@/pages/ContactPage';
import AIDesignerPage from '@/pages/AIDesignerPage';
import FurniturePage from '@/pages/FurniturePage';
import FeedbackPage from '@/pages/FeedbackPage';
import AdminPage from '@/pages/AdminPage';

function PageRouter() {
  const { page } = useRouter();

  switch (page) {
    case 'home':
      return <HomePage />;
    case 'about':
      return <AboutPage />;
    case 'services':
      return <ServicesPage />;
    case 'portfolio':
      return <PortfolioPage />;
    case 'packages':
      return <PackagesPage />;
    case 'testimonials':
      return <TestimonialsPage />;
    case 'contact':
      return <ContactPage />;
    case 'ai-designer':
      return <AIDesignerPage />;
    case 'furniture':
      return <FurniturePage />;
    case 'feedback':
      return <FeedbackPage />;
    case 'admin':
      return <AdminPage />;
    default:
      return <HomePage />;
  }
}

function App() {
  return (
    <CurrencyProvider>
      <RouterProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <PageRouter />
          </main>
          <Footer />
        </div>
      </RouterProvider>
    </CurrencyProvider>
  );
}

export default App;

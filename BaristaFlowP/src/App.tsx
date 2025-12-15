import { Routes, Route } from 'react-router-dom';

// Componentes de Layout
import Header from './components/Header';
import Footer from './components/Footer';

// Páginas Públicas
import HeroSection from './components/HeroSection';
import AboutUsSection from './components/AboutUsSection';
import ProductCarousel from './components/ProductCarousel';
import LatestReviewsSection from './components/LatestReviewsSection';

import RecipesPage from './pages/RecipesPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CommunityPage from './pages/CommunityPage';
import BlogDetailPage from './pages/BlogDetailPage.tsx';

// Páginas Protegidas y Roles
import CreateBlogPage from './pages/CreateBlogPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';
import EducatorPanel from './pages/EducatorPanel';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import EducatorApplyPage from "./pages/EducatorApplyPage";
import LearningEnvironment from './pages/LearningEnvironment.tsx';
import CreateCoursePage from './pages/CreateCoursePage.tsx';
import EditCoursePage from './pages/EditCoursePage.tsx';

// Páginas Informativas
import PrivacyPage from './pages/PrivacyPage.tsx';
import TermsPage from './pages/TermsPage.tsx';
import HistoryPage from './pages/HistoryPage.tsx';
import ReturnsPage from './pages/ReturnsPage.tsx';

// Páginas de Pago
import CheckoutPage from './pages/CheckoutPage.tsx';
import PaymentSuccessPage from './pages/PaymentSuccessPage.tsx';
import SearchPage from './pages/SearchPage.tsx';

import './index.css';

// 1. HomePage Mejorado: Estructura vertical forzada
function HomePage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Cada sección ocupa el ancho completo automáticamente */}
      <HeroSection />
      <AboutUsSection />
      <div className="my-8">
        <ProductCarousel />
      </div>
      <LatestReviewsSection />
    </div>
  );
}

// 2. App Principal Mejorada
function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
      {/* Header Fijo */}
      <Header />
      {/* Contenido Principal: pt-20 para compensar el Header fijo */}
      <main className="grow w-full">
        <Routes>
          {/* --- PÁGINAS PRINCIPALES --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />

          {/* --- COMUNIDAD --- */}
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/:id" element={<BlogDetailPage />} />

          {/* --- AUTENTICACIÓN --- */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* --- RUTAS PROTEGIDAS --- */}
          <Route path="/create-blog" element={<ProtectedRoute element={<CreateBlogPage />} />} />
          <Route path="/edit-blog/:id" element={<ProtectedRoute element={<CreateBlogPage />} />} />
          <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
          <Route path="/profile/:id" element={<ProtectedRoute element={<ProfilePage />} />} />
          <Route path="/create-course" element={<RoleProtectedRoute element={<CreateCoursePage />} allowedRole="educator_approved" />} />
          <Route path="/edit-course/:id" element={<RoleProtectedRoute element={<EditCoursePage />} allowedRole="educator_approved" />} />

          {/* --- RUTAS DE ROLES --- */}
          <Route path="/educator-apply" element={<RoleProtectedRoute element={<EducatorApplyPage />} allowedRole="normal" />} />
          <Route path="/educator-panel" element={<RoleProtectedRoute element={<EducatorPanel />} allowedRole="educator_approved" />} />

          {/* 🚨 NUEVA RUTA: AMBIENTE DE APRENDIZAJE 🚨 */}
          <Route path="/learning" element={<ProtectedRoute element={<LearningEnvironment />} />} />

          {/* --- PÁGINAS INFORMATIVAS --- */}
          <Route path="/about-us" element={<HistoryPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/shipping" element={<ReturnsPage />} />

          {/* --- PAGOS (MERCADO PAGO SIMULADO) --- */}
          <Route path="/checkout" element={<ProtectedRoute element={<CheckoutPage />} />} />
          <Route path="/payment-success" element={<ProtectedRoute element={<PaymentSuccessPage />} />} />

          {/* --- BÚSQUEDA --- */}
          <Route path="/search" element={<SearchPage />} />

          {/* --- 404 Not Found --- */}
          <Route path="*" element={
            <div className="text-center py-24">
              <h1 className="text-4xl font-bold text-[#3A1F18] mb-4">404</h1>
              <p className="text-xl text-gray-600">Página no encontrada</p>
            </div>
          } />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
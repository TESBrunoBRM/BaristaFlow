import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx'; // Importa el componente App
import './index.css';

// Importaciones de React Router
import { BrowserRouter as Router } from 'react-router-dom';

// Importaciones de Contextos Globales
import { AuthProvider } from './context/AuthContext.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { SidebarProvider } from './context/SidebarContext.tsx';

// El orden de los Providers es importante:
// AuthProvider debe estar cerca de la raíz para inicializar el usuario.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <AuthProvider> {/* Proveedor de Autenticación */}
        <CartProvider> {/* Proveedor de Carrito */}
          <SidebarProvider>
            <App />
          </SidebarProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>,
);
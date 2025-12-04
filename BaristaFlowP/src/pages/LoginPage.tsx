// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../context/AuthContext'; // Importamos el hook de Auth

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Para deshabilitar el botón

  // Obtenemos las funciones de autenticación del contexto
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Llama a la función de login de Firebase (desde AuthContext)
      await login(email, password);

      // Si es exitoso, Firebase Auth ya actualizó el estado.
      navigate('/'); // Redirige al inicio

    } catch (error) {
      const err = error as { code?: string };
      // Manejo de errores de Firebase
      let errorMessage = 'Error al iniciar sesión. Verifica tus credenciales.';
      if (err.code === 'auth/wrong-password') {
        errorMessage = 'Contraseña incorrecta.';
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'Usuario no encontrado.';
      }
      setError(errorMessage);

    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      // Llama a la función de login con Google (desde AuthContext)
      // ⚠️ NOTA: Necesitas implementar loginWithGoogle en AuthContext
      if (loginWithGoogle) {
        await loginWithGoogle();
        navigate('/'); // Redirige al inicio
      } else {
        alert('Función de login con Google no implementada en AuthContext.');
      }
    } catch {
      setError('Error al iniciar sesión con Google.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h1 className="text-3xl font-extrabold text-[#3A1F18] text-center mb-6">Iniciar Sesión</h1>

        {/* Botón de Google */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-white text-gray-800 font-bold rounded-lg shadow-md border border-gray-300 hover:bg-gray-100 transition-colors"
          disabled={isSubmitting}
        >
          <FcGoogle className="text-2xl" />
          <span>Continuar con Google</span>
        </button>

        <div className="flex items-center my-6">
          <hr className="grow border-gray-300" />
          <span className="mx-4 text-gray-500 text-sm">o</span>
          <hr className="grow border-gray-300" />
        </div>

        <form onSubmit={handleLogin} className="space-y-6">

          {error && (
            <p className="text-sm text-red-600 text-center bg-red-50 p-2 rounded-md border border-red-200">{error}</p>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50"
            />
          </div>

          <button
            type="submit"
            className={`w-full px-6 py-3 font-bold rounded-lg shadow-md transition-colors ${isSubmitting ? 'bg-gray-400 text-gray-700' : 'bg-amber-500 text-[#3A1F18] hover:bg-amber-600'}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Iniciando sesión...' : 'Entrar'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          ¿No tienes una cuenta? <a href="/register" className="text-[#3A1F18] font-semibold hover:underline">Regístrate</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../context/AuthContext';

const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Obtenemos las funciones reales del contexto
    const { register, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    // 🚨 FUNCIÓN DE SANITIZACIÓN PARA PREVENIR INYECCIÓN SQL 🚨
    // (Asegura que no haya código de BD en el username)
    const sanitizeInput = (input: string) => {
        // Elimina caracteres peligrosos comunes en ataques SQL, como comillas, punto y coma, y comandos.
        return input.replace(/['";=()]/g, '');
    };

    // 🚨 Lógica de Registro con Email/Contraseña
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setPasswordError('');

        // 1. SANITIZAR EL NOMBRE DE USUARIO
        const sanitizedUsername = sanitizeInput(username);
        if (sanitizedUsername !== username) {
            setPasswordError('El nombre de usuario contiene caracteres no permitidos.');
            setIsSubmitting(false);
            return;
        }

        // 2. Validación de contraseña
        const passwordRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;
        if (password.length < 8) {
            setPasswordError('La contraseña debe tener al menos 8 caracteres.');
            setIsSubmitting(false);
            return;
        }
        if (!passwordRegex.test(password)) {
            setPasswordError('La contraseña debe contener al menos un caracter especial.');
            setIsSubmitting(false);
            return;
        }

        try {
            // 3. Llamar a la función 'register' de AuthContext con el username
            await register(email, password, sanitizedUsername);

            // Nota: La sincronización del username y el rol inicial se maneja dentro de AuthContext.

            alert(`¡Registro de ${sanitizedUsername} exitoso! Ahora inicia sesión.`);
            navigate('/login');

        } catch (error) {
            const err = error as { code?: string };
            let errorMessage = 'Error al registrar. Inténtalo de nuevo.';
            if (err.code === 'auth/email-already-in-use') {
                errorMessage = 'El correo electrónico ya está en uso.';
            }
            setPasswordError(errorMessage);

        } finally {
            setIsSubmitting(false);
        }
    };

    // 🚨 Lógica de Registro con Google
    const handleGoogleRegister = async () => {
        setPasswordError('');
        try {
            // Llama a la función real de Firebase (loginWithGoogle)
            await loginWithGoogle();

            // Si tiene éxito, redirige al inicio. AuthContext crea el perfil inicial en la DB.
            navigate('/');

        } catch (error) {
            const err = error as { code?: string };
            let errorMessage = 'Error al autenticar con Google. Inténtalo de nuevo.';
            if (err.code === 'auth/popup-closed-by-user') {
                errorMessage = 'Ventana de Google cerrada por el usuario.';
            }
            setPasswordError(errorMessage);
        }
    };

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <h1 className="text-3xl font-extrabold text-[#3A1F18] text-center mb-6">Regístrate</h1>

                {/* Botón de Google */}
                <button
                    onClick={handleGoogleRegister}
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

                {/* Formulario de Registro Email/Contraseña */}
                <form onSubmit={handleRegister} className="space-y-6">
                    {/* Input para Nombre de Usuario */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1">Nombre de Usuario</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={isSubmitting}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50"
                        />
                    </div>
                    {/* Input para Correo Electrónico */}
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
                    {/* Input para Contraseña */}
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
                        {passwordError && (
                            <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className={`w-full px-6 py-3 font-bold rounded-lg shadow-md transition-colors ${isSubmitting ? 'bg-gray-400 text-gray-700' : 'bg-amber-500 text-[#3A1F18] hover:bg-amber-600'}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Registrando...' : 'Crear Cuenta'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-500">
                    ¿Ya tienes una cuenta? <a href="/login" className="text-[#3A1F18] font-semibold hover:underline">Inicia sesión</a>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
// src/pages/EducatorApplyPage.tsx
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FaUpload,
    FaSpinner,
    FaGraduationCap,
    FaCheckCircle,
    FaExclamationTriangle
} from 'react-icons/fa';
// import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // REMOVED
import { database } from '../firebase';
import { ref as dbRef, update } from 'firebase/database';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Helper to convert file to Base64
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const EducatorApplyPage: React.FC = () => {
    const { user, userRole } = useAuth();
    const navigate = useNavigate();

    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    // 3. Hooks must be called unconditionally
    useEffect(() => {
        return () => {
            setProgress(0);
            setError(null);
            setLoading(false);
        };
    }, []);

    // 4. Conditional rendering (after hooks)
    if (userRole === 'educator_pending' || userRole === 'educator_approved') {
        return <Navigate to="/courses" replace />;
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;

        if (selected.size > MAX_FILE_SIZE) {
            setError('El archivo excede el tamaño máximo permitido (5 MB).');
            setFile(null);
            return;
        }

        setFile(selected);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            setError('Debes iniciar sesión para enviar tu solicitud.');
            return;
        }

        if (!file) {
            setError('Selecciona un archivo antes de enviar.');
            return;
        }

        setLoading(true);
        setError(null);
        setProgress(0);

        try {
            // Fake progress for UX
            const interval = setInterval(() => {
                setProgress(prev => Math.min(prev + 10, 90));
            }, 200);

            // Convert to Base64
            const base64String = await fileToBase64(file);

            clearInterval(interval);
            setProgress(100);

            // Actualizar datos del usuario en Realtime Database
            // Actualizar datos del usuario en Realtime Database
            const userRef = dbRef(database, `users/${user.uid}`);
            await update(userRef, {
                role: 'educator_pending',
                verificationDocumentURL: base64String, // Storing Base64 directly
                applicationDate: new Date().toISOString(),
            });

            // 📧 Send Email Notification to Admin via Backend
            try {
                await axios.post(`${API_BASE_URL}/api/educator-apply`, {
                    name: user.displayName || 'Usuario Desconocido',
                    email: user.email,
                    docFile: base64String,
                    docName: file.name
                });
            } catch (emailError) {
                console.error("Error sending email notification:", emailError);
                // Non-blocking error, user still applied successfully
            }

            setUploadSuccess(true);
            setLoading(false);

        } catch (err) {
            console.error('Error general en la aplicación de educador:', err);
            setError('Ocurrió un error inesperado. Intenta nuevamente.');
            setLoading(false);
        }
    };

    // 🟢 Pantalla de confirmación
    if (uploadSuccess) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-6" />
                <h1 className="text-4xl font-extrabold text-green-600 mb-4">
                    ¡Solicitud enviada correctamente!
                </h1>
                <p className="text-lg text-gray-700 mb-8">
                    Tu solicitud está siendo revisada por el equipo.
                    Te notificaremos cuando tu rol sea aprobado.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-[#3A1F18] text-white font-bold rounded-lg hover:bg-amber-600 transition-colors"
                >
                    Volver al inicio
                </button>
            </div>
        );
    }

    // ==========================
    // 🧠 FORMULARIO PRINCIPAL
    // ==========================
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <h1 className="text-3xl font-extrabold text-[#3A1F18] text-center mb-6">
                    <FaGraduationCap className="inline mr-3 text-amber-500" />
                    Aplicar para ser Educador
                </h1>

                <p className="text-gray-600 mb-8">
                    Sube un documento (.pdf, .jpg o .png) que acredite tu experiencia o formación
                    en barismo o café de especialidad.
                    Este proceso puede tomar hasta <b>48 horas</b>.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* INPUT FILE */}
                    <div>
                        <label
                            htmlFor="certificate"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            Documento de certificación
                        </label>
                        <div className="flex items-center space-x-3">
                            <input
                                id="certificate"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileChange}
                                disabled={loading}
                                className="block w-full text-sm text-gray-600 
                                    file:mr-4 file:py-2 file:px-4 file:rounded-full 
                                    file:border-0 file:text-sm file:font-semibold 
                                    file:bg-amber-50 file:text-[#3A1F18] 
                                    hover:file:bg-amber-100 transition"
                            />
                            <FaUpload className="text-xl text-gray-400" />
                        </div>

                        {file && (
                            <p className="mt-2 text-sm text-gray-600">
                                Archivo seleccionado: <b>{file.name}</b>
                            </p>
                        )}
                    </div>

                    {/* PROGRESO */}
                    {loading && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                                className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    )}

                    {/* ERRORES */}
                    {error && (
                        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 flex items-center space-x-2">
                            <FaExclamationTriangle /> <span>{error}</span>
                        </div>
                    )}

                    {/* BOTÓN */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex items-center justify-center px-6 py-3 font-bold rounded-lg shadow-md transition-colors ${loading
                            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                            : 'bg-amber-500 text-[#3A1F18] hover:bg-amber-600'
                            }`}
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="animate-spin mr-2" /> Subiendo...
                            </>
                        ) : (
                            'Enviar solicitud'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EducatorApplyPage;

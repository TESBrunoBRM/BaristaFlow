import React, { useState } from 'react';
import { API_BASE_URL } from '../config/api';

const ContactPage: React.FC = () => {
    // Definición de estados
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState('Ayuda'); // Nuevo estado para categoría
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        // Endpoint de nuestra API local
        const apiUrl = `${API_BASE_URL}/api/contact`;

        const formData = { name, email, subject, category, message };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus('success');
                // Limpiar el formulario
                setName('');
                setEmail('');
                setSubject('');
                setCategory('Ayuda');
                setMessage('');
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Error de red al enviar el formulario:', error);
            setStatus('error');
        }
    };

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <h1 className="text-4xl font-extrabold text-[#3A1F18] text-center mb-4">Contáctanos</h1>

                {/* Mensajes de estado */}
                {status === 'success' && (
                    <p className="p-3 mb-4 text-green-700 bg-green-100 rounded-lg text-center font-semibold">
                        ✅ ¡Mensaje enviado con éxito! Te responderemos pronto.
                    </p>
                )}
                {status === 'error' && (
                    <p className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg text-center font-semibold">
                        ❌ Ocurrió un error al enviar el mensaje. Intenta nuevamente.
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nombre */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={status === 'submitting'}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50 transition-all duration-300 p-3 border"
                        />
                    </div>
                    {/* Correo Electrónico */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={status === 'submitting'}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50 transition-all duration-300 p-3 border"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Asunto */}
                        <div>
                            <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-1">Asunto</label>
                            <input
                                type="text"
                                id="subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                                disabled={status === 'submitting'}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50 transition-all duration-300 p-3 border"
                            />
                        </div>

                        {/* Categoría */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1">Tipo de Solicitud</label>
                            <select
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                disabled={status === 'submitting'}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50 transition-all duration-300 p-3 border bg-white"
                            >
                                <option value="Ayuda">Ayuda / Soporte</option>
                                <option value="Consulta General">Consulta General</option>
                                <option value="Sugerencia">Sugerencia</option>
                                <option value="Reclamo">Reclamo</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                    </div>

                    {/* Mensaje */}
                    <div>
                        <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1">Mensaje</label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            rows={5}
                            disabled={status === 'submitting'}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-500 focus:ring-opacity-50 transition-all duration-300 p-3 border"
                        ></textarea>
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={status === 'submitting'}
                            className={`w-full px-6 py-3 font-bold rounded-lg shadow-md transition-colors ${status === 'submitting' ? 'bg-gray-400 text-gray-700' : 'bg-amber-500 text-[#3A1F18] hover:bg-amber-600'}`}
                        >
                            {status === 'submitting' ? 'Enviando...' : 'Enviar Mensaje'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactPage;
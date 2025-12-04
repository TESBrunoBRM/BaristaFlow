// src/pages/FAQPage.tsx
import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaQuestionCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: '¿Cuál es la mejor cafetera para un principiante?',
    answer: 'Recomendamos la **Prensa Francesa** por su facilidad de uso y bajo costo, o el **V60** para un café más limpio y con matices. Ambos métodos son excelentes para empezar a explorar el mundo del café de especialidad.',
  },
  {
    question: '¿Qué garantía tienen los cursos que compro?',
    answer: 'Todos nuestros cursos ofrecen acceso de por vida al material. Si tienes problemas técnicos o el contenido no cumple las expectativas en los primeros 15 días, ofrecemos un reembolso completo sin preguntas.',
  },
  {
    question: '¿Cómo funciona la autenticación por Firebase?',
    answer: 'Usamos Firebase Auth para la seguridad. Al iniciar sesión o registrarte, Firebase genera un token de seguridad (JWT) que enviamos a nuestra API externa para validar tu identidad sin exponer tu contraseña.',
  },
  {
    question: '¿Hacen envíos a todo el país?',
    answer: 'Sí, realizamos envíos a todo Chile a través de nuestros partners logísticos. El tiempo de entrega varía entre 2 a 5 días hábiles dependiendo de la región.',
  },
  {
    question: '¿Puedo devolver un producto si no me gusta?',
    answer: 'Aceptamos devoluciones de accesorios y equipos dentro de los 30 días de compra, siempre que estén sin uso y en su empaque original. Por razones de seguridad alimentaria, no aceptamos devoluciones de café tostado una vez abierto.',
  },
  {
    question: '¿Cómo puedo convertirme en Educador?',
    answer: 'Si eres un barista certificado o tienes amplia experiencia, puedes postular a través de tu perfil seleccionando "Convertirme en Educador". Nuestro equipo revisará tu solicitud y te contactará.',
  },
];

// Componente individual para cada pregunta (Accordion)
const AccordionItem: React.FC<FAQItem> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        className="flex justify-between items-center w-full py-5 text-left font-bold text-gray-800 hover:text-amber-600 transition-colors focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="text-lg">{question}</span>
        {isOpen ? <FaChevronUp className="text-amber-500" /> : <FaChevronDown className="text-gray-400" />}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-gray-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

const FAQPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-12">
          <FaQuestionCircle className="text-5xl text-amber-500 mx-auto mb-4" />
          <h1 className="text-4xl font-extrabold text-[#3A1F18] mb-4">
            Preguntas Frecuentes
          </h1>
          <p className="text-xl text-gray-600">
            Resolvemos tus dudas sobre café, cursos y envíos.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
          {faqData.map((item, index) => (
            <AccordionItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>

        <div className="mt-12 text-center p-8 bg-amber-50 rounded-2xl border border-amber-100">
          <h2 className="text-2xl font-bold text-[#3A1F18] mb-4">¿No encuentras tu respuesta?</h2>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            Nuestro equipo de soporte está listo para ayudarte con cualquier consulta específica que tengas.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-4 bg-[#3A1F18] text-white font-bold rounded-full shadow-lg hover:bg-[#523126] transition-all transform hover:-translate-y-1"
          >
            Contactar Soporte
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
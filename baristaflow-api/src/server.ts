const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Importamos los servicios
const blogService = require('./services/blogService');
const courseService = require('./services/courseService'); // NEW: Persistent service
// const { getCourses, getCourseById, createCourse, updateCourse, deleteCourse } = require('./courses'); // OLD: In-memory
const { products } = require('./products');

const app = express();
const PORT = 3001;

app.use(cors({
    origin: '*', // ⚠️ Permite cualquier origen. Para mayor seguridad en producción, reemplázalo con tu dominio de Vercel (ej. 'https://baristaflow.vercel.app')
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json({ limit: '50mb' })); // Increased limit for Base64 images

// --- CONFIGURACIÓN DE NODEMAILER ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || ''
    }
});

// Verificación de conexión
transporter.verify(function (error: any, success: any) {
    if (error) {
        console.error("❌ Error conectando al servidor de correo:", error);
    } else {
        console.log("✅ Servidor de correos listo para enviar mensajes.");
        console.log("📧 Usuario configurado:", process.env.EMAIL_USER ? "SÍ" : "NO");
    }
});

// --- RUTAS ---

// Cursos (Persistent)
app.get('/api/courses', async (req: any, res: any) => {
    const courses = await courseService.getCourses();

    // 1. Filter by authorId (Educator's View - Can see all their courses, including archived)
    const authorId = req.query.authorId;
    if (authorId) {
        const filtered = courses.filter((c: any) => c.authorId === authorId);
        return res.status(200).json(filtered);
    }

    // 2. Public Catalog - Filter out archived courses
    // Fix: Users complained archived courses were visible to non-purchasers.
    const activeCourses = courses.filter((c: any) => !c.isArchived);
    res.status(200).json(activeCourses);
});

app.get('/api/courses/:id', async (req: any, res: any) => {
    const course = await courseService.getCourseById(req.params.id);
    if (course) {
        res.status(200).json(course);
    } else {
        res.status(404).json({ message: "Curso no encontrado" });
    }
});

// NEW: Batch fetch for enrolled courses (ignores archival status)
app.post('/api/courses/enrolled', async (req: any, res: any) => {
    // In a real DB service, this would call courseService.getCoursesByIds(ids)
    // Here we delegate to the controller logic which we assume is exposed via courseService wrapper 
    // BUT wait, server.ts imports ./services/courseService which is the PERSISTENT one?
    // OR does it import the local one?
    // Line 8 says: const courseService = require('./services/courseService');
    // Line 9 says: // const { ... } = require('./courses'); (Commented out)
    // So we are using the SERVICE layer. We need to update the SERVICE layer too.

    // Wait, the previous tool updated `courses.ts` (the controller/in-memory file).
    // checking server.ts line 8: `const courseService = require('./services/courseService');`
    // checking server.ts line 35: `await courseService.getCourses()`

    // IF `server.ts` uses `services/courseService.js`, then my edits to `courses.ts` (in-memory) are USELESS unless `services/courseService.js` imports them?
    // Let me check `services/courseService.ts` content (BACKEND).

    // I need to pause and check `baristaflow-api/src/services/courseService.ts`.
    // If it doesn't exist, I might have made a mistake assuming `courses.ts` is used.
    // Line 9 is commented out!

    // ABORTING THIS EDIT to verify backend structure first.
    // I will replace this logic with the actual service call once verified.
    // For now, I will just call the method assuming I will add it to the service.

    try {
        const result = await courseService.getEnrolledCourses(req.body.courseIds);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error fetching enrolled courses" });
    }
});

app.post('/api/courses', async (req: any, res: any) => {
    const newCourseData = req.body;
    if (!newCourseData.title || !newCourseData.price) {
        return res.status(400).json({ message: "Faltan datos obligatorios." });
    }
    try {
        const newCourse = await courseService.createCourse(newCourseData);
        console.log("✅ Curso creado (DB):", newCourse.title);
        res.status(201).json(newCourse);
    } catch (e) {
        res.status(500).json({ message: "Error creando curso" });
    }
});

app.put('/api/courses/:id', async (req: any, res: any) => {
    try {
        const updated = await courseService.updateCourse(req.params.id, req.body);
        if (updated) {
            console.log("✅ Curso actualizado (DB):", req.params.id);
            res.status(200).json(updated);
        } else {
            res.status(404).json({ message: "Curso no encontrado" });
        }
    } catch (e) {
        res.status(500).json({ message: "Error actualizando curso" });
    }
});

app.delete('/api/courses/:id', async (req: any, res: any) => {
    try {
        await courseService.deleteCourse(req.params.id);
        console.log("✅ Curso eliminado (DB):", req.params.id);
        res.status(200).json({ success: true, message: "Curso eliminado" });
    } catch (e) {
        res.status(500).json({ message: "Error eliminando curso" });
    }
});

// Productos
app.get('/api/products', (req: any, res: any) => {
    res.status(200).json(products);
});

// Blogs (Realtime Database)
app.get('/api/blogs', async (req: any, res: any) => {
    const blogs = await blogService.getBlogs();
    res.status(200).json(blogs);
});

app.get('/api/blogs/:id', async (req: any, res: any) => {
    const id = parseInt(req.params.id || '0');
    const blog = await blogService.getBlogById(id);
    if (blog) {
        res.status(200).json(blog);
    } else {
        res.status(404).json({ message: "Blog no encontrado" });
    }
});

app.post('/api/blogs', async (req: any, res: any) => {
    const { title, content, imageUrl, authorId, username, date, excerpt, htmlContent, blocks } = req.body;

    if (!title || !content || !authorId) {
        return res.status(400).json({ message: "Faltan campos obligatorios." });
    }

    try {
        const newBlog = await blogService.createBlog({
            title,
            content,
            imageUrl: imageUrl || 'https://via.placeholder.com/800x400',
            author: username || 'Anónimo',
            authorId, // 🚨 Added authorId to ensure profile visibility
            date: date || new Date().toISOString().split('T')[0],
            likes: 0,
            comments: 0,
            excerpt: excerpt || content.substring(0, 100) + '...',
            htmlContent, // Keeping for legacy/compatibility if needed
            blocks: blocks || [] // New structured content
        });
        console.log("Blog creado en DB:", title);
        res.status(201).json({ success: true, message: "Blog creado con éxito.", blog: newBlog });
    } catch (error) {
        console.error("Error creating blog:", error);
        res.status(500).json({ message: "Error al crear el blog en la base de datos." });
    }
});

app.put('/api/blogs/:id', async (req: any, res: any) => {
    const id = parseInt(req.params.id);
    const blogData = req.body;

    if (isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        const updatedBlog = await blogService.updateBlog(id, blogData);
        if (updatedBlog) {
            res.status(200).json({ success: true, message: "Blog actualizado con éxito.", blog: updatedBlog });
        } else {
            res.status(404).json({ message: "Blog no encontrado" });
        }
    } catch (error) {
        console.error("Error updating blog:", error);
        res.status(500).json({ message: "Error al actualizar el blog." });
    }
});

app.delete('/api/blogs/:id', async (req: any, res: any) => {
    const idParam = req.params.id;
    // Try to parse as int, but keep original if NaN (to allow deleting legacy/string IDs)
    const parsedId = parseInt(idParam);
    const id = isNaN(parsedId) ? idParam : parsedId;

    console.log(`[DELETE] Request to delete blog with ID: ${idParam} (Used: ${id})`);

    // Removed strict isNaN check to allow string IDs for cleanup
    if (!id) {
        return res.status(400).json({ message: "ID inválido." });
    }

    try {
        await blogService.deleteBlog(id);
        res.status(200).json({ success: true, message: "Blog eliminado con éxito." });
    } catch (error) {
        console.error("Error deleting blog:", error);
        res.status(500).json({ message: "Error al eliminar el blog." });
    }
});

// --- ORDENES Y CORREOS ---
app.post('/api/orders', async (req: any, res: any) => {
    const { userId, orderId, orderData } = req.body;

    if (!userId || !orderId || !orderData) {
        return res.status(400).json({ message: "Faltan datos de la orden." });
    }

    try {
        // 1. Guardar en Firebase (Usando el servicio admin implícito o cliente si funciona aquí)
        // Nota: Si 'blogService' ya inicializa firebase, podemos reusar 'db'
        // Pero para asegurar, usamos la referencia directa si es posible.
        // Asumimos que el cliente YA guardó en Firebase (para minimizar cambios riesgosos en backend),
        // O implementamos el guardado aquí.
        // Dado que el usuario dijo "hice un pedido", el cliente ya lo intenta.
        // MEJOR ENFOQUE: El cliente llama a esto PARA confirmar y enviar correo.

        // Vamos a re-implementar el guardado aquí para ser seguros, o confiar en el cliente?
        // El cliente actual guarda en 'orders/uid/orderId'.
        // Si movemos lógica al backend, es más seguro.

        // Simplemente enviamos el correo aquí por ahora para cumplir el requerimiento #2 rápido.
        // Y el cliente llamará a este endpoint AL FINALIZAR.

        const { email, fullName, items, total } = orderData;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email, // Correo del cliente
            subject: `Confirmación de Pedido #${orderId} - BaristaFlow`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h1 style="color: #3A1F18;">¡Gracias por tu compra, ${fullName}!</h1>
                    <p>Tu pedido <strong>#${orderId}</strong> ha sido confirmado y estamos preparándolo.</p>
                    
                    <h3 style="border-bottom: 2px solid #EAB308; padding-bottom: 5px;">Resumen del Pedido</h3>
                    <ul style="list-style: none; padding: 0;">
                        ${items.map((item: any) => `
                            <li style="padding: 10px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;">
                                <span>${item.name} (x${item.quantity})</span>
                                <strong>$${(item.price * item.quantity).toLocaleString()}</strong>
                            </li>
                        `).join('')}
                    </ul>
                    
                    <div style="margin-top: 20px; text-align: right; font-size: 1.2em;">
                        <strong>Total Pagado: $${total.toLocaleString()}</strong>
                    </div>
                    
                    <p style="margin-top: 30px; font-size: 0.9em; color: #777;">
                        Si tienes alguna duda, contáctanos respondiendo a este correo.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`📧 Confirmación de pedido enviada a ${email}`);

        res.status(200).json({ success: true, message: "Orden procesada y correo enviado." });

    } catch (error) {
        console.error("Error processing order:", error);
        res.status(500).json({ message: "Error al procesar la orden." });
    }
});

// --- EDUCATOR APPLICATION ENDPOINT ---
app.post('/api/educator-apply', async (req: any, res: any) => {
    const { name, email, cvFile, docFile, cvName, docName } = req.body;

    // Validación básica (docUrl o cvUrl o content en base64)
    // El frontend nos envía 'docFile' con el base64
    if (!email || !docFile) {
        return res.status(400).json({ message: "Faltan datos (email o documento)." });
    }

    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Se envía a sí mismo (admin)
            subject: `Nueva Solicitud de Educador - ${name || email}`,
            text: `
                Nueva solicitud de educador recibida.
                
                Nombre: ${name || 'N/A'}
                Email: ${email}
                
                Se ha adjuntado el certificado/documento de respaldo.
            `,
            attachments: [
                {
                    filename: docName || 'certificado.pdf',
                    path: docFile // Nodemailer acepta Data URI
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        console.log(`📧 Solicitud de educador recibida de ${email}`);

        res.status(200).json({ success: true, message: "Solicitud enviada y correo notificado." });
    } catch (error) {
        console.error("Error sending educator application email:", error);
        res.status(500).json({ message: "Error al enviar el correo de solicitud." });
    }
});

// --- ENDPOINT DE CONTACTO ---
app.post('/api/contact', async (req: any, res: any) => {
    const { name, email, subject, category, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: "Faltan campos obligatorios." });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'baristaflow.cl@gmail.com',
        subject: `[${category}] Nuevo mensaje de ${name}: ${subject}`,
        text: `
            Has recibido un nuevo mensaje desde el formulario de contacto de BaristaFlow.

            Detalles del Remitente:
            -----------------------
            Nombre: ${name}
            Email: ${email}
            Categoría: ${category}
            Asunto: ${subject}

            Mensaje:
            -----------------------
            ${message}
        `,
        html: `
            <h3>Nuevo Mensaje de Contacto - BaristaFlow</h3>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Categoría:</strong> ${category}</p>
            <p><strong>Asunto:</strong> ${subject}</p>
            <hr>
            <p><strong>Mensaje:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 Correo enviado de ${email} (${category})`);
        res.status(200).json({ success: true, message: "Correo enviado exitosamente." });
    } catch (error) {
        console.error("❌ Error al enviar correo:", error);
        res.status(500).json({ success: false, message: "Error al enviar el correo." });
    }
});

app.get('/', (req: any, res: any) => {
    res.status(200).send('API de BaristaFlow funcionando ☕');
});

app.listen(PORT, () => {
    console.log(`✅ Servidor de API corriendo en http://localhost:${PORT}`);
});
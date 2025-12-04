const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Importamos los servicios
const blogService = require('./services/blogService');
// TODO: Migrar coursesService también a Firestore
const { getCourses, getCourseById, createCourse, updateCourse, deleteCourse } = require('./courses');
const { products } = require('./products');

const app = express();
const PORT = 3000;

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json());

// --- CONFIGURACIÓN DE NODEMAILER ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || ''
    }
});

// --- RUTAS ---

// Cursos
app.get('/api/courses', getCourses);
app.get('/api/courses/:id', getCourseById);
app.post('/api/courses', createCourse);
app.put('/api/courses/:id', updateCourse);
app.delete('/api/courses/:id', deleteCourse);

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
    const { title, content, imageUrl, authorId, username, date, excerpt, htmlContent } = req.body;

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
            htmlContent
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
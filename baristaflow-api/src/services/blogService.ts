const { db } = require('../firebase');
const { ref, get, set, child, push } = require('firebase/database');

const COLLECTION_NAME = 'blogs';

const getBlogs = async () => {
    try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, COLLECTION_NAME));
        if (snapshot.exists()) {
            const data = snapshot.val();
            // Convertir objeto de objetos a array
            return Object.values(data);
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error getting blogs:", error);
        return [];
    }
};

const getBlogById = async (id: number) => {
    try {
        const dbRef = ref(db);
        // Nota: Esto asume que guardamos los blogs con el ID como clave o buscamos en el array.
        // Para simplificar, obtenemos todos y buscamos (no es ideal para muchos datos, pero funciona para empezar).
        // Una mejor estructura sería /blogs/{id}
        const snapshot = await get(child(dbRef, `${COLLECTION_NAME}/${id}`));
        if (snapshot.exists()) {
            return snapshot.val();
        }
        return null;
    } catch (error) {
        console.error("Error getting blog:", error);
        return null;
    }
};

const createBlog = async (blog: any) => {
    try {
        const dbRef = ref(db, COLLECTION_NAME);

        // Obtener el último ID (simulado)
        const snapshot = await get(dbRef);
        let newId = 1;
        if (snapshot.exists()) {
            const blogs = Object.values(snapshot.val());
            // @ts-ignore
            const maxId = Math.max(...blogs.map((b: any) => b.id || 0));
            newId = maxId + 1;
        }

        if (isNaN(newId)) newId = Date.now();

        const newBlog = { ...blog, id: newId };

        // Guardar en /blogs/{id}
        await set(child(dbRef, newId.toString()), newBlog);

        // 🚨 NOTIFICAR A SEGUIDORES 🚨
        if (blog.authorId) {
            const followersRef = ref(db, `users/${blog.authorId}/followers`);
            const followersSnapshot = await get(followersRef);

            if (followersSnapshot.exists()) {
                const followers = followersSnapshot.val();
                const notificationPromises = Object.keys(followers).map(followerId => {
                    const notifRef = child(ref(db, `notifications/${followerId}`), Date.now().toString());
                    return set(notifRef, {
                        type: 'new_post',
                        message: `${blog.author} ha publicado un nuevo blog: "${blog.title}".`,
                        link: `/community/${newId}`,
                        read: false,
                        timestamp: Date.now()
                    });
                });
                await Promise.all(notificationPromises);
                console.log(`Notificados ${notificationPromises.length} seguidores.`);
            }
        }

        return newBlog;
    } catch (error) {
        console.error("Error creating blog:", error);
        throw error;
    }
};

const updateBlog = async (id: number, blogData: any) => {
    try {
        const dbRef = ref(db, `${COLLECTION_NAME}/${id}`);
        const snapshot = await get(dbRef);

        if (!snapshot.exists()) {
            return null;
        }

        const existingBlog = snapshot.val();
        const updatedBlog = { ...existingBlog, ...blogData, id }; // Ensure ID doesn't change

        await set(dbRef, updatedBlog);
        return updatedBlog;
    } catch (error) {
        console.error("Error updating blog:", error);
        throw error;
    }
};

module.exports = {
    getBlogs,
    getBlogById,
    createBlog,
    updateBlog
};

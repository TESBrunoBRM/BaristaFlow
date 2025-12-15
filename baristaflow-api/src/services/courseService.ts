const { db } = require('../firebase');
const { ref, get, set, child, push, remove } = require('firebase/database');

const COLLECTION_NAME = 'courses';

const getCourses = async () => {
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
        console.error("Error getting courses:", error);
        return [];
    }
};

const getCourseById = async (id: string | number) => {
    try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `${COLLECTION_NAME}/${id}`));
        if (snapshot.exists()) {
            return snapshot.val();
        }
        return null;
    } catch (error) {
        console.error("Error getting course:", error);
        return null;
    }
};

const createCourse = async (course: any) => {
    try {
        const dbRef = ref(db, COLLECTION_NAME);

        // Generar ID único (usando timestamp como en courses.ts original o push key)
        // El original usaba Date.now().toString()
        const newId = course.id || Date.now().toString();

        // Recursive helper to remove undefined keys
        const cleanUndefined = (obj: any): any => {
            if (Array.isArray(obj)) {
                return obj.map(v => cleanUndefined(v));
            } else if (obj !== null && typeof obj === 'object') {
                const newObj: any = {};
                Object.keys(obj).forEach(key => {
                    if (obj[key] !== undefined) {
                        newObj[key] = cleanUndefined(obj[key]);
                    }
                });
                return newObj;
            }
            return obj;
        };

        const newCourse = cleanUndefined({ ...course, id: newId });

        // Guardar en /courses/{id}
        await set(child(dbRef, newId.toString()), newCourse);

        return newCourse;
    } catch (error) {
        console.error("Error creating course:", error);
        throw error;
    }
};

const updateCourse = async (id: string | number, courseData: any) => {
    try {
        const dbRef = ref(db, `${COLLECTION_NAME}/${id}`);
        const snapshot = await get(dbRef);

        if (!snapshot.exists()) {
            return null;
        }

        const existingCourse = snapshot.val();
        const updatedCourse = {
            ...existingCourse,
            ...courseData,
            id // Ensure ID doesn't change
        };

        // Remove undefined values
        Object.keys(updatedCourse).forEach(key => updatedCourse[key] === undefined && delete updatedCourse[key]);

        await set(dbRef, updatedCourse);
        return updatedCourse;
    } catch (error) {
        console.error("Error updating course:", error);
        throw error;
    }
};

// SOFT DELETE: Mark as archived instead of removing
const deleteCourse = async (id: string | number) => {
    try {
        const dbRef = ref(db, `${COLLECTION_NAME}/${id}`);
        // Check if exists first
        const snapshot = await get(dbRef);
        if (!snapshot.exists()) return false;

        // Update isArchived flag
        await set(child(dbRef, 'isArchived'), true);
        return true;
    } catch (error) {
        console.error("Error archiving course:", error);
        throw error;
    }
};

const getEnrolledCourses = async (courseIds: (string | number)[]) => {
    if (!courseIds || courseIds.length === 0) return [];

    try {
        // Option A: Fetch all and filter (Inefficient but simple for small datasets)
        // Option B: Parallel fetches by ID (Better for Firebase Realtime DB)

        const promises = courseIds.map(id => getCourseById(id));
        const results = await Promise.all(promises);

        // Filter out nulls (failed fetches)
        return results.filter(course => course !== null);
    } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        return [];
    }
};

module.exports = {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    getEnrolledCourses
};

import {
    createContext,
    useState,
    useContext,
    useEffect
} from 'react';
import type { ReactNode } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import type { DataSnapshot } from 'firebase/database';
import { ref, set, onValue } from 'firebase/database';
import { auth, database } from '../firebase';

interface AuthContextType {
    user: User | null;
    userToken: string | null;
    loading: boolean;
    userRole: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, username: string) => Promise<void>;
    logout: () => Promise<void>;
    loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const googleProvider = new GoogleAuthProvider();

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userToken, setUserToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const token = await firebaseUser.getIdToken();
                setUser(firebaseUser);
                setUserToken(token);

                // Cargar el Rol desde la Realtime Database
                const userRef = ref(database, 'users/' + firebaseUser.uid);

                onValue(userRef, (snapshot) => {
                    const data = snapshot.val();
                    const role = data?.role || 'normal';
                    setUserRole(role);
                    setLoading(false); // 🚨 CORRECCIÓN: Terminamos de cargar AQUÍ, cuando ya tenemos el rol
                }, (error) => {
                    console.error("Error al leer el rol de la DB:", error);
                    setUserRole('normal');
                    setLoading(false); // O aquí si falla
                });

            } else {
                setUser(null);
                setUserToken(null);
                setUserRole(null);
                setLoading(false); // Si no hay usuario, terminamos de cargar inmediatamente
            }
        });
        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const register = async (email: string, password: string, username: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCredential.user;

        if (newUser) {
            const userRef = ref(database, 'users/' + newUser.uid);
            await set(userRef, {
                uid: newUser.uid,
                email: newUser.email,
                username: username,
                role: 'normal',
                followers: 0,
                following: 0,
                coursesEnrolled: 0,
            });
        }
    };

    const loginWithGoogle = async () => {
        const result = await signInWithPopup(auth, googleProvider);
        const newUser = result.user;

        const userRef = ref(database, 'users/' + newUser.uid);
        const snapshot = await new Promise<DataSnapshot>(resolve => onValue(userRef, resolve, { onlyOnce: true }));

        if (!snapshot.exists()) {
            await set(userRef, {
                uid: newUser.uid,
                email: newUser.email,
                username: newUser.displayName || newUser.email?.split('@')[0],
                role: 'normal',
                followers: 0,
                following: 0,
                coursesEnrolled: 0,
            });
        }
    };

    const logout = async () => {
        await signOut(auth);
    };

    const value: AuthContextType = {
        user,
        userToken,
        loading,
        userRole,
        login,
        register,
        logout,
        loginWithGoogle,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 🚨 NOTA SOBRE EL ERROR DE VITE:
// Aunque este archivo exporta un hook (useAuth) y un componente (AuthProvider),
// es una práctica estándar en React Context. Si el error persiste,
// simplemente recarga la página del navegador (F5).
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};
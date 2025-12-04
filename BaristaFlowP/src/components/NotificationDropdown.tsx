import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaInfoCircle, FaHeart, FaUserPlus, FaBox } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { database } from '../firebase';
import { ref, onValue, update, remove } from 'firebase/database';


interface Notification {
    id: string;
    type: 'new_follower' | 'order_update' | 'new_post' | 'system';
    message: string;
    read: boolean;
    timestamp: number;
    link?: string;
}

const NotificationDropdown: React.FC = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!user) return;

        const notificationsRef = ref(database, `notifications/${user.uid}`);
        const unsubscribe = onValue(notificationsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const loadedNotifications = Object.entries(data).map(([key, value]: [string, any]) => ({
                    id: key,
                    ...value
                }));
                // Sort by newest first
                loadedNotifications.sort((a, b) => b.timestamp - a.timestamp);
                setNotifications(loadedNotifications);
            } else {
                setNotifications([]);
            }
        });

        return () => unsubscribe();
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = async (notificationId: string) => {
        if (!user) return;
        const notificationRef = ref(database, `notifications/${user.uid}/${notificationId}`);
        await update(notificationRef, { read: true });
    };

    const markAllAsRead = async () => {
        if (!user) return;
        const updates: any = {};
        notifications.forEach(n => {
            if (!n.read) {
                updates[`notifications/${user.uid}/${n.id}/read`] = true;
            }
        });
        await update(ref(database), updates);
    };

    const clearAll = async () => {
        if (!user) return;
        if (window.confirm('¿Estás seguro de borrar todas las notificaciones?')) {
            await remove(ref(database, `notifications/${user.uid}`));
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'new_follower': return <FaUserPlus className="text-blue-500" />;
            case 'order_update': return <FaBox className="text-amber-600" />;
            case 'new_post': return <FaHeart className="text-red-500" />;
            default: return <FaInfoCircle className="text-gray-500" />;
        }
    };

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 hover:bg-white/10 rounded-full transition-colors duration-300 group"
            >
                <FaBell className={`text-xl transition-colors ${isOpen ? 'text-amber-400' : 'text-white group-hover:text-amber-400'}`} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in-up origin-top-right text-gray-800">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-gray-700">Notificaciones</h3>
                        <div className="flex gap-2 text-xs">
                            {unreadCount > 0 && (
                                <button onClick={markAllAsRead} className="text-amber-600 hover:underline">
                                    Marcar leídas
                                </button>
                            )}
                            {notifications.length > 0 && (
                                <button onClick={clearAll} className="text-gray-400 hover:text-red-500">
                                    Borrar todo
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                <FaBell className="mx-auto text-3xl mb-2 opacity-20" />
                                <p className="text-sm">No tienes notificaciones nuevas</p>
                            </div>
                        ) : (
                            <ul>
                                {notifications.map((notification) => (
                                    <li
                                        key={notification.id}
                                        className={`border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-amber-50/50' : ''}`}
                                    >
                                        <div
                                            onClick={() => markAsRead(notification.id)}
                                            className="block p-4 cursor-pointer"
                                        >
                                            <div className="flex gap-3">
                                                <div className="mt-1 shrink-0">
                                                    {getIcon(notification.type)}
                                                </div>
                                                <div className="grow">
                                                    <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                                                        {notification.message}
                                                    </p>
                                                    <span className="text-xs text-gray-400 mt-1 block">
                                                        {new Date(notification.timestamp).toLocaleString()}
                                                    </span>
                                                </div>
                                                {!notification.read && (
                                                    <div className="shrink-0 self-center">
                                                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;

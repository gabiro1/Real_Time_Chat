import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import io from 'socket.io-client';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUser, setOnlineUser] = useState([]);
    const [socket, setSocket] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(false); // prevent double checks
    const [hasHandledSession, setHasHandledSession] = useState(false); // only handle session expiration once

    useEffect(() => {
        if (token && !checkingAuth) {
            axios.defaults.headers.common['token'] = token;
            checkAuth();
        }
    }, [token]);

    const checkAuth = async () => {
        setCheckingAuth(true);
        try {
            const { data } = await axios.get('/api/auth/check');
            if (data.success) {
                setAuthUser(data.user);
                connectSocket(data.user);
                setHasHandledSession(false); // reset on success
            }
        } catch (error) {
            const status = error?.response?.status;

            if (status === 401 && !hasHandledSession) {
                // Don't call logout here!
                setAuthUser(null);
                setOnlineUser([]);
                setToken(null);
                localStorage.removeItem("token");
                axios.defaults.headers.common["token"] = null;
                if (socket) socket.disconnect();
                setSocket(null);
                toast.error('Session expired. Please log in again.');
                setHasHandledSession(true);
            } else if (!hasHandledSession) {
                toast.error(error.message || 'Something went wrong');
            }
        } finally {
            setCheckingAuth(false);
        }
    };

    const login = async (state, credential) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credential);
            if (data.success) {
                setAuthUser(data.user);
                connectSocket(data.user);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token", data.token);
                toast.success(data.message);
                setHasHandledSession(false); // reset
            } else {
                toast.error(data.message || "Login failed");
            }
        } catch (error) {
            toast.error(error.message || "Login request failed");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUser([]);
        axios.defaults.headers.common["token"] = null;
        if (socket) socket.disconnect();
        setSocket(null);
        setHasHandledSession(true); // prevent session repeat
        toast.success("Logged out successfully");
    };

    const UpdateProfile = async (body) => {
        try {
            const { data } = await axios.put("/api/auth/update", body);
            if (data.success) {
                setAuthUser(data.user);
                toast.success("Profile updated successfully");
            }
        } catch (error) {
            toast.error(error.message || "Profile update failed");
        }
    };

    const connectSocket = (userData) => {
        if (!userData || socket?.connected) return;

        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id,
            },
        });

        newSocket.connect();
        setSocket(newSocket);

        newSocket.on('getOnlineUsers', (userIds) => {
            setOnlineUser(userIds);
            console.log('Socket connected:', newSocket.id);
        });
    };

    const value = {
        axios,
        authUser,
        onlineUser,
        socket,
        token,
        login,
        logout,
        UpdateProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

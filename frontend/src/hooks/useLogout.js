// useLogout.js
import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const useLogout = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext(); // Import setAuthUser from useAuthContext

    const logout = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            if(data.error) {
                throw new Error(data.error);
            }
            localStorage.removeItem("chat-user");
            setAuthUser(null); // Call setAuthUser to update authUser state
            toast.success('Logout successful!');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Return loading and logout function from the hook
    return { loading, logout };
}

export default useLogout;

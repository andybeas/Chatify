import { useAuthContext } from '@/context/AuthContext';
import { useState } from 'react';
import toast from 'react-hot-toast';

const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const {authUser, setAuthUser} = useAuthContext();

  const signup = async ({ fullName, username, password, confirmPassword, gender }) => {
    const success = handleInputErrors({ fullName, username, password, confirmPassword, gender });
    if (!success) return;

    setLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, username, password, confirmPassword, gender }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      localStorage.setItem("chat-user", JSON.stringify(data)); //localstorage
      setAuthUser(data); 

      toast.success('Signup successful!');
      // Optionally handle the response data if needed
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  function handleInputErrors({ fullName, username, password, confirmPassword, gender }) {
    if (!fullName || !username || !password || !confirmPassword || !gender) {
      toast.error("Please fill up all the fields!");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    return true;
  }

  return { loading, signup };
};

export default useSignUp;

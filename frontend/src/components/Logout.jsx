import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('x-auth-token');
    navigate('/login');
  }, [navigate]); // Add navigate to the dependency array
};

export default Logout;

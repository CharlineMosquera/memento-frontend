import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/logout.css";

const Logout = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/logout', {
          method: 'POST',
          credentials: 'include'
        });
        if (response.ok) {
          localStorage.removeItem('userId'); // Eliminar userId del localStorage
          setMessage('Cierre de sesión exitoso. Redirigiendo a la página principal...');
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          console.error('Error al cerrar sesión', response.statusText);
          setMessage(`Error al cerrar sesión: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error al cerrar sesión', error);
        setMessage(`Error al cerrar sesión: ${error.message}`);
      }
    };

    logoutUser();
  }, [navigate]);

  return (
  <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="logout-message">
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default Logout;
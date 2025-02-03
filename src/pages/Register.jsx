import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/login.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.status === 201) {
        setMessage('Registro exitoso. Redirigiendo a la página de inicio de sesión...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage(`Error al registrar el usuario: ${data.message || response.statusText}`);
      }
    } catch (error) {
      setMessage(`Error al registrar el usuario: ${error.message}`);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="login-card">
        <h2 className="text-light text-center mb-4">Registro</h2>
        {message && (
          <div
            className={`mb-3 p-2 rounded text-center ${
              message.includes('exitoso') ? 'success-message' : 'error-message'
            }`}
          >
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label text-light">Nombre</label>
            <input
              type="text"
              className="form-control custom-input"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label text-light">Correo Electrónico</label>
            <input
              type="email"
              className="form-control custom-input"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label text-light">Contraseña</label>
            <input
              type="password"
              className="form-control custom-input"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="role" className="form-label text-light">Rol</label>
            <select
              className="form-control custom-input"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <button type="submit" className="btn btn-custom-gold w-100">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
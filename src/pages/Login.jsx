import { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Incluir cookies
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('✅ ¡Inicio de sesión exitoso!');
        localStorage.setItem('userId', data.userId); // Guardar userId en localStorage
        setTimeout(() => navigate('/my-events'), 1500); // Redirección en 1.5s
      } else {
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      setError(error, 'Error al conectar con el servidor. Inténtalo de nuevo.');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <div className="login-card p-4">
        <h2 className="text-center mb-4 text-light">Iniciar Sesión</h2>
        {error && (
          <Alert variant="danger" className="rounded-pill text-center">
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert variant="success" className="rounded-pill text-center">
            {successMessage}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail" className="mb-3">
            <Form.Label className="text-light">Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`custom-input ${error ? 'is-invalid' : ''}`}
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword" className="mb-3">
            <Form.Label className="text-light">Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`custom-input ${error ? 'is-invalid' : ''}`}
            />
          </Form.Group>
          <Button variant="custom-gold" type="submit" className="mt-4 w-100">
            Iniciar Sesión
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default Login;

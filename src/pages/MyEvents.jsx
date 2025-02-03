import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import "../styles/myEvents.css";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(''); // Manejar errores
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const userId = localStorage.getItem('userId'); // Obtener ID del usuario desde localStorage
        if (!userId) {
          setError('Debes iniciar sesión para ver tus eventos.');
          setTimeout(() => {
            navigate('/login');
          }, 2000); // Redirigir después de 2 segundos
          return;
        }

        const response = await fetch(`http://localhost:5000/api/events/filter?attendeeId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          setError('Error al obtener los eventos. Inténtalo de nuevo.');
        }
      } catch (error) {
        setError(error, 'Error al conectar con el servidor. Inténtalo de nuevo.');
      }
    };

    fetchEvents();
  }, [navigate]);

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4" style={{ color: '#CDAA7D' }}>Mis Eventos</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {events.length === 0 && !error && (
        <Alert variant="info">No has confirmado tu asistencia a ningún evento.</Alert>
      )}
      <Row className="g-4"> {/* Espaciado entre tarjetas */}
        {events.map(event => (
          <Col key={event._id} xs={12} md={6} lg={4}>
            <Card className="shadow-lg border-0 rounded event-card h-100">
              <div className="event-image-container">
                {event.imageUrl && (
                  <Card.Img
                    variant="top"
                    src={event.imageUrl}
                    alt={event.name}
                    className="event-image"
                  />
                )}
              </div>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="event-title">{event.name}</Card.Title>
                <Card.Text className="flex-grow-1">{event.description}</Card.Text>
                <Card.Text className="event-date">
                  📅 {new Date(event.date).toLocaleDateString()} 🕒 {new Date(event.date).toLocaleTimeString()}
                </Card.Text>
                <div className="text-center mt-auto">
                  <span className="badge bg-success">Asistencia Confirmada</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default MyEvents;
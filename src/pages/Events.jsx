import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import "../styles/events.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Nuevo estado para mensajes de éxito

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/events');
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          setError('Error al obtener los eventos');
        }
      } catch (error) {
        setError(error, 'Error al obtener los eventos');
      }
    };
    fetchEvents();
  }, []);

  const handleConfirmAttendance = async (eventId) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('Debes iniciar sesión para confirmar asistencia');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventId}/attend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      const data = await response.json();
      if (response.ok) {
        setEvents(events.map(event => 
          event._id === eventId ? { ...event, attendees: [...event.attendees, userId] } : event
        ));
        setSuccessMessage('✅ ¡Asistencia confirmada con éxito!'); // Mostrar mensaje de éxito
        setTimeout(() => setSuccessMessage(''), 3000); // Limpiar el mensaje después de 3 segundos
      } else {
        setError(data.message || 'Error al confirmar asistencia');
      }
    } catch (error) {
      setError(error, 'Error al conectar con el servidor. Inténtalo de nuevo.');
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4" style={{ color: '#CDAA7D' }}>Eventos</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>} {/* Mensaje de éxito */}
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
                <Button 
                  variant="outline-light" 
                  className="w-100 confirm-button mt-auto" 
                  onClick={() => handleConfirmAttendance(event._id)}
                >
                  Confirmar Asistencia
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Events;
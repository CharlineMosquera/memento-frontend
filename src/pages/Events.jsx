import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Modal,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/events.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Nuevo estado para mensajes de éxito
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Estado para controlar el modal
  const [eventToDelete, setEventToDelete] = useState(null); // ID del evento a eliminar

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/events");
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          setError("Error al obtener los eventos");
        }
      } catch (error) {
        setError(error, "Error al obtener los eventos");
      }
    };
    fetchEvents();
  }, []);

  const handleConfirmAttendance = async (eventId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("Debes iniciar sesión para confirmar asistencia");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/events/${eventId}/attend`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setEvents(
          events.map((event) =>
            event._id === eventId
              ? { ...event, attendees: [...event.attendees, userId] }
              : event
          )
        );
        setSuccessMessage("✅ ¡Asistencia confirmada con éxito!"); // Mostrar mensaje de éxito
        setTimeout(() => setSuccessMessage(""), 3000); // Limpiar el mensaje después de 3 segundos
      } else {
        setError(data.message || "Error al confirmar asistencia");
      }
    } catch (error) {
      setError(error, "Error al conectar con el servidor. Inténtalo de nuevo.");
    }
  };

  const handleDeleteEvent = async () => {
    try {
      if (!eventToDelete) return;

      const response = await fetch(
        `http://localhost:5000/api/events/${eventToDelete}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        setEvents(events.filter((event) => event._id !== eventToDelete));
        setSuccessMessage("✅ ¡Evento eliminado con éxito!");
        setTimeout(() => setSuccessMessage(""), 3000); // Limpiar el mensaje después de 3 segundos
      } else {
        const data = await response.json();
        setError(data.message || "Error al eliminar el evento");
      }
    } catch (error) {
      setError(error, "Error al conectar con el servidor. Inténtalo de nuevo.");
    } finally {
      setShowDeleteModal(false); // Cerrar el modal después de la acción
    }
  };

  return (
    <Container className="mt-5">
  <h1 className="text-center mb-4" style={{ color: "#CDAA7D" }}>Eventos</h1>
  {error && <Alert variant="danger">{error}</Alert>}
  {successMessage && <Alert variant="success">{successMessage}</Alert>}
  {/* Botón para crear un nuevo evento */}
  <div className="d-flex justify-content-end mb-4">
    <Link to="/create-event">
      <Button variant="custom-gold">Crear Nuevo Evento</Button>
    </Link>
  </div>
  <Row className="g-4">
    {events.map((event) => (
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
              📅 {new Date(event.date).toLocaleDateString()} 🕒{" "}
              {new Date(event.date).toLocaleTimeString()}
            </Card.Text>

            {/* Botones de acción */}
            <div className="d-flex justify-content-between align-items-center mt-auto">
              {/* Confirmar asistencia */}
              <Button
                variant="outline-light"
                className="confirm-button flex-grow-1 me-2"
                onClick={() => handleConfirmAttendance(event._id)}
              >
                Confirmar Asistencia
              </Button>

              {/* Icono de edición con tooltip */}
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id={`edit-tooltip-${event._id}`}>Editar Evento</Tooltip>
                }
              >
                <Link to={`/edit-event/${event._id}`} style={{ textDecoration: "none" }}>
                  <Button variant="light" className="p-2 edit-icon">
                    <i className="bi bi-pencil-fill" style={{ fontSize: "1.2rem", color: "#FFC107" }}></i>
                  </Button>
                </Link>
              </OverlayTrigger>

              {/* Eliminar evento */}
              <Button
                variant="danger"
                className="p-2 delete-icon"
                onClick={() => {
                  setEventToDelete(event._id);
                  setShowDeleteModal(true);
                }}
              >
                <i className="bi bi-trash-fill" style={{ fontSize: "1.2rem" }}></i>
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    ))}
  </Row>

  {/* Modal de confirmación */}
  <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
    <Modal.Header closeButton>
      <Modal.Title>Confirmar eliminación</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      ¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
        Cancelar
      </Button>
      <Button variant="danger" onClick={handleDeleteEvent}>
        Eliminar
      </Button>
    </Modal.Footer>
  </Modal>
</Container>
  );
};

export default Events;

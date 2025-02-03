import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "../styles/editEvent.css";

const EditEvent = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    location: '',
    imageUrl: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/events/${id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            name: data.name,
            description: data.description,
            date: data.date.split('T')[0], // Formato de fecha para input
            time: data.date.split('T')[1].split('.')[0], // Formato de hora para input
            location: data.location,
            imageUrl: data.imageUrl
          });
        } else {
          setError('Error al cargar el evento');
        }
      } catch (error) {
        setError(error, 'Error al conectar con el servidor');
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      const response = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('✅ ¡Evento actualizado con éxito!');
        setTimeout(() => navigate('/'), 2000); // Redirigir a la lista de eventos
      } else {
        setError(data.message || 'Error al actualizar el evento');
      }
    } catch (error) {
      setError(error, 'Error al conectar con el servidor. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="login-card p-4">
        <h2 className="text-center mb-4 text-light">Editar Evento</h2>
        {error && <p className="text-danger">{error}</p>}
        {successMessage && <p className="text-success">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          {/* Campo de nombre */}
          <div className="mb-3">
            <label htmlFor="name" className="form-label text-light">Nombre del Evento</label>
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

          {/* Campo de descripción */}
          <div className="mb-3">
            <label htmlFor="description" className="form-label text-light">Descripción</label>
            <textarea
              className="form-control custom-input"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Campo de fecha */}
          <div className="mb-3">
            <label htmlFor="date" className="form-label text-light">Fecha</label>
            <input
              type="date"
              className="form-control custom-input"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          {/* Campo de hora */}
          <div className="mb-3">
            <label htmlFor="time" className="form-label text-light">Hora</label>
            <input
              type="time"
              className="form-control custom-input"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>

          {/* Campo de ubicación */}
          <div className="mb-3">
            <label htmlFor="location" className="form-label text-light">Ubicación</label>
            <input
              type="text"
              className="form-control custom-input"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          {/* Campo de URL de la imagen */}
          <div className="mb-3">
            <label htmlFor="imageUrl" className="form-label text-light">URL de la Imagen</label>
            <input
              type="url"
              className="form-control custom-input"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </div>

          {/* Botón de envío */}
          <button type="submit" className="btn btn-custom-gold w-100">
            Actualizar Evento
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
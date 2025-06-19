import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function BookPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', seats: 1 });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/events/${id}`)
      .then(res => setEvent(res.data))
      .catch(() => {
        setToastMessage('Failed to load event');
        setToastType('error');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      });
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/book', {
        ...form,
        seats: parseInt(form.seats),
        eventId: id,
      });
      setToastMessage('Booking successfull');
      setToastType('success');
      setShowToast(true);
     setTimeout(() => {
  setShowToast(false); 
  navigate('/');  
}, 2000);
    } 
    catch (err) {
      setToastMessage('Booking failed ');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const totalPrice = event ? event.price * form.seats : 0;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className={`absolute top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transition-all duration-300 ${
          toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {toastMessage}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
        {/* Left - Event Info */}
        {event && (
          <div className="md:w-1/2 p-6 border-b md:border-b-0 md:border-r">
            <img src={event.imageUrl || 'https://via.placeholder.com/400x200'} alt={event.title} className="rounded-xl mb-4 w-full h-48 object-cover" />
            <h2 className="text-xl font-bold mb-2">{event.title}</h2>
            <p className="text-sm text-gray-600 mb-2">📅 {event.date} at {event.time}</p>
            <p className="text-sm text-gray-600 mb-2">📍 {event.venue}</p>
            <p className="text-sm text-gray-600 mb-2">👥 {event.availableSeats} seats available</p>
            <p className="text-sm font-medium text-purple-700">💵 ${event.price} per ticket</p>
          </div>
        )}

        {/* Right - Booking Form */}
        <div className="md:w-1/2 p-6">
          <h3 className="text-lg font-semibold mb-4">Book Your Tickets</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              required
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full border p-2 rounded"
            />
            <input
              required
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full border p-2 rounded"
            />
            <select
              value={form.seats}
              onChange={e => setForm({ ...form, seats: parseInt(e.target.value) })}
              className="w-full border p-2 rounded"
            >
              {[1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{n} seat{n > 1 ? 's' : ''}</option>
              ))}
            </select>

            <div className="flex justify-between items-center mt-2 text-lg font-medium">
              <span>Total Amount:</span>
              <span className="text-blue-600">${totalPrice}</span>
            </div>

            <div className="flex gap-4 mt-6">
              <button type="button" className="flex-1 py-2 border rounded text-white bg-blue-800 hover:bg-blue-700 active:bg-blue-900 transition-colors duration-200"
                onClick={() => navigate('/')}
              >
                Cancel
              </button>

              <button type="submit" className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded hover:from-purple-600 hover:to-blue-600">
                Confirm Booking
              </button >
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
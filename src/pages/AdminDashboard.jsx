import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [tab, setTab] = useState('add');
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);

  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    totalSeats: '',
    imageUrl: '',
    price:''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.venue.trim()) newErrors.venue = 'Venue is required';
    if (!formData.totalSeats || formData.totalSeats < 1) newErrors.totalSeats = 'Must be at least 1 seat';
    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) newErrors.imageUrl = 'Must be a valid URL';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // API Functions using axios
  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/events');
      setEvents(res.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      alert("Could not load events");
    }
  };

const fetchBookings = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/admin/bookings', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBookings(res.data);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    alert("Could not load bookings");
  }
};

const handleInputChange = (field, value) => {
  setFormData(prev => ({ ...prev, [field]: value }));
  if (errors[field]) {
    setErrors(prev => ({ ...prev, [field]: '' }));
  }
};

const onSubmit = async () => {
  if (!validateForm()) return;

  setIsSubmitting(true);

  try {
    const eventData = {
      ...formData,
      date: formData.date,
      time: formData.time,
      availableSeats: parseInt(formData.totalSeats),
      totalSeats: parseInt(formData.totalSeats),
      price:parseInt(formData.price)
    };

    await axios.post('http://localhost:5000/api/admin/events', eventData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert(' Event added');
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      venue: '',
      totalSeats: '',
      imageUrl: '',
    });

    fetchEvents();
  } catch (error) {
    console.error('Error adding event:', error);
    alert(' Failed to add event');
  } finally {
    setIsSubmitting(false);
  }
};

const handleDelete = async (id) => {
  if (!window.confirm('Are you sure you want to delete this event?')) return;

  try {
    await axios.delete(`http://localhost:5000/api/admin/events/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert('🗑 Event deleted');
    fetchEvents();
  } catch (error) {
    console.error('Error deleting event:', error);
    alert(' Failed to delete event');
  }
};


  // useEffect to fetch data when tab changes
  useEffect(() => {
    if (tab === 'view') fetchEvents();
    if (tab === 'bookings') fetchBookings();
  }, [tab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🎛 Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your events and bookings</p>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <div className="bg-green-100 px-3 py-1 rounded-full">
                <span className="text-green-800 text-sm font-medium">{events.length} Events</span>
              </div>
              <div className="bg-blue-100 px-3 py-1 rounded-full">
                <span className="text-blue-800 text-sm font-medium">{bookings.length} Bookings</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setTab('add')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-sm ${
              tab === 'add'
                ? 'bg-green-500 text-white shadow-md transform scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md'
            }`}
          >
            <span>➕ Add Event</span>
          </button>
          <button
            onClick={() => setTab('view')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-sm ${
              tab === 'view'
                ? 'bg-blue-500 text-white shadow-md transform scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md'
            }`}
          >
            <span>📋 View Events</span>
          </button>
          <button
            onClick={() => setTab('bookings')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-sm ${
              tab === 'bookings'
                ? 'bg-purple-500 text-white shadow-md transform scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md'
            }`}
          >
            <span>📦 Bookings</span>
          </button>
        </div>

        {/* Add Event Form */}
        {tab === 'add' && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">
                ➕ Create New Event
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Title */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📝 Event Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter event title"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                      errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                {/* Description */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📄 Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your event"
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none ${
                      errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📅 Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                      errors.date ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                </div>
                       {/* Price */}
                  <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="Enter the price"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                      errors.price ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🕐 Time *
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                      errors.time ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                </div>

                {/* Venue */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📍 Venue *
                  </label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => handleInputChange('venue', e.target.value)}
                    placeholder="Enter venue name"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                      errors.venue ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.venue && <p className="text-red-500 text-sm mt-1">{errors.venue}</p>}
                </div>

                {/* Total Seats */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    👥 Total Seats *
                  </label>
                  <input
                    type="number"
                    value={formData.totalSeats}
                    onChange={(e) => handleInputChange('totalSeats', e.target.value)}
                    placeholder="Number of seats"
                    min="1"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                      errors.totalSeats ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.totalSeats && <p className="text-red-500 text-sm mt-1">{errors.totalSeats}</p>}
                </div>

                {/* Image URL */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🖼 Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                      errors.imageUrl ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>}
                </div>

                {/* Image Preview */}
                {formData.imageUrl && isValidUrl(formData.imageUrl) && (
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">👁 Preview</label>
                    <div className="relative rounded-xl overflow-hidden border-2 border-dashed border-gray-300">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  onClick={onSubmit}
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Creating Event...</span>
                    </>
                  ) : (
                    <>
                      <span> Add Event</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Events */}
        {tab === 'view' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">📋 All Events</h2>
              <div className="text-sm text-gray-600">
                {events.length} {events.length === 1 ? 'event' : 'events'} total
              </div>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map(event => (
                <div key={event._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                  {event.imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                          {event.availableSeats} seats left
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600 text-sm">
                        <span className="mr-2 text-blue-500">📅</span>
                        {event.date} at {event.time}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <span className="mr-2 text-red-500">📍</span>
                        {event.venue}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <span className="mr-2 text-green-500">👥</span>
                        {event.availableSeats}/{event.totalSeats} seats
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-1"
                      >
                        <span>🗑 Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {events.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👁</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
                <p className="text-gray-600">Create your first event to get started!</p>
              </div>
            )}
          </div>
        )}

        {/* Bookings */}
        {tab === 'bookings' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">📦 Event Bookings</h2>
              <div className="text-sm text-gray-600">
                {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'} total
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        👤 Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        🎪 Event
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        🎫 Seats
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ✅ Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                            <div className="text-sm text-gray-500">{booking.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.eventId?.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {booking.seats} {booking.seats === 1 ? 'seat' : 'seats'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Confirmed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {bookings.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                  <p className="text-gray-600">Bookings will appear here once customers start booking events.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}   
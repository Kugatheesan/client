import { useEffect, useState } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/events')
      .then(res => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch events');
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <>
    
      <div className="px-6 py-8 bg-gradient-to-b from-white to-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Discover Amazing Events</h1>

        {loading ? (
          <p className="text-lg text-gray-600">Loading events...</p>
        ) : error ? (
          <p className="text-red-500 text-lg">{error}</p>
        ) : events.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {events.map(event => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-lg text-gray-600">No events available at the moment.</p>
        )}
      </div>
    </>
  );
}

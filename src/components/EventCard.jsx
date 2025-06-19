import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, Users } from 'lucide-react';

export default function EventCard({ event }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
      {/* Event Image */}
       <img
        src={event.imageUrl || 'https://via.placeholder.com/400x200'} 
        alt={event.title}
        className="h-48 w-full object-cover"
      /> 

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800">{event.title}</h2>
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {event.description}
          </p>

          <div className="mt-4 space-y-1 text-sm text-gray-700">
            <p className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              {event.date} at {event.time}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {event.venue}
            </p>
            <p className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {event.availableSeats} seats available
            </p>
            {/* <p className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              ${event.price}
            </p> */}
          </div>
        </div>

        {/* Button */}
        <Link
          to={`/book/${event._id}`}
          className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center font-medium py-2 rounded-xl hover:from-purple-600 hover:to-blue-600 transition"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}

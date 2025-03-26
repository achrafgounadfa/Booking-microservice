import React from 'react';
import { FaStar, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

interface EventCardProps {
  id: string;
  title: string;
  image: string;
  date: string;
  location: string;
  category: string;
  price: number;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  image,
  date,
  location,
  category,
  price,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative">
        {/* Image de l'événement */}
        <img 
          src={image} 
          alt={title} 
          className="w-full h-48 object-cover"
        />
        
        {/* Badge catégorie */}
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
          {category}
        </div>
      </div>
      
      <div className="p-4">
        {/* Titre */}
        <h3 className="text-lg font-bold mb-2 line-clamp-2">{title}</h3>
        
        {/* Informations */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <FaCalendarAlt className="mr-2 text-red-600" />
            <span className="text-sm">{date}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaMapMarkerAlt className="mr-2 text-red-600" />
            <span className="text-sm line-clamp-1">{location}</span>
          </div>
        </div>
        
        {/* Prix et bouton */}
        <div className="flex justify-between items-center">
          <div className="text-lg font-bold text-red-600">
            {price > 0 ? `${price} €` : 'Gratuit'}
          </div>
          <a 
            href={`/events/${id}`}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Réserver
          </a>
        </div>
      </div>
    </div>
  );
};

export default EventCard;

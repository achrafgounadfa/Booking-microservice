import React from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaInfoCircle } from 'react-icons/fa';
import Button from '../../components/ui/Button';

export default function EventDetailPage({ params }: { params: { id: string } }) {
  // Ces données seraient normalement chargées depuis l'API en fonction de l'ID
  const event = {
    id: params.id,
    title: 'Coldplay - Music Of The Spheres World Tour',
    image: 'https://media.ticketmaster.com/tm/en-us/dam/a/1f6/0e4fe8ee-488a-46ba-9d2e-e42e47981f6.jpg',
    date: '15 juin 2025',
    time: '20:00',
    location: 'Stade de France, Saint-Denis',
    address: '93200 Saint-Denis',
    category: 'Concert',
    price: 75.50,
    description: `Coldplay revient en France pour leur tournée mondiale "Music Of The Spheres" ! 
    
    Après le succès phénoménal de leur précédente tournée, le groupe britannique présentera son nouvel album ainsi que ses plus grands tubes. Un spectacle visuel et sonore à ne pas manquer, avec des effets spéciaux impressionnants et une scénographie innovante.
    
    Coldplay s'engage également pour l'environnement : pour chaque billet vendu, un arbre sera planté. La tournée utilisera également de l'énergie renouvelable et réduira ses émissions de CO2 de 50% par rapport à leur précédente tournée.`,
    availableTickets: 1500,
    maxTicketsPerPerson: 8,
    artist: {
      name: 'Coldplay',
      image: 'https://www.rollingstone.com/wp-content/uploads/2021/10/Coldplay-Higher-Power.jpg',
      description: 'Coldplay est un groupe de rock britannique formé à Londres en 1996. Le groupe est composé de Chris Martin, Jonny Buckland, Guy Berryman et Will Champion.'
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Fil d'Ariane */}
      <div className="text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-red-600">Accueil</a> &gt; 
        <a href="/events" className="hover:text-red-600 mx-1">Événements</a> &gt; 
        <a href="/events/concerts" className="hover:text-red-600 mx-1">Concerts</a> &gt; 
        <span className="text-gray-700">{event.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne principale */}
        <div className="lg:col-span-2">
          {/* Image principale */}
          <div className="mb-6">
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>

          {/* Titre et informations */}
          <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
          
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center text-gray-700">
              <FaCalendarAlt className="mr-2 text-red-600" />
              <span>{event.date} à {event.time}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <FaMapMarkerAlt className="mr-2 text-red-600" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <FaTicketAlt className="mr-2 text-red-600" />
              <span>À partir de {event.price} €</span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Description</h2>
            <div className="prose max-w-none">
              {event.description.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Artiste */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">À propos de l'artiste</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <img 
                src={event.artist.image} 
                alt={event.artist.name} 
                className="w-full md:w-48 h-48 object-cover rounded-lg"
              />
              <div>
                <h3 className="text-lg font-semibold mb-2">{event.artist.name}</h3>
                <p className="text-gray-700">{event.artist.description}</p>
              </div>
            </div>
          </div>

          {/* Lieu */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Lieu de l'événement</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 h-48 bg-gray-200 rounded-lg">
                {/* Ici on mettrait une carte Google Maps */}
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Carte
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">{event.location}</h3>
                <p className="text-gray-700 mb-2">{event.address}</p>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:underline"
                >
                  Voir sur Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne latérale */}
        <div>
          {/* Bloc réservation */}
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Réserver</h2>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-2">Prix à partir de</p>
              <p className="text-3xl font-bold text-red-600">{event.price} €</p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="ticketCount" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de billets
              </label>
              <select 
                id="ticketCount" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {[...Array(event.maxTicketsPerPerson)].map((_, i) => (
                  <option key={i} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                {event.availableTickets} billets disponibles
              </p>
            </div>
            
            <Button 
              variant="primary" 
              size="lg" 
              fullWidth
              onClick={() => window.location.href = `/tickets/checkout?eventId=${event.id}`}
            >
              Réserver maintenant
            </Button>
            
            <div className="mt-4 text-sm text-gray-500 flex items-start">
              <FaInfoCircle className="mr-2 mt-0.5 flex-shrink-0" />
              <p>Les billets vous seront envoyés par email après confirmation du paiement.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

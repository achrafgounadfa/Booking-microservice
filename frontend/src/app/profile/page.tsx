import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FaUser, FaTicketAlt, FaCreditCard, FaEdit, FaSignOutAlt } from 'react-icons/fa';
import Link from 'next/link';

export default function ProfilePage() {
  // Ces données seraient normalement récupérées depuis l'API
  const user = {
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    phone: '06 12 34 56 78',
    address: '123 Rue de Paris, 75001 Paris',
  };

  const upcomingTickets = [
    {
      id: 'TIX-12345',
      eventId: '1',
      eventTitle: 'Coldplay - Music Of The Spheres World Tour',
      eventImage: 'https://media.ticketmaster.com/tm/en-us/dam/a/1f6/0e4fe8ee-488a-46ba-9d2e-e42e47981f6.jpg',
      eventDate: '15 juin 2025',
      eventTime: '20:00',
      eventLocation: 'Stade de France, Saint-Denis',
      price: 75.50,
    },
    {
      id: 'TIX-67890',
      eventId: '2',
      eventTitle: 'Festival Solidays 2025',
      eventImage: 'https://www.sortiraparis.com/images/80/66131/908390-solidays-2023-a-paris-dates-programmation-billetterie.jpg',
      eventDate: '26-28 juin 2025',
      eventTime: 'Journée',
      eventLocation: 'Hippodrome de Longchamp, Paris',
      price: 49.00,
    },
  ];

  const pastTickets = [
    {
      id: 'TIX-54321',
      eventId: '3',
      eventTitle: 'Angèle - Nonante-Cinq Tour',
      eventImage: 'https://www.gqmagazine.fr/uploads/images/thumbs/202201/28/angele_concert_paris_2022_6570.jpeg',
      eventDate: '12 mars 2025',
      eventTime: '20:00',
      eventLocation: 'Accor Arena, Paris',
      price: 45.00,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mon compte</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Navigation */}
        <div className="lg:col-span-1">
          <Card className="p-0 overflow-hidden">
            <nav>
              <ul>
                <li>
                  <Link 
                    href="/profile" 
                    className="flex items-center px-6 py-4 bg-red-50 text-red-600 border-l-4 border-red-600"
                  >
                    <FaUser className="mr-3" />
                    <span>Profil</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/profile/tickets" 
                    className="flex items-center px-6 py-4 hover:bg-gray-50"
                  >
                    <FaTicketAlt className="mr-3" />
                    <span>Mes billets</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/profile/payment" 
                    className="flex items-center px-6 py-4 hover:bg-gray-50"
                  >
                    <FaCreditCard className="mr-3" />
                    <span>Moyens de paiement</span>
                  </Link>
                </li>
                <li>
                  <button 
                    className="flex items-center px-6 py-4 w-full text-left hover:bg-gray-50 text-gray-700"
                    onClick={() => {
                      // Logique de déconnexion
                      window.location.href = '/auth/login';
                    }}
                  >
                    <FaSignOutAlt className="mr-3" />
                    <span>Déconnexion</span>
                  </button>
                </li>
              </ul>
            </nav>
          </Card>
        </div>
        
        {/* Main content */}
        <div className="lg:col-span-3">
          {/* Informations personnelles */}
          <Card className="p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Informations personnelles</h2>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center"
              >
                <FaEdit className="mr-2" />
                Modifier
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Prénom</p>
                <p className="font-medium">{user.firstName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Nom</p>
                <p className="font-medium">{user.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Téléphone</p>
                <p className="font-medium">{user.phone}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 mb-1">Adresse</p>
                <p className="font-medium">{user.address}</p>
              </div>
            </div>
          </Card>
          
          {/* Billets à venir */}
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">Billets à venir</h2>
            
            {upcomingTickets.length > 0 ? (
              <div className="space-y-4">
                {upcomingTickets.map((ticket) => (
                  <div 
                    key={ticket.id} 
                    className="flex flex-col md:flex-row border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <img 
                      src={ticket.eventImage} 
                      alt={ticket.eventTitle} 
                      className="w-full md:w-48 h-32 object-cover"
                    />
                    <div className="p-4 flex-grow">
                      <h3 className="font-bold mb-1">{ticket.eventTitle}</h3>
                      <p className="text-gray-600 mb-2">
                        {ticket.eventDate} à {ticket.eventTime} • {ticket.eventLocation}
                      </p>
                      <p className="text-sm text-gray-500 mb-2">Billet #{ticket.id}</p>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center"
                        >
                          <FaTicketAlt className="mr-1" />
                          Voir billet
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                        >
                          Détails
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaTicketAlt className="mx-auto text-4xl mb-4 text-gray-300" />
                <p>Vous n'avez pas de billets à venir</p>
                <Button 
                  variant="primary" 
                  className="mt-4"
                  onClick={() => window.location.href = '/events'}
                >
                  Découvrir des événements
                </Button>
              </div>
            )}
          </Card>
          
          {/* Historique des billets */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Historique des billets</h2>
            
            {pastTickets.length > 0 ? (
              <div className="space-y-4">
                {pastTickets.map((ticket) => (
                  <div 
                    key={ticket.id} 
                    className="flex flex-col md:flex-row border border-gray-200 rounded-lg overflow-hidden bg-gray-50"
                  >
                    <img 
                      src={ticket.eventImage} 
                      alt={ticket.eventTitle} 
                      className="w-full md:w-48 h-32 object-cover filter grayscale"
                    />
                    <div className="p-4 flex-grow">
                      <h3 className="font-bold mb-1">{ticket.eventTitle}</h3>
                      <p className="text-gray-600 mb-2">
                        {ticket.eventDate} à {ticket.eventTime} • {ticket.eventLocation}
                      </p>
                      <p className="text-sm text-gray-500 mb-2">Billet #{ticket.id}</p>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                        >
                          Détails
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Vous n'avez pas d'historique de billets</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

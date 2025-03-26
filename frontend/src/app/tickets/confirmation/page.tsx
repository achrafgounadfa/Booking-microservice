import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FaCheckCircle, FaTicketAlt, FaDownload, FaEnvelope } from 'react-icons/fa';
import Link from 'next/link';

export default function ConfirmationPage() {
  // Ces données seraient normalement récupérées depuis l'API en fonction des paramètres d'URL
  const order = {
    id: 'ORD-12345678',
    date: '26 mars 2025',
    total: 156.00,
    tickets: 2,
    event: {
      id: '1',
      title: 'Coldplay - Music Of The Spheres World Tour',
      image: 'https://media.ticketmaster.com/tm/en-us/dam/a/1f6/0e4fe8ee-488a-46ba-9d2e-e42e47981f6.jpg',
      date: '15 juin 2025',
      time: '20:00',
      location: 'Stade de France, Saint-Denis',
      price: 75.50,
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <FaCheckCircle className="text-green-600 text-4xl" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Commande confirmée !</h1>
          <p className="text-gray-600 text-lg">
            Merci pour votre achat. Vos billets ont été envoyés à votre adresse email.
          </p>
        </div>
        
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Détails de la commande</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Numéro de commande</p>
              <p className="font-medium">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date de commande</p>
              <p className="font-medium">{order.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="font-medium">{order.total.toFixed(2)} €</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Nombre de billets</p>
              <p className="font-medium">{order.tickets}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-bold mb-4">Événement</h3>
            
            <div className="flex items-center">
              <img 
                src={order.event.image} 
                alt={order.event.title} 
                className="w-24 h-24 object-cover rounded-md mr-4"
              />
              <div>
                <h4 className="font-bold">{order.event.title}</h4>
                <p className="text-gray-600">{order.event.date} à {order.event.time}</p>
                <p className="text-gray-600">{order.event.location}</p>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Vos billets</h2>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md mb-4">
            <div className="flex items-center">
              <FaTicketAlt className="text-red-600 mr-3 text-xl" />
              <div>
                <p className="font-medium">Billet électronique</p>
                <p className="text-sm text-gray-500">Format PDF</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center"
              >
                <FaDownload className="mr-1" />
                Télécharger
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center"
              >
                <FaEnvelope className="mr-1" />
                Renvoyer par email
              </Button>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <p className="mb-2">
              <strong>Important :</strong> Veuillez présenter vos billets électroniques à l'entrée de l'événement, soit imprimés, soit sur votre smartphone.
            </p>
            <p>
              Chaque billet comporte un QR code unique qui sera scanné à l'entrée. Ne partagez pas vos billets avec des tiers pour éviter toute utilisation frauduleuse.
            </p>
          </div>
        </Card>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="primary"
            onClick={() => window.location.href = '/profile/tickets'}
            className="flex items-center justify-center"
          >
            <FaTicketAlt className="mr-2" />
            Voir mes billets
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/events'}
            className="flex items-center justify-center"
          >
            Découvrir d'autres événements
          </Button>
        </div>
      </div>
    </div>
  );
}

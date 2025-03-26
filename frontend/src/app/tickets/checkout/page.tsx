import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FaTicketAlt, FaCreditCard, FaLock } from 'react-icons/fa';

export default function CheckoutPage() {
  // Ces données seraient normalement récupérées depuis l'API en fonction des paramètres d'URL
  const event = {
    id: '1',
    title: 'Coldplay - Music Of The Spheres World Tour',
    image: 'https://media.ticketmaster.com/tm/en-us/dam/a/1f6/0e4fe8ee-488a-46ba-9d2e-e42e47981f6.jpg',
    date: '15 juin 2025',
    time: '20:00',
    location: 'Stade de France, Saint-Denis',
    price: 75.50,
  };
  
  const [ticketCount, setTicketCount] = React.useState(2);
  const [cardNumber, setCardNumber] = React.useState('');
  const [cardName, setCardName] = React.useState('');
  const [cardExpiry, setCardExpiry] = React.useState('');
  const [cardCvc, setCardCvc] = React.useState('');

  const subtotal = event.price * ticketCount;
  const serviceFee = 2.50 * ticketCount;
  const total = subtotal + serviceFee;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Finaliser votre commande</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne principale - Formulaire de paiement */}
        <div className="lg:col-span-2">
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Vos billets</h2>
            
            <div className="flex items-center border-b border-gray-200 pb-4 mb-4">
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-24 h-24 object-cover rounded-md mr-4"
              />
              <div>
                <h3 className="font-bold">{event.title}</h3>
                <p className="text-gray-600">{event.date} à {event.time}</p>
                <p className="text-gray-600">{event.location}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <FaTicketAlt className="text-red-600 mr-2" />
                <span className="font-medium">Nombre de billets</span>
              </div>
              <select
                value={ticketCount}
                onChange={(e) => setTicketCount(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Informations de paiement</h2>
            
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <FaCreditCard className="text-red-600 mr-2" />
                <h3 className="font-medium">Carte bancaire</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de carte
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom sur la carte
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                      Date d'expiration
                    </label>
                    <input
                      type="text"
                      id="cardExpiry"
                      placeholder="MM/AA"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-700 mb-1">
                      CVC
                    </label>
                    <input
                      type="text"
                      id="cardCvc"
                      placeholder="123"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 mb-6">
              <FaLock className="text-green-600 mr-2" />
              <span>Vos informations de paiement sont sécurisées et cryptées</span>
            </div>
            
            <div className="flex items-center mb-6">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                J'accepte les conditions générales de vente et la politique de confidentialité
              </label>
            </div>
            
            <Button 
              variant="primary" 
              size="lg" 
              fullWidth
              onClick={() => window.location.href = `/tickets/confirmation?eventId=${event.id}`}
            >
              Payer {total.toFixed(2)} €
            </Button>
          </Card>
        </div>
        
        {/* Colonne latérale - Récapitulatif */}
        <div>
          <Card className="p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Récapitulatif</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Prix unitaire</span>
                <span>{event.price.toFixed(2)} €</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Nombre de billets</span>
                <span>{ticketCount}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Frais de service</span>
                <span>{serviceFee.toFixed(2)} €</span>
              </div>
              
              <div className="border-t border-gray-200 pt-4 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-red-600">{total.toFixed(2)} €</span>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              <p className="mb-2">
                Les billets vous seront envoyés par email après confirmation du paiement.
              </p>
              <p>
                En cas d'annulation de l'événement, vous serez intégralement remboursé.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

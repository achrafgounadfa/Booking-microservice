import React from 'react';
import SearchBar from './components/ui/SearchBar';
import EventCard from './components/events/EventCard';
import Button from './components/ui/Button';
import { FaArrowRight } from 'react-icons/fa';

export default function Home() {
  // Ces données seraient normalement chargées depuis l'API
  const featuredEvents = [
    {
      id: '1',
      title: 'Coldplay - Music Of The Spheres World Tour',
      image: 'https://media.ticketmaster.com/tm/en-us/dam/a/1f6/0e4fe8ee-488a-46ba-9d2e-e42e47981f6.jpg',
      date: '15 juin 2025',
      location: 'Stade de France, Saint-Denis',
      category: 'Concert',
      price: 75.50,
    },
    {
      id: '2',
      title: 'Festival Solidays 2025',
      image: 'https://www.sortiraparis.com/images/80/66131/908390-solidays-2023-a-paris-dates-programmation-billetterie.jpg',
      date: '26-28 juin 2025',
      location: 'Hippodrome de Longchamp, Paris',
      category: 'Festival',
      price: 49.00,
    },
    {
      id: '3',
      title: 'Le Roi Lion - Comédie Musicale',
      image: 'https://static.ticketmaster.fr/static/images/lion_king_hero.jpg',
      date: 'À partir du 10 mai 2025',
      location: 'Théâtre Mogador, Paris',
      category: 'Théâtre',
      price: 35.00,
    },
    {
      id: '4',
      title: 'Angèle - Nonante-Cinq Tour',
      image: 'https://www.gqmagazine.fr/uploads/images/thumbs/202201/28/angele_concert_paris_2022_6570.jpeg',
      date: '12 juillet 2025',
      location: 'Accor Arena, Paris',
      category: 'Concert',
      price: 45.00,
    },
  ];

  const categories = [
    { id: 'concerts', name: 'Concerts', image: 'https://www.rollingstone.fr/wp-content/uploads/2022/07/concert-scaled.jpg' },
    { id: 'festivals', name: 'Festivals', image: 'https://www.visitparisregion.com/sites/default/files/styles/agenda_visuel_677x381/public/medias/2022-05/Festival%20Rock%20en%20Seine%20-%20Olivier%20Hoffschir%20-%20CRT%20IDF%20%281%29.jpg' },
    { id: 'theatre', name: 'Théâtre', image: 'https://www.theatredelaville-paris.com/assets/image/cache/1920x1080/uploads/spectacles/5d9b2c3e5e8ef.jpg' },
    { id: 'comedy', name: 'Humour', image: 'https://www.sortiraparis.com/images/80/1467/809187-le-grand-point-virgule-a-paris-la-salle-de-spectacle-dediee-a-l-humour.jpg' },
  ];

  const handleSearch = (query: string) => {
    console.log('Recherche:', query);
    // Redirection vers la page de résultats de recherche
    window.location.href = `/events/search?q=${encodeURIComponent(query)}`;
  };

  return (
    <div>
      {/* Hero section avec recherche */}
      <section className="bg-gradient-to-r from-red-700 to-red-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Trouvez vos billets pour les meilleurs événements
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Concerts, festivals, théâtre, humour... Réservez vos places en quelques clics !
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* Section événements à la une */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Événements à la une</h2>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/events'}
              className="flex items-center"
            >
              Voir tous les événements
              <FaArrowRight className="ml-2" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredEvents.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                image={event.image}
                date={event.date}
                location={event.location}
                category={event.category}
                price={event.price}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section catégories */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Parcourir par catégorie</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <a 
                key={category.id} 
                href={`/events/${category.id}`}
                className="relative rounded-lg overflow-hidden group"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <h3 className="text-white text-xl font-bold p-4 w-full">
                    {category.name}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Section avantages */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Pourquoi choisir BilletSpectacle ?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Réservation rapide</h3>
              <p className="text-gray-600">
                Réservez vos billets en quelques clics, sans attente et sans stress.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Paiement sécurisé</h3>
              <p className="text-gray-600">
                Vos transactions sont 100% sécurisées et vos données personnelles protégées.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Support client</h3>
              <p className="text-gray-600">
                Notre équipe est disponible pour vous aider et répondre à toutes vos questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section newsletter */}
      <section className="py-12 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Restez informé</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Inscrivez-vous à notre newsletter pour recevoir les dernières actualités et offres exclusives.
          </p>
          
          <form className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-grow px-4 py-3 rounded-l-md focus:outline-none text-gray-900"
            />
            <Button type="submit" className="rounded-l-none">
              S'inscrire
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}

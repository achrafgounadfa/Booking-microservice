import React from 'react';
import SearchBar from '../components/ui/SearchBar';
import EventCard from '../components/events/EventCard';
import Button from '../components/ui/Button';
import { FaFilter } from 'react-icons/fa';

export default function EventsPage() {
  // Ces données seraient normalement chargées depuis l'API
  const events = [
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
    {
      id: '5',
      title: 'Rock en Seine 2025',
      image: 'https://www.visitparisregion.com/sites/default/files/styles/agenda_visuel_677x381/public/medias/2022-05/Festival%20Rock%20en%20Seine%20-%20Olivier%20Hoffschir%20-%20CRT%20IDF%20%281%29.jpg',
      date: '22-24 août 2025',
      location: 'Domaine national de Saint-Cloud',
      category: 'Festival',
      price: 69.00,
    },
    {
      id: '6',
      title: 'Gad Elmaleh - D'ailleurs',
      image: 'https://www.sortiraparis.com/images/80/83449/469085-gad-elmaleh-en-tournee-dans-toute-la-france-avec-son-spectacle-d-ailleurs.jpg',
      date: '5 septembre 2025',
      location: 'L'Olympia, Paris',
      category: 'Humour',
      price: 39.00,
    },
    {
      id: '7',
      title: 'Billie Eilish World Tour',
      image: 'https://www.rollingstone.com/wp-content/uploads/2021/12/billie-eilish-happier-than-ever-tour-2022.jpg',
      date: '10 octobre 2025',
      location: 'Paris La Défense Arena',
      category: 'Concert',
      price: 85.00,
    },
    {
      id: '8',
      title: 'Cirque du Soleil - Kurios',
      image: 'https://www.sortiraparis.com/images/80/94267/689798-cirque-du-soleil-kurios-cabinet-des-curiosites-a-paris-la-defense-arena-en-2023.jpg',
      date: '15-30 novembre 2025',
      location: 'Paris La Défense Arena',
      category: 'Spectacle',
      price: 45.00,
    },
  ];

  const handleSearch = (query: string) => {
    console.log('Recherche:', query);
    // Redirection vers la page de résultats de recherche
    window.location.href = `/events/search?q=${encodeURIComponent(query)}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tous les événements</h1>
      
      {/* Barre de recherche et filtres */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:flex-grow">
            <SearchBar onSearch={handleSearch} />
          </div>
          <Button 
            variant="outline" 
            className="flex items-center whitespace-nowrap"
          >
            <FaFilter className="mr-2" />
            Filtrer
          </Button>
        </div>
      </div>
      
      {/* Filtres rapides */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Button variant="outline" size="sm">Tous</Button>
        <Button variant="outline" size="sm">Concerts</Button>
        <Button variant="outline" size="sm">Festivals</Button>
        <Button variant="outline" size="sm">Théâtre</Button>
        <Button variant="outline" size="sm">Humour</Button>
        <Button variant="outline" size="sm">Spectacles</Button>
      </div>
      
      {/* Liste des événements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {events.map((event) => (
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
      
      {/* Pagination */}
      <div className="mt-12 flex justify-center">
        <nav className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>Précédent</Button>
          <Button variant="primary" size="sm">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <span className="mx-2">...</span>
          <Button variant="outline" size="sm">10</Button>
          <Button variant="outline" size="sm">Suivant</Button>
        </nav>
      </div>
    </div>
  );
}

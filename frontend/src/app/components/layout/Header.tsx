import React from 'react';
import Link from 'next/link';
import { FaUser, FaTicketAlt, FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-red-600 text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo et navigation principale */}
          <div className="flex items-center space-x-10">
            <Link href="/" className="text-2xl font-bold">
              BilletSpectacle
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/events" className="hover:text-gray-200 transition">
                Événements
              </Link>
              <Link href="/events/concerts" className="hover:text-gray-200 transition">
                Concerts
              </Link>
              <Link href="/events/festivals" className="hover:text-gray-200 transition">
                Festivals
              </Link>
              <Link href="/events/theatre" className="hover:text-gray-200 transition">
                Théâtre
              </Link>
            </nav>
          </div>

          {/* Recherche et compte utilisateur */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/tickets" className="hover:text-gray-200 transition flex items-center">
                  <FaTicketAlt className="mr-1" />
                  <span className="hidden sm:inline">Mes billets</span>
                </Link>
                <Link href="/cart" className="hover:text-gray-200 transition flex items-center">
                  <FaShoppingCart className="mr-1" />
                  <span className="hidden sm:inline">Panier</span>
                </Link>
                <div className="relative group">
                  <button className="hover:text-gray-200 transition flex items-center">
                    <FaUser className="mr-1" />
                    <span className="hidden sm:inline">Mon compte</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                      Mon profil
                    </Link>
                    <Link href="/tickets" className="block px-4 py-2 hover:bg-gray-100">
                      Mes billets
                    </Link>
                    <button 
                      onClick={logout} 
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className="hover:text-gray-200 transition flex items-center"
                >
                  <FaUser className="mr-1" />
                  <span>Connexion</span>
                </Link>
                <Link 
                  href="/auth/register" 
                  className="bg-white text-red-600 px-4 py-2 rounded-md hover:bg-gray-100 transition"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

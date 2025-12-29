import { Instagram } from 'lucide-react';

export const FloatingInstagram = () => {
    return (
        <a
            href="https://www.instagram.com/parla.seramik/"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 hover:shadow-xl"
            aria-label="Instagram"
        >
            <Instagram className="w-7 h-7" />
        </a>
    );
};

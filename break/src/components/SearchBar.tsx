import React from 'react';
import { Bell, LogOut } from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import '../firebase'; 

const SearchBar: React.FC = () => {
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(getAuth());
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        router.push('/login');
    };
    return (
        <div className='w-full p-4 flex items-center'>
            <input
                type='text'
                placeholder='Rechercher...'
                className='flex-grow p-4 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary h-12 text-[#7346FF] font-bold text-lg'
            />
            <button
                className='ml-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 focus:outline-none active:scale-90 transition-transform duration-100'
            >
                <Bell color='#7346FF' className='w-6 h-6' />
            </button>
            <button
                className='ml-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 focus:outline-none active:scale-90 transition-transform duration-100'
                onClick={handleLogout}
                title='Déconnexion'
            >
                <LogOut color='#7346FF' className='w-6 h-6' />
            </button>
        </div>
    );
};

export default SearchBar;
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PauseCircle, Activity, Grid, Settings, Coffee } from 'lucide-react';

const Sidebar = () => {
  const router = useRouter();
  const [selected, setSelected] = useState(router.pathname);
  const [hovered, setHovered] = useState<string | null>(null);

  const primaryColor = '#7346FF'; // Couleur primaire définie dans globals.css
  const grayColor = '#656565';

  const menuItems = [
    {
      href: '/breaks',
      icon: <PauseCircle color={selected === '/breaks' || hovered === '/breaks' ? primaryColor : grayColor} className="w-18 h-18" />,
      label: 'Pauses',
    },
    {
      href: '/activities',
      icon: <Activity color={selected === '/activities' || hovered === '/activities' ? primaryColor : grayColor} className="w-18 h-18" />,
      label: 'Activités',
    },
    {
      href: '/dashboard',
      icon: <Grid color={selected === '/dashboard' || hovered === '/dashboard' ? primaryColor : grayColor} className="w-18 h-18" />,
      label: 'Tableau de bord',
    },
    {
      href: '/settings',
      icon: <Settings color={selected === '/settings' || hovered === '/settings' ? primaryColor : grayColor} className="w-18 h-18" />,
      label: 'Paramètres',
    },
  ];

  return (
    <div className="w-40 h-full bg-white fixed flex flex-col items-center py-4">
      <div className="flex flex-col items-center">
        <Link href="/welcome">
          <div
            className="cursor-pointer mb-1" 
            onMouseEnter={() => setHovered('/welcome')}
            onMouseLeave={() => setHovered(null)}
          >
            <Coffee color={selected === '/welcome' || hovered === '/welcome' ? primaryColor : grayColor} className="w-20 h-20" />
          </div>
        </Link>
        <div className="w-16 h-[4.5px] bg-gray-500 mb-40"></div> 
        <nav className="flex flex-col items-center justify-center flex-1 space-y-28">
          {menuItems.map(item => (
            <Link key={item.href} href={item.href}>
              <div
                className="cursor-pointer"
                onClick={() => setSelected(item.href)}
                onMouseEnter={() => setHovered(item.href)}
                onMouseLeave={() => setHovered(null)}
              >
                {item.icon}
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;

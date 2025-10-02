import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const MobileNav: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    try {
      setRole(localStorage.getItem('role'));
    } catch {
      setRole(null);
    }
  }, []);

  return (
    <>
      {/* Hamburger visible only on mobile */}
      <button
        aria-label="Ouvrir le menu"
        data-testid="hamburger"
        className="md:hidden p-3 m-2 rounded bg-white shadow fixed z-50"
        onClick={() => setOpen(true)}
      >
        <span className="block w-6 h-0.5 bg-black mb-1" />
        <span className="block w-6 h-0.5 bg-black mb-1" />
        <span className="block w-6 h-0.5 bg-black" />
      </button>

      {/* Overlay drawer */}
      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          aria-modal="true"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            data-testid="backdrop"
          />
          <nav
            className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg p-6 flex flex-col space-y-6"
            data-testid="mobile-drawer"
          >
            <Link href="/welcome" onClick={() => setOpen(false)} className="text-lg">Accueil</Link>
            <Link href="/breaks" onClick={() => setOpen(false)} className="text-lg">Pauses</Link>
            <Link href="/activities" onClick={() => setOpen(false)} className="text-lg">Activités</Link>
            <Link href="/dashboard" onClick={() => setOpen(false)} className="text-lg">Tableau de bord</Link>
            <Link href="/settings" onClick={() => setOpen(false)} className="text-lg">Paramètres</Link>
            {role === 'manager' && (
              <Link href="/managers" onClick={() => setOpen(false)} className="text-lg">Managers</Link>
            )}
            <button
              className="mt-auto text-left text-red-600"
              onClick={() => setOpen(false)}
            >
              Fermer
            </button>
          </nav>
        </div>
      )}
    </>
  );
};

export default MobileNav;

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, ActionCodeSettings } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import '../firebase';
import Image from 'next/image';

type LoginFormInputs = {
  username: string;
  password: string;
};

function base64UrlToBase64(str: string) {
  return str.replace(/-/g, '+').replace(/_/g, '/').padEnd(str.length + (4 - str.length % 4) % 4, '=');
}

const LoginPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Ajout pour la gestion du reset
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    setLoginError(null);
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.username,
        data.password
      );
      const token = await userCredential.user.getIdToken();

      // Correction pour décoder le JWT Firebase
      const payload = token.split('.')[1];
      const decodedToken = JSON.parse(atob(base64UrlToBase64(payload)));
      const role = decodedToken.role || 'user';

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      router.push('/welcome');
    } catch (error: unknown) {
      const message = (error as { message?: string })?.message || 'Erreur de connexion';
      setLoginError(message);
    } finally {
      setLoading(false);
    }
  };

  // Gestion du reset password
  const handleResetPassword = async () => {
    setResetMessage(null);
    if (!resetEmail) {
      setResetMessage('Veuillez entrer votre email.');
      return;
    }
    // Basic email format check for quick UX feedback
    const emailRegex = /[^@\s]+@[^@\s]+\.[^@\s]+/;
    if (!emailRegex.test(resetEmail)) {
      setResetMessage('Adresse email invalide.');
      return;
    }
    setResetLoading(true);
    try {
      const auth = getAuth();
      // Localiser l'email et la page d'action
      auth.languageCode = 'fr';
      const actionCodeSettings: ActionCodeSettings = {
        url:
          (typeof window !== 'undefined' &&
            (process.env.NEXT_PUBLIC_RESET_REDIRECT_URL || `${window.location.origin}/login`)) ||
          'http://localhost:3000/login',
        handleCodeInApp: false,
      };
      await sendPasswordResetEmail(auth, resetEmail, actionCodeSettings);
      // Bonnes pratiques: ne pas divulguer si l'email existe
      setResetMessage("Si un compte existe pour cet email, un lien de réinitialisation a été envoyé.");
    } catch (err: unknown) {
      // Erreurs communes: auth/user-not-found, auth/invalid-email, auth/missing-android-pkg-name, auth/invalid-continue-uri
      const code = (err as { code?: string })?.code;
      if (code === 'auth/invalid-email') {
        setResetMessage('Adresse email invalide.');
      } else if (code === 'auth/invalid-continue-uri') {
        setResetMessage("URL de redirection invalide. Vérifiez NEXT_PUBLIC_RESET_REDIRECT_URL et les domaines autorisés Firebase.");
      } else {
        // Message générique pour éviter l'énumération de comptes
        setResetMessage("Si un compte existe pour cet email, un lien de réinitialisation a été envoyé.");
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className='flex h-screen'>
      <div className='relative flex-1'>
        <Image
          src='/cielpixel.webp'
          alt='Background'
          fill
          sizes='100vw'
          priority
          className='object-cover'
        />
        <div className='absolute top-0 left-0 p-4'>
          <h1 className='text-white text-6xl font-bold font-pixelify'>BREAK</h1>
        </div>
      </div>
      <div className='w-[2%] bg-white'></div>
      <div className='flex-1 flex items-center justify-center bg-tertiary'>
        <div className='bg-white p-12 rounded shadow-md w-full max-w-lg min-h-[500px] flex flex-col justify-between'>
          <h2 className='text-5xl font-bold mb-8 text-center mt-2 underline text-[#848AD3] font-pixelify'>
            Connexion
          </h2>
          {!showReset ? (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col items-center space-y-4'
            >
              <div className='w-10/12'>
                <label
                  htmlFor='username'
                  className='block text-sm font-medium text-gray-500'
                >
                  Identifiant
                </label>
                <input
                  id='username'
                  type='text'
                  {...register('username', { required: 'Identifiant requis' })}
                  className='mt-1 block w-full h-12 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary px-4'
                />
                <div className='min-h-[1.5rem]'>
                  {errors.username && (
                    <p className='text-red-500 text-sm'>{errors.username.message}</p>
                  )}
                </div>
              </div>
              <div className='w-10/12'>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-500'
                >
                  Mot de passe
                </label>
                <input
                  id='password'
                  type='password'
                  {...register('password', { required: 'Mot de passe requis' })}
                  className='mt-1 block w-full h-12 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary px-4'
                />
                <div className='min-h-[1.5rem]'>
                  {errors.password && (
                    <p className='text-red-500 text-sm'>{errors.password.message}</p>
                  )}
                </div>
                <div className='text-right mt-1 mb-2'>
                  <button
                    type="button"
                    className="text-sm text-[#848AD3] hover:underline cursor-pointer"
                    onClick={() => setShowReset(true)}
                  >
                    Identifiants oubliés ?
                  </button>
                </div>
              </div>
              <div className='min-h-[1.5rem]'>
                {loginError && (
                  <p className='text-red-500 text-sm text-center'>{loginError}</p>
                )}
              </div>
              <button
                type='submit'
                className='cursor-pointer w-10/12 bg-[#848AD3] text-white py-3 px-4 rounded-md hover:bg-primary font-pixelify transition hover:scale-105 active:scale-95 mt-2'
                disabled={loading}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center space-y-4 w-10/12 mx-auto">
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Entrez votre email pour réinitialiser votre mot de passe
              </label>
              <input
                type="email"
                placeholder="Votre email"
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                className="mt-1 block w-full h-12 border border-gray-300 rounded-md shadow-sm px-4"
              />
              <button
                type="button"
                onClick={handleResetPassword}
                className="cursor-pointer w-full bg-[#848AD3] text-white py-3 px-4 rounded-md hover:bg-primary font-pixelify transition hover:scale-105 active:scale-95"
                disabled={resetLoading}
              >
                {resetLoading ? "Envoi..." : "Réinitialiser le mot de passe"}
              </button>
              {resetMessage && (
                <p className="text-sm text-center mt-2 text-[#7346FF]">{resetMessage}</p>
              )}
              <button
                type="button"
                onClick={() => setShowReset(false)}
                className="cursor-pointer w-full bg-white border border-[#848AD3] text-[#848AD3] py-3 px-4 rounded-md hover:bg-[#F5F2FF] font-pixelify transition hover:scale-105 active:scale-95"
              >
                Retour à la connexion
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
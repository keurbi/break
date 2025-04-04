// break/src/pages/login.tsx
"use client";

import React from 'react';
import { useForm } from 'react-hook-form';

type LoginFormInputs = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const result = await response.json();
      console.log('Login successful:', result);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side with Image and App Name */}
      <div className="relative flex-1">
        <img src="/cielpixel.webp" alt="Background" className="w-full h-full object-cover" />
        <div className="absolute top-0 left-0 p-4">
          <h1 className="text-white text-6xl font-bold font-pixelify">BREAK</h1>
        </div>
      </div>

      {/* Spacer with Gradient */}
      <div className="w-[2%] bg-white"></div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center bg-tertiary">
        <div className="bg-white p-12 rounded shadow-md w-full max-w-lg min-h-[500px] flex flex-col justify-between">
          <h2 className="text-5xl font-bold mb-8 text-center mt-2 underline text-[#848AD3] font-pixelify">Connexion</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center space-y-4">
            <div className="w-10/12">
              <label htmlFor="username" className="block text-sm font-medium text-gray-500">
                Identifiant
              </label>
              <input
                id="username"
                type="text"
                {...register('username', { required: 'Identifiant requis' })}
                className="mt-1 block w-full h-12 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              />
              {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
            </div>

            <div className="w-10/12">
              <label htmlFor="password" className="block text-sm font-medium text-gray-500">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                {...register('password', { required: 'Mot de passe requis' })}
                className="mt-1 block w-full h-12 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              <div className="text-right mt-1">
                <a href="#" className="text-sm text-[#848AD3] hover:underline ">
                  Identifiants oubliés ?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-10/12 bg-[#848AD3] text-white py-3 px-4 rounded-md hover:bg-primary mt-10 font-pixelify"
            >
              <span className="">Se connecter</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

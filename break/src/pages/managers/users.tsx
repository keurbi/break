'use client';

import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { fetchWithAuth } from '../../utils/fetchWithAuth';

type User = {
	id: string;
	email: string;
	firstName?: string;
	lastName?: string;
	department?: string;
	role?: 'user' | 'manager' | 'rh';
};

const ROLES = ['user', 'manager', 'rh'] as const;

const UsersPage = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [form, setForm] = useState({
		email: '',
		password: '',
		firstName: '',
		lastName: '',
		department: '',
		role: 'user',
	});
	const [editingId, setEditingId] = useState<string | null>(null);
	const [passwordError, setPasswordError] = useState<string | null>(null);
	const [generalError, setGeneralError] = useState<string | null>(null);

	useEffect(() => {
		fetchWithAuth('http://localhost:3100/api/users')
			.then((res) => res && res.json())
			.then((data) => (Array.isArray(data) ? setUsers(data) : setUsers([])));
	}, []);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setPasswordError(null);
		setGeneralError(null);

		if (!editingId && form.password.length < 6) {
			setPasswordError('Le mot de passe doit contenir au moins 6 caractères.');
			return;
		}

		if (!ROLES.includes(form.role as typeof ROLES[number])) {
			setGeneralError('Rôle invalide.');
			return;
		}

		try {
			let res;
			if (editingId) {
				res = await fetchWithAuth(`http://localhost:3100/api/users/${editingId}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						email: form.email,
						firstName: form.firstName,
						lastName: form.lastName,
						department: form.department,
						role: form.role,
					}),
				});
			} else {
				res = await fetchWithAuth('http://localhost:3100/api/users', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(form),
				});
			}
			if (!res) return;
			if (!res.ok) {
				const data = await res.json();
				setGeneralError(data.error || 'Erreur lors de la création/mise à jour.');
				return;
			}
			setForm({
				email: '',
				password: '',
				firstName: '',
				lastName: '',
				department: '',
				role: 'user',
			});
			setEditingId(null);
			const usersRes = await fetchWithAuth('http://localhost:3100/api/users');
			if (!usersRes) return;
			const data = await usersRes.json();
			setUsers(Array.isArray(data) ? data : []);
		} catch {
			setGeneralError('Erreur réseau ou serveur.');
		}
	};

	const handleEdit = (user: User) => {
		setEditingId(user.id);
		setForm({
			email: user.email,
			password: '',
			firstName: user.firstName || '',
			lastName: user.lastName || '',
			department: user.department || '',
			role: user.role || 'user',
		});
		setPasswordError(null);
		setGeneralError(null);
	};

	const handleDelete = async (id: string) => {
		const res = await fetchWithAuth(`http://localhost:3100/api/users/${id}`, {
			method: 'DELETE',
		});
		if (!res) return;
		setUsers(users.filter((u) => u.id !== id));
	};

	return (
		<Layout>
			<div className='max-w-4xl mx-auto mt-8 px-2'>
				<h2
					className='text-5xl font-bold mb-8 text-center'
					style={{ color: 'var(--color-secondary)' }}
				>
					Utilisateurs
				</h2>
				<form onSubmit={handleSubmit} className='space-y-6 mb-12'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<input
							name='email'
							type='email'
							placeholder='Email'
							value={form.email}
							onChange={handleChange}
							className='w-full px-5 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary text-[#CFAAFF] font-bold text-lg placeholder-[#CFAAFF]'
							required
						/>
						{!editingId ? (
							<>
								<input
									name='password'
									type='password'
									placeholder='Mot de passe'
									value={form.password}
									onChange={handleChange}
									className='w-full px-5 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary text-[#CFAAFF] font-bold text-lg placeholder-[#CFAAFF]'
									required
								/>
							</>
						) : (
							<div className='hidden md:block' />
						)}
						<input
							name='firstName'
							type='text'
							placeholder='Prénom'
							value={form.firstName}
							onChange={handleChange}
							className='w-full px-5 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary text-[#CFAAFF] font-bold text-lg placeholder-[#CFAAFF]'
						/>
						<input
							name='lastName'
							type='text'
							placeholder='Nom'
							value={form.lastName}
							onChange={handleChange}
							className='w-full px-5 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary text-[#CFAAFF] font-bold text-lg placeholder-[#CFAAFF]'
						/>
						<input
							name='department'
							type='text'
							placeholder='Département'
							value={form.department}
							onChange={handleChange}
							className='w-full px-5 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary text-[#CFAAFF] font-bold text-lg placeholder-[#CFAAFF]'
						/>
						<select
							name='role'
							value={form.role}
							onChange={handleChange}
							className='w-full px-5 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary text-[#CFAAFF] font-bold text-lg appearance-none'
							style={{ backgroundColor: 'white' }}
							required
						>
							<option value='user'>Utilisateur</option>
							<option value='manager'>Manager</option>
							<option value='rh'>RH</option>
						</select>
					</div>
					{passwordError && (
						<p className='text-red-500 text-sm text-center'>{passwordError}</p>
					)}
					{generalError && (
						<p className='text-red-500 text-sm text-center'>{generalError}</p>
					)}
					<div className='flex justify-center gap-4'>
						<button
							type='submit'
							className='bg-[#7346FF] hover:bg-[#5a36cc] text-white font-bold px-6 py-3 rounded-lg shadow transition'
						>
							{editingId ? "Mettre à jour l’utilisateur" : "Créer l’utilisateur"}
						</button>
						{editingId && (
							<button
								type='button'
								onClick={() => {
									setEditingId(null);
									setForm({
										email: '',
										password: '',
										firstName: '',
										lastName: '',
										department: '',
										role: 'user',
									});
									setPasswordError(null);
									setGeneralError(null);
								}}
								className='px-6 py-3 rounded-lg border border-[#7346FF] text-[#7346FF] font-bold bg-white hover:bg-gray-50 transition'
							>
								Annuler
							</button>
						)}
					</div>
				</form>
				<div className='overflow-x-auto'>
					<table className='min-w-full bg-white rounded-lg shadow text-[#7346FF]'>
						<thead className='bg-[#D5DDF4]'>
							<tr>
								<th className='p-3 font-bold'>Email</th>
								<th className='p-3 font-bold'>Prénom</th>
								<th className='p-3 font-bold'>Nom</th>
								<th className='p-3 font-bold'>Département</th>
								<th className='p-3 font-bold'>Rôle</th>
								<th className='p-3 font-bold'>Actions</th>
							</tr>
						</thead>
						<tbody>
							{users.map((user) => (
								<tr
									key={user.id}
									className='border-b border-gray-300 hover:bg-[#F5F2FF] transition'
								>
									<td className='p-3'>{user.email}</td>
									<td className='p-3'>{user.firstName}</td>
									<td className='p-3'>{user.lastName}</td>
									<td className='p-3'>{user.department}</td>
									<td className='p-3 capitalize'>{user.role}</td>
									<td className='p-3 flex gap-2'>
										<button
											onClick={() => handleEdit(user)}
											className='px-3 py-1 rounded bg-[#CFAAFF] text-white font-bold hover:bg-[#7346FF] transition'
										>
											Éditer
										</button>
										<button
											onClick={() => handleDelete(user.id)}
											className='px-3 py-1 rounded bg-red-400 text-white font-bold hover:bg-red-600 transition'
										>
											Supprimer
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</Layout>
	);
};

export default UsersPage;

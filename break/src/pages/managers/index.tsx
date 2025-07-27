'use client';

import React from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

const ManagersPage = () => {
	return (
		<Layout>
			<div className='max-w-2xl mx-auto mt-12 p-8 bg-white rounded shadow'>
				<h1 className='text-3xl font-bold mb-8 text-[#7346FF]'>Espace Managers</h1>
				<div className='flex flex-col gap-6'>
					<Link href='/managers/users'>
						<button className='w-full py-4 px-6 bg-[#7346FF] text-white rounded-lg font-semibold text-lg shadow hover:bg-[#5a36cc] transition'>
							Gérer les utilisateurs
						</button>
					</Link>
					<Link href='/managers/activities'>
						<button className='w-full py-4 px-6 bg-[#7346FF] text-white rounded-lg font-semibold text-lg shadow hover:bg-[#5a36cc] transition'>
							Gérer les activités
						</button>
					</Link>
				</div>
			</div>
		</Layout>
	);
};

export default ManagersPage;

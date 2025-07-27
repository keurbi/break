import React from 'react';

const PageTitleCard = ({ title }: { title: string }) => (
    <div className="w-full bg-[#FFFF] rounded-xl shadow mb-6 flex items-center justify-center py-4">
        <h2 className="text-4xl font-bold text-center text-[#7346FF]">
            {title}
        </h2>
    </div>
);

export default PageTitleCard;
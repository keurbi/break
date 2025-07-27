import React from 'react';

const PageContainer = ({
    children,
}: {
    children: React.ReactNode;
}) => (
    <div className="max-w-[1800px] mx-auto mt-[-20px] px-2 pb-4">
        {children}
    </div>
);

export default PageContainer;
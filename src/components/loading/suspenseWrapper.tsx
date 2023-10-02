import React, { Suspense } from 'react';

type Props = {
    children: React.ReactElement;
    fallback: React.ReactNode;
};

function suspenseWrapper({ children, fallback }: Props) {
    return (
        <Suspense fallback={fallback}>
            {children}
        </Suspense>
    );
}

export default suspenseWrapper;
"use client";

import { Hydrate, HydrateProps } from '@tanstack/react-query';
import React from 'react';

// type Props = {
//     children: React.ReactNode;

// };

function ReactQueryHydrate(props: HydrateProps) {
    return (
        <Hydrate {...props} />
    );
}

export default ReactQueryHydrate;
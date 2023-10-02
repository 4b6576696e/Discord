import { useEffect, useState } from 'react';

function useIsMounted(func?: () => void) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        return func;
    }, [setIsMounted, func]);

    return isMounted;
}

export default useIsMounted;
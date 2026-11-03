import { useEffect, useState } from 'react';

/** Current location.hash without the leading "#", kept in sync with navigation. */
export function useHash(): string {
  const read = () => window.location.hash.replace(/^#\/?/, '');
  const [hash, setHash] = useState(read);
  useEffect(() => {
    const onChange = () => {
      setHash(read());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return hash;
}

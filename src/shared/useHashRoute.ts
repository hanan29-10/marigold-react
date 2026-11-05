import { useEffect, useState } from 'react';
const currentRoute = () => location.hash.slice(1) || '/';
export const navigate = (path: string) => {
  location.hash = `#${path}`;
};
export function useHashRoute() {
  const [route, setRoute] = useState(currentRoute);
  useEffect(() => {
    const updateRoute = () => setRoute(currentRoute());
    addEventListener('hashchange', updateRoute);
    return () => removeEventListener('hashchange', updateRoute);
  }, []);
  return route;
}

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface WishlistContextValue {
  savedIds: string[];
  toggle: (id: string) => void;
}
const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined,
);
const storageKey = 'marigold-wishlist';
const readSavedIds = () => {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return Array.isArray(value)
      ? value.filter((id): id is string => typeof id === 'string')
      : [];
  } catch {
    return [];
  }
};

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState(readSavedIds);
  useEffect(
    () => localStorage.setItem(storageKey, JSON.stringify(savedIds)),
    [savedIds],
  );
  const value: WishlistContextValue = {
    savedIds,
    toggle: (id) =>
      setSavedIds((current) =>
        current.includes(id)
          ? current.filter((value) => value !== id)
          : [...current, id],
      ),
  };
  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}
export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('Wishlist context is unavailable.');
  return context;
}

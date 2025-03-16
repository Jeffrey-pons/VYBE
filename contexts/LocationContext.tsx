import React, { createContext, useState, useContext, ReactNode } from 'react';

interface LocationContextType {
  city: string | null;
  updateLocation: (city: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [city, setCity] = useState<string | null>(null);

  const updateLocation = (newCity: string) => {
    setCity(newCity);
  };

  return (
    <LocationContext.Provider value={{ city, updateLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

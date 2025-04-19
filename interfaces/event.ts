export interface Event {
  uid: string;
  title: { fr: string };
  dateRange?: { fr: string };
  location?: {
    city: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    name?: string;
  };
  keywords?: Record<string, any>; 
  address?: { city: string };    
  price?: string;
  image?: { base?: string; filename?: string };
  firstTiming?: { begin?: string };
  description?: { fr?: string };
  redirection?: { fr?: string };
}
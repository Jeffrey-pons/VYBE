export interface Event {
    title: { fr: string };
    dateRange?: { fr: string };
    location?: { 
        city: string;
        latitude?: number;
        longitude?: number;
        address?: string;
        name?: string;
      };
    keywords?: { fr: string[] };
    adress?: { city: string };
    price?: string;
    image?: { base?: string, filename?: string };
    firstTiming?: { begin?: string };
    description?: { fr?: string };
}


export interface Event {
    title: { fr: string };
    dateRange?: { fr: string };
    location?: { city: string };
    keywords?: { fr: string[] };
    price?: string;
    image?: { base?: string, filename?: string };
    firstTiming?: { begin?: string };
    description?: { fr?: string };
}


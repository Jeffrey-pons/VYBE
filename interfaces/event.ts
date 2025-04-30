export interface Event {
  uid: number;
  title: { fr: string };
  dateRange?: Record<string, string>;
  firstTiming?: { begin: string; end: string };
  nextTiming?: { begin: string; end: string };
  lastTiming?: { begin: string; end: string };
  timings?: { begin: string; end: string }[];

  location?: {
    uid: number;
    name?: string;
    city: string;
    address?: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
    description?: Record<string, string>;
    phone?: string;
    email?: string;
    website?: string;
    image?: string;
    timezone?: string;
    access?: Record<string, string>;
    region?: string;
    department?: string;
    countryCode?: string;
    district?: string;
    adminLevel1?: string;
    adminLevel2?: string;
    adminLevel3?: string;
    adminLevel4?: string;
    adminLevel5?: string;
    insee?: string;
    slug?: string;
    links?: string[];
  };

  keywords?: Record<string, string[]>;
  image?: {
    base?: string;
    filename?: string;
    size?: {
      width: number;
      height: number;
    };
    variants?: {
      filename: string;
      size: { width: number; height: number };
      type: string;
    }[];
  };

  description?: Record<string, string>;
  longDescription?: Record<string, string>;
  conditions?: Record<string, string>;
  price?: string;

  redirection?: Record<string, string>;
  originAgenda?: {
    uid: number;
    title?: string;
    slug?: string;
    image?: string;
    url?: string;
    description?: string;
    official?: boolean;
  };

  registration?: {
    type: 'link' | 'phone' | 'email';
    value: string;
  }[];

  accessibility?: {
    ii: boolean;
    hi: boolean;
    vi: boolean;
    pi: boolean;
    mi: boolean;
  };

  attendanceMode?: number;
  status?: number;
  state?: number;
  private?: number;
  draft?: number;
  featured?: boolean;

  motive?: string | null;
  onlineAccessLink?: string | null;

  timezone?: string;
  createdAt?: string;
  updatedAt?: string;

  slug?: string;
  creatorUid?: number;
  ownerUid?: number;
  links?: string[];
  age?: {
    min?: number;
    max?: number;
  };
  categories?: number[];
}

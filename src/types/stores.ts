// Store type for vendor profiles
export interface Store {
  _id: string;
  user: string;
  storeName: string;
  slogan?: string;
  storeDescription: string;
  logo: string | null;
  banner: string | null;
  contact: {
    email: string;
    phone?: string;
    website?: string;
    socialMedia?: Record<string, string>;
  };
  business?: {
    type?: string;
    registrationNumber?: string;
    taxId?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
  };
  specialties?: string[];
  craftsmanship?: Record<string, any>;
  shipping?: Record<string, any>;
  policies?: Record<string, any>;
  verification?: Record<string, any>;
  financials?: Record<string, any>;
  metrics?: Record<string, any>;
  settings?: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
} 
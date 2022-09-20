export interface BusinessParams {
  category?: string | string[];
  tags?: string | string[];
  facilities?: string | string[];
  search?: string;
  ownerId?: string;
  longitude?: number;
  latitude?: number;
  radius?: number; // meters, default: 5 km
  limit?: number;
  skip?: number;
  favorite?: boolean;
  popular?: boolean;
  recent?: boolean;
  fields?: string;
}

export interface BusinessParamsWithSearch extends BusinessParams {
  isFiltering?: boolean;
}

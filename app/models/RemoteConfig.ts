import { Facility } from '@screens/businesses/models/BusinessPresentable';

export interface HelplinesData {
  title: string;
  numbers: string[];
  image: string;
  description?: string;
  extension?: string;
}

interface Helplines {
  title: string;
  data: HelplinesData[];
}

interface Team {
  image: string;
  name: string;
  subName: string;
  description: string;
  link: string;
}

interface About {
  backgroundImage: string;
  whoWeAre: string;
  ourTeam: Team[];
  disclaimer: string;
}

interface Ads {
  dashboardBannerOne: boolean;
  dashboardBannerTwo: boolean;
  dashboardCustomAdBannerOne: boolean;
  dashboardCustomAdBannerTwo: boolean;
  businessDetailInterstitialOne: boolean;
  businessDetailInterstitialTwo: boolean;
}

export interface RemoteConfig {
  helplines: Helplines[];
  facilities?: Facility[];
  tags?: { name: string }[];
  about?: About;
  ads?: Ads;
}

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

export interface Tags {
  name: string;
}

export interface RemoteConfig {
  facilities: Facility[];
  tags: Tags[];
  helplines: Helplines[];
}

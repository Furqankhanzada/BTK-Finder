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

interface Facility {
  name: string;
  icon: string;
  checked?: boolean;
}

export interface Tags {
  name: string;
}

export interface RemoteConfig {
  facilities: Facility[];
  tags: Tags[];
  helplines: Helplines[];
}

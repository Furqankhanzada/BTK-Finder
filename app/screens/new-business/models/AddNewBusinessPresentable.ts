export interface NewAddBusinessPresentable {
    color: string,
    createdAt: string,
    icon: string,
    name?: string,
    order: number,
    updatedAt: string,
    item?: object,
    keyword?: string,
    selectedTags: [],
    date: object
    setFieldValue: any,
    latitude?: number,
    longitude?: number,
    animateToRegion: string,
    defaultDelta: defaultDelta,
    payload: payload,
    e: object,
    nativeEvent: object,
    coordinate: number | string,
  }
  
  interface defaultDelta {
    latitudeDelta: number,
    longitudeDelta: number,
  }

  interface payload {
    latitudeDelta: number;
    longitudeDelta: number;
    latitude: any;
    longitude: any;
}
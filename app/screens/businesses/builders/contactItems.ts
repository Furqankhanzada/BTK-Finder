import i18n from 'i18next';

import {
  BusinessPresentable,
  ContactItem,
  ContactItemType,
} from '@screens/businesses/models/BusinessPresentable';

export const buildContactItems = (
  business: BusinessPresentable,
): ContactItem[] => {
  return [
    {
      id: '1',
      icon: 'map-marker-alt',
      title: i18n.t('address'),
      type: ContactItemType.map,
      information: business.address,
      location: business?.location?.coordinates,
      rightText: 'Get Directions',
      name: business.name,
    },
    {
      id: '2',
      icon: 'mobile-alt',
      title: i18n.t('tel'),
      type: ContactItemType.phone,
      information: business?.telephone,
      rightText: 'Call Now',
    },
    {
      id: '3',
      icon: 'envelope',
      title: i18n.t('email'),
      type: ContactItemType.email,
      information: business?.email,
      rightText: 'Send Mail',
    },
    {
      id: '4',
      icon: 'globe',
      title: i18n.t('website'),
      type: ContactItemType.website,
      information: business?.website,
      rightText: 'Visit Website',
    },
  ];
};

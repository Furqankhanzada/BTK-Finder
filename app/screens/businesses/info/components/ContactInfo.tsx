import React from 'react';
import { View, StyleSheet } from 'react-native';

import { Icon, Button } from '@components';
import { useTranslation } from 'react-i18next';
import ContactItem from '@screens/businesses/info/components/ContactItem';

export default function ContactInfo(props: any) {
  const { t } = useTranslation();

  const { onPressWhatsApp, onPressPhone, onOpen, business } = props;

  const information = [
    {
      id: '1',
      icon: 'map-marker-alt',
      title: t('address'),
      type: 'map',
      information: business?.address,
      location: business?.location?.coordinates,
      rightText: 'Get Directions',
      name: business?.name,
    },
    {
      id: '2',
      icon: 'mobile-alt',
      title: t('tel'),
      type: 'phone',
      information: business?.telephone,
      rightText: 'Call Now',
    },
    {
      id: '3',
      icon: 'envelope',
      title: t('email'),
      type: 'email',
      information: business?.email ? business.email : '',
      rightText: 'Send Mail',
    },
    {
      id: '4',
      icon: 'globe',
      title: t('website'),
      type: 'web',
      information: business?.website ? business.website : '',
      rightText: 'Visit Website',
    },
  ];

  const renderWhatsAppButton = () => {
    // if it's not mobile number than ignore whatsapp button
    if (!business.telephone.includes('02')) {
      return (
        <Button
          onPress={onPressWhatsApp}
          round
          icon={<Icon name="whatsapp" size={24} color="white" />}
          style={styles.iconButton}
        />
      );
    }
    return null;
  };

  if (!business?.telephone) {
    return null;
  }

  return (
    <View>
      <View style={[styles.container, styles.directionRow]}>
        <View style={styles.directionRow}>
          <Button round small outline style={styles.textButton}>
            {business.type === 'restaurant' ? 'Menu' : 'Products'}
          </Button>
          <Button round outline style={styles.textButton}>
            Reviews
          </Button>
        </View>
        <View style={styles.directionRow}>
          {renderWhatsAppButton()}
          <Button
            onPress={onPressPhone}
            round
            icon={<Icon name="mobile-alt" size={24} color="white" />}
            style={styles.iconButton}
          />
        </View>
      </View>
      {information?.map((item) => {
        if (item?.information) {
          return <ContactItem item={item} onPress={onOpen} />;
        }
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  directionRow: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 10,
    height: 40,
    width: 40,
    paddingHorizontal: 10,
  },
  textButton: {
    height: 40,
    marginRight: 10,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  contentIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

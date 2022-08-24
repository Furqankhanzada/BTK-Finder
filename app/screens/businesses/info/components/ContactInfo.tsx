import React from 'react';
import { View, StyleSheet } from 'react-native';

import { Icon, Button } from '@components';
import {
  BusinessPresentable,
  ContactItem as ContactItemInterface,
  ShopStatus,
} from '@screens/businesses/models/BusinessPresentable';
import ContactItem from '@screens/businesses/info/components/ContactItem';

import { GlobalParamList } from '../../../../navigation/models/GlobalParamList';

interface Props {
  onNavigate: (route: keyof GlobalParamList) => void;
  onPressWhatsApp: () => void;
  onPressPhone: () => void;
  onOpen: (item: ContactItemInterface) => void;
  business: BusinessPresentable;
}

export default function ContactInfo({
  onNavigate,
  onPressWhatsApp,
  onPressPhone,
  onOpen,
  business,
}: Props) {
  const renderWhatsAppButton = () => {
    // if it's not mobile number than ignore whatsapp button
    if (!business.telephone?.includes('02')) {
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
          {business.shop && business.shop.status === ShopStatus.enabled ? (
            <Button
              round
              small
              outline
              style={styles.textButton}
              onPress={() => onNavigate('Products')}>
              {business.type === 'restaurant' ? 'Menu' : 'Products'}
            </Button>
          ) : null}
          <Button
            round
            outline
            style={styles.textButton}
            onPress={() => onNavigate('Reviews')}>
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
      {business.contactItems?.map((item) => {
        if (item.information) {
          return <ContactItem key={item.id} item={item} onPress={onOpen} />;
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
});

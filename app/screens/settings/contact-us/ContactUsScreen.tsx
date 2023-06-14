import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Linking,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';

import { BaseStyle, useTheme, Images, BaseColor } from '@config';
import { canOpenFacebookPage } from '@utils';
import { Header, SafeAreaView, Icon, Text, Image } from '@components';

import { SettingsParamList } from '../../../navigation/models/SettingsParamList';

type ContactItem = {
  name: string;
  information: string;
  type: 'whatsapp' | 'facebook' | 'email';
  icon: string;
  iconColor: string;
};

export default function ContactUsScreen({
  navigation,
}: StackScreenProps<SettingsParamList, 'ContactUs'>) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const contactData: ContactItem[] = [
    {
      name: 'WhatsApp',
      information: '+923001264820',
      type: 'whatsapp',
      icon: 'whatsapp-square',
      iconColor: '#25D366',
    },
    {
      name: 'Facebook',
      information: '103019245119931',
      type: 'facebook',
      icon: 'facebook-square',
      iconColor: '#4267B2',
    },
    {
      name: 'Email',
      information: 'explore.btk@gmail.com',
      type: 'email',
      icon: 'envelope',
      iconColor: '#EA4335',
    },
  ];

  const listEmptyComponent = () => {
    return (
      <View style={styles.sectionEmpty}>
        <Text semibold style={styles.sectionEmptyText}>
          We are really sorry, Contact service is not available right now.
        </Text>
      </View>
    );
  };

  const headerComponent = () => {
    return (
      <>
        <Image source={Images.logo} style={styles.logo} />
        <Text title2 style={styles.text}>
          Explore BTK
        </Text>
        <Text headline style={styles.text}>
          If you have any questions or queries we will always be happy to help.
          Feel free to contact us by WhatsApp, Facebook or Email and we will
          response as soon as possible.
        </Text>
      </>
    );
  };

  const onOpen = (item: ContactItem) => {
    Alert.alert(
      'Explore BTK',
      `Do you want to open ${item.name} ?`,
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('yes'),
          onPress: () => {
            switch (item.type) {
              case 'facebook':
                canOpenFacebookPage(
                  item.information,
                  'https://www.facebook.com/explore.btk',
                );
                break;
              case 'whatsapp':
                Linking.openURL('whatsapp://send?phone=' + item.information);
                break;
              case 'email':
                Linking.openURL('mailto:' + item.information);
                break;
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={t('contact_us')}
        renderLeft={() => {
          return (
            <Icon
              name="arrow-left"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <FlatList
        contentContainerStyle={styles.flatListContainer}
        data={contactData}
        keyExtractor={(item) => item.name}
        ListHeaderComponent={headerComponent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, { backgroundColor: colors.card }]}
            onPress={() => onOpen(item)}>
            <View style={styles.itemContent}>
              <Icon
                name={item.icon}
                color={item?.iconColor}
                style={styles.itemIcon}
                size={30}
              />
              <Text body1>{item.name}</Text>
            </View>
            <Icon name="arrow-right" size={18} color={colors.primary} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={listEmptyComponent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flatListContainer: {
    paddingHorizontal: 20,
  },
  sectionEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  sectionEmptyText: {
    textAlign: 'center',
  },
  textInput: {
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  item: {
    marginTop: 8,
    marginBottom: 8,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    marginRight: 10,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  text: {
    marginTop: 10,
    textAlign: 'center',
  },
});

import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { BaseStyle, useTheme, Images } from '@config';
import { useTranslation } from 'react-i18next';
import { Header, SafeAreaView, Icon, Text, Image } from '@components';
import styles from './styles';

export default function ContactUs({ navigation }) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const contactData = [
    {
      name: 'WhatsApp',
      information: '+923122052950',
      type: 'whatsapp',
      icon: 'whatsapp-square',
      iconColor: '#25D366',
    },
    {
      name: 'Facebook',
      information: 'furqankhanzada',
      type: 'social',
      icon: 'facebook-square',
      iconColor: '#4267B2',
    },
    {
      name: 'Email',
      information: 'furqan.khanzada@gmail.com',
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

  const onOpen = (item) => {
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
              case 'social':
                Linking.openURL(
                  'fb://facewebmodal/f?href=https://www.facebook.com/' +
                    item.information,
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

  // const [name, setName] = useState('');
  // const [email, setEmail] = useState('');
  // const [message, setMessage] = useState('');
  // const [success, setSuccess] = useState({
  //   name: true,
  //   email: true,
  //   message: true,
  // });
  // const [loading, setLoading] = useState(false);
  // const [region] = useState({
  //   latitude: 10.73902,
  //   longitude: 106.704938,
  //   latitudeDelta: 0.009,
  //   longitudeDelta: 0.004,
  // });
  //
  // /**
  //  * @description Called when user sumitted form
  //  * @author Passion UI <passionui.com>
  //  * @date 2019-08-03
  //  */
  // const onSubmit = () => {
  //   if (name == '' || email == '' || message == '') {
  //     setSuccess({
  //       ...success,
  //       email: email != '' ? true : false,
  //       name: name != '' ? true : false,
  //       message: message != '' ? true : false,
  //     });
  //   } else {
  //     setLoading(true);
  //     setTimeout(() => {
  //       setLoading(true);
  //       navigation.goBack();
  //     }, 500);
  //   }
  // };
  // const offsetKeyboard = Platform.select({
  //   ios: 0,
  //   android: 20,
  // });
  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
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
      <ScrollView style={styles.contain}>
        <Image source={Images.logo} style={styles.logo} />
        <Text title2 style={styles.text}>
          Explore BTK
        </Text>
        <Text headline style={styles.text}>
          If you have any questions or queries we will always be happy to help.
          Feel free to contact us by WhatsApp, Facebook or Email and we will
          response as soon as possible.
        </Text>
        <FlatList
          contentContainerStyle={{ paddingVertical: 20 }}
          data={contactData}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.item, { backgroundColor: colors.card }]}
              onPress={() => onOpen(item)}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name={item.icon}
                  color={item?.iconColor}
                  style={{ marginRight: 10 }}
                  size={30}
                />
                <Text body1>{item.name}</Text>
              </View>
              <Icon name="arrow-right" size={18} color={colors.primary} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={listEmptyComponent}
        />
      </ScrollView>
      {/*<KeyboardAvoidingView*/}
      {/*  behavior={Platform.OS === 'android' ? 'height' : 'padding'}*/}
      {/*  keyboardVerticalOffset={offsetKeyboard}*/}
      {/*  style={{ flex: 1 }}>*/}
      {/*  <ScrollView*/}
      {/*    contentContainerStyle={{*/}
      {/*      paddingHorizontal: 20,*/}
      {/*      paddingVertical: 15,*/}
      {/*    }}>*/}
      {/*    <View style={{ height: 180, width: '100%' }}>*/}
      {/*      <MapView*/}
      {/*        provider={PROVIDER_GOOGLE}*/}
      {/*        style={styles.map}*/}
      {/*        region={region}*/}
      {/*        onRegionChange={() => {}}>*/}
      {/*        <Marker*/}
      {/*          coordinate={{*/}
      {/*            latitude: 10.73902,*/}
      {/*            longitude: 106.704938,*/}
      {/*          }}*/}
      {/*        />*/}
      {/*      </MapView>*/}
      {/*    </View>*/}
      {/*    <Text headline style={{ marginVertical: 10 }}>*/}
      {/*      {t('contact_details')}*/}
      {/*    </Text>*/}
      {/*    <TextInput*/}
      {/*      onChangeText={(text) => setName(text)}*/}
      {/*      placeholder={t('name')}*/}
      {/*      success={success.name}*/}
      {/*      value={name}*/}
      {/*    />*/}
      {/*    <TextInput*/}
      {/*      style={{ marginTop: 10 }}*/}
      {/*      onChangeText={(text) => setEmail(text)}*/}
      {/*      placeholder={t('email')}*/}
      {/*      keyboardType="email-address"*/}
      {/*      success={success.email}*/}
      {/*      value={email}*/}
      {/*    />*/}
      {/*    <TextInput*/}
      {/*      style={{ marginTop: 10, height: 120 }}*/}
      {/*      onChangeText={(text) => setMessage(text)}*/}
      {/*      textAlignVertical="top"*/}
      {/*      multiline={true}*/}
      {/*      placeholder={t('message')}*/}
      {/*      success={success.message}*/}
      {/*      value={message}*/}
      {/*    />*/}
      {/*  </ScrollView>*/}
      {/*  <View style={{ paddingVertical: 15, paddingHorizontal: 20 }}>*/}
      {/*    <Button*/}
      {/*      loading={loading}*/}
      {/*      full*/}
      {/*      onPress={() => {*/}
      {/*        onSubmit();*/}
      {/*      }}>*/}
      {/*      {t('send')}*/}
      {/*    </Button>*/}
      {/*  </View>*/}
      {/*</KeyboardAvoidingView>*/}
    </SafeAreaView>
  );
}

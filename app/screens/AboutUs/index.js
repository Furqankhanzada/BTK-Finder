import React, { useEffect, useState } from 'react';
import remoteConfig from '@react-native-firebase/remote-config';
import { View, ScrollView, ImageBackground, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BaseStyle, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  ProfileDescription,
} from '@components';
import styles from './styles';

export default function AboutUs({ navigation }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [aboutUs, setAboutUs] = useState([]);

  useEffect(() => {
    const getAboutUsData = remoteConfig().getValue('aboutUs');
    getAboutUsData._value && setAboutUs(JSON.parse(getAboutUsData?._value));
  }, []);

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
      <Header
        title={t('about_us')}
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
      <ScrollView style={{ flex: 1 }}>
        <ImageBackground
          source={{ uri: aboutUs.backgroundImage }}
          style={styles.banner}
        />
        <View style={styles.content}>
          {aboutUs?.whoWeAre ? (
            <View>
              <Text headline semibold>
                {t('who_we_are').toUpperCase()}
              </Text>
              <Text body2 style={{ marginTop: 10 }} numberOfLines={20}>
                {aboutUs?.whoWeAre}
              </Text>
            </View>
          ) : null}
          {/*<Text headline semibold style={{ marginTop: 20 }}>*/}
          {/*  {t('what_we_do').toUpperCase()}*/}
          {/*</Text>*/}
          {/*<Text body2 style={{ marginTop: 5 }}>*/}
          {/*  - First Class Flights*/}
          {/*</Text>*/}
          {/*<Text body2 style={{ marginTop: 5 }}>*/}
          {/*  - 5 Star Accommodations*/}
          {/*</Text>*/}
          {/*<Text body2 style={{ marginTop: 5 }}>*/}
          {/*  - Inclusive Packages*/}
          {/*</Text>*/}
          {/*<Text body2 style={{ marginTop: 5 }}>*/}
          {/*  - Latest Model Vehicles*/}
          {/*</Text>*/}
        </View>
        {/*<Text headline semibold style={styles.title}>*/}
        {/*  {t('meet_our_team').toUpperCase()}*/}
        {/*</Text>*/}
        {/*<FlatList*/}
        {/*  contentContainerStyle={{ paddingLeft: 5, paddingRight: 20 }}*/}
        {/*  numColumns={2}*/}
        {/*  data={ourTeam}*/}
        {/*  keyExtractor={(item, index) => 'ourTeam' + index}*/}
        {/*  renderItem={({ item, index }) => (*/}
        {/*    <Card*/}
        {/*      image={item.image}*/}
        {/*      onPress={() => navigation.navigate(item.screen)}*/}
        {/*      style={{*/}
        {/*        flex: 1,*/}
        {/*        marginLeft: 15,*/}
        {/*        height: 200,*/}
        {/*        marginBottom: 20,*/}
        {/*      }}>*/}
        {/*      <Text footnote whiteColor style={styles.textShadow}>*/}
        {/*        {item.subName}*/}
        {/*      </Text>*/}
        {/*      <Text headline whiteColor semibold numberOfLines={1} style={styles.textShadow}>*/}
        {/*        {item.name}*/}
        {/*      </Text>*/}
        {/*    </Card>*/}
        {/*  )}*/}
        {/*/>*/}
        {aboutUs?.ourTeam ? (
          <View>
            <Text headline semibold style={styles.title}>
              {t('meet_our_team').toUpperCase()}
            </Text>
            <View style={{ paddingHorizontal: 20 }}>
              {aboutUs?.ourTeam?.map((item, index) => {
                return (
                  <ProfileDescription
                    key={'service' + index}
                    image={item.image}
                    name={item.name}
                    subName={item.subName}
                    description={item.description}
                    style={{ marginBottom: 10 }}
                    onPress={() => item.link && Linking.openURL(item.link)}
                  />
                );
              })}
            </View>
          </View>
        ) : null}
        {aboutUs?.disclaimer ? (
          <View style={{ paddingHorizontal: 20, paddingVertical: 30 }}>
            <Text headline semibold style={{ marginBottom: 10, color: 'red' }}>
              DISCLAIMER
            </Text>
            <Text>{aboutUs?.disclaimer}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

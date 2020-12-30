import React, { useState } from 'react';
import { View, ScrollView, ImageBackground, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BaseStyle, Images, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Card,
  ProfileDescription,
} from '@components';
import styles from './styles';

export default function AboutUs({ navigation }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [ourTeam] = useState([
    {
      id: '2',
      screen: 'Profile2',
      image: Images.furqan,
      subName: 'Founder',
      name: 'Muhammad Furqan/فرقان خانزادہ',
      description: 'Founder of the application Explore BTK',
    },
    {
      id: '1',
      screen: 'Profile1',
      image: Images.ayazJalbani,
      subName: 'Group Admin/Volunteer (P10A-RCG)',
      name: 'Ayaz Jalbani',
      description: 'Volunteer and Admin of the group (P10A-RCG)',
    },
  ]);

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
          source={{ uri: 'https://pbs.twimg.com/media/EpLNK_aW4AAlUjc.jpg' }}
          style={styles.banner}>
        </ImageBackground>
        <View style={styles.content}>
          <Text headline semibold>
            {t('who_we_are').toUpperCase()}
          </Text>
          <Text body2 style={{ marginTop: 10 }} numberOfLines={20}>
            We are BAHRIANS and Residents of P10A who developed this mobile
            application with sheer hard work and zeal to Serve community.
            {'\n'}
            {'\n'}
            The man behind this mobile application is{' '}
            <Text bold>Muhammad Furqan Khanzada</Text> who is resident of P10A
            and very active member of P10A Residents Community Group (P10A-RCG).
            {'\n'}
            {'\n'}
            This is the oldest and founder whatsapp group of P10A which is being
            run by active Community members and this app is developed with
            inspiration from this group. You all are welcome to give your feed
            back and enjoy the app.
          </Text>
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
        <Text headline semibold style={styles.title}>
          {t('our_service').toUpperCase()}
        </Text>
        <View style={{ paddingHorizontal: 20 }}>
          {ourTeam.map((item, index) => {
            return (
              <ProfileDescription
                key={'service' + index}
                image={item.image}
                name={item.name}
                subName={item.subName}
                description={item.description}
                style={{ marginBottom: 10 }}
                onPress={() => navigation.navigate(item.screen)}
              />
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';

import { Header, SafeAreaView, Icon, Button, Tag } from '@components';
import { BaseColor, BaseStyle, useTheme } from '@config';
import { useCategories } from '@screens/dashboard/queries/queries';

import { EVENTS, trackEvent } from '../../userTracking';
import { GlobalParamList } from '../../navigation/models/GlobalParamList';
import Section from '@screens/dashboard/components/Section';
import { CategoryPresentable } from '@screens/dashboard/models/CategoryPresentable';

export default function DashboardScreen({
  navigation,
}: StackScreenProps<GlobalParamList, 'Dashboard'>) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { data: categories } = useCategories(['categories']);

  const onPressHelpLine = () => {
    navigation.navigate('HelpLine');
    trackEvent(EVENTS.HELPLINE_SCREEN_VISITED);
  };

  const onCategoriesViewAllPress = () => {
    navigation.navigate('Category');
    trackEvent(EVENTS.CATEGORIES_SCREEN_VISITED);
  };

  const onCategoryPress = ({ name }: CategoryPresentable) => {
    navigation.navigate('Businesses', {
      category: name,
      title: name,
    });
    // navigation.navigate('Place', {
    //   title: category.name,
    //   category: category.name,
    //   categoryIcon: category.icon,
    //   // route: item.route,
    //   // latitude: getLocation?.latitude ?? null,
    //   // longitude: getLocation?.longitude ?? null,
    // });
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={'Explore BTK'}
        renderRight={() => {
          return (
            <Button
              styleText={styles.helplineButtonText}
              style={styles.helplineButton}
              icon={<Icon name={'phone'} size={10} color={'white'} solid />}
              full
              round
              onPress={onPressHelpLine}>
              {t('help_line')}
            </Button>
          );
        }}
      />
      <FlatList
        data={[1]}
        renderItem={() => (
          <View>
            <Section
              title="Browse by categories"
              onViewAll={onCategoriesViewAllPress}
              isLoading={false}>
              <FlatList
                contentContainerStyle={{ paddingLeft: 20 }}
                data={categories}
                horizontal={true}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => {
                  return (
                    <Tag
                      onPress={() => onCategoryPress(item)}
                      status
                      style={{
                        marginRight: 5,
                        borderColor: item.color,
                        backgroundColor: item.color,
                      }}
                      textStyle={{ color: '#fff', marginLeft: 5 }}
                      icon={
                        <Icon
                          name={item.icon}
                          size={20}
                          color={BaseColor.whiteColor}
                          solid
                        />
                      }>
                      {item.name}
                    </Tag>
                  );
                }}
              />
            </Section>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  helplineButton: {
    width: 80,
    paddingHorizontal: 10,
    height: 25,
  },
  helplineButtonText: {
    marginLeft: 5,
    fontSize: 10,
  },
  serviceItem: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 15,
  },
  serviceCircleIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    marginBottom: 5,
  },
});

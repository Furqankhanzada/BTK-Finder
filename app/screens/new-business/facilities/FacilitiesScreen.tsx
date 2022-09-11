import React, { useState } from 'react';
import { FlatList, SafeAreaView, TouchableOpacity, View } from 'react-native';

import { Header, Text, TextInput, Button, Icon } from '@components';
import { BaseColor, BaseStyle } from '@config';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';
import CategoryIcon from '@screens/category/components/CategoryIcon';

export const FacilitiesScreen = ({
  navigation,
}: StackScreenProps<GlobalParamList>) => {
  const [active, setActive] = useState<boolean>(false);
  const [search, setSearch] = useState<any>();

  const facilities = [
    {
      name: 'Free Wifi',
      icon: 'X',
    },
    {
      name: 'Open 24/7',
      icon: 'X',
    },
    {
      name: 'Pet Allowed',
      icon: 'X',
    },
    {
      name: 'Shower',
      icon: 'X',
    },
    {
      name: 'Shuttle Bus',
      icon: 'X',
    },
  ];

  const navigateToNext = () => {
    navigation.navigate('Tags');
  };

  const navigateToBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header title="Select Facilities" />
      <Text title1 bold style={styles.textPadding}>
        Select Facility which available
      </Text>
      <View style={styles.viewContainer}>
        <TextInput
          onChangeText={search}
          placeholder={'Search facility'}
          value={search}
          icon={
            <TouchableOpacity onPress={() => {}}>
              <Icon name="times" size={16} color={BaseColor.grayColor} />
            </TouchableOpacity>
          }
        />
      </View>

      <FlatList
        style={styles.container}
        overScrollMode={'never'}
        scrollEventThrottle={16}
        data={facilities}
        renderItem={({ item }) => {
          return (
            <View>
              <CategoryIcon
                icon={item.icon}
                title={item.name}
                style={styles.itemIcon}
                onPress={() => {
                  {
                    setActive(true);
                  }
                }}
              />
            </View>
          );
        }}
      />

      <View style={styles.stickyFooter}>
        <Button onPress={() => navigateToBack()}>{'Back'}</Button>
        {active === true ? (
          <Button onPress={() => navigateToNext()}>{'Next'}</Button>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

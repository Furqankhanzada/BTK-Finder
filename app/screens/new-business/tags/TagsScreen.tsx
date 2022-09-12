import React, { useState } from 'react';
import { FlatList, SafeAreaView, TouchableOpacity, View } from 'react-native';

import { Header, Text, TextInput, Button, Icon } from '@components';
import { BaseColor, BaseStyle, useTheme } from '@config';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';
import CategoryIcon from '@screens/category/components/CategoryIcon';

export const TagsScreen = ({
  navigation,
}: StackScreenProps<GlobalParamList>) => {
  const [active, setActive] = useState<boolean>(false);
  const [search, setSearch] = useState<any>();

  const { colors } = useTheme();

  const tags = [
    {
      name: 'ATM',
      icon: 'X',
    },
    {
      name: 'BBQ',
      icon: 'X',
    },
    {
      name: 'Beauty Salon',
      icon: 'X',
    },
    {
      name: 'CNG Station',
      icon: 'X',
    },
    {
      name: 'Cafe',
      icon: 'X',
    },
  ];

  const navigateToNext = () => {
    navigation.navigate('Telephone');
  };

  const navigateToBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title="Select Tags"
        renderRight={() => {
          return <Text>Skip</Text>;
        }}
        onPressRight={navigateToNext}
      />
      <Text title1 bold style={styles.textPadding}>
        Select Tags related to your Business
      </Text>
      <View style={styles.viewContainer}>
        <TextInput
          onChangeText={search}
          placeholder={'Search Tags'}
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
        data={tags}
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
        <Button style={styles.fotterButtons} onPress={() => navigateToBack()}>
          {'Back'}
        </Button>
        {active === true ? (
          <Button style={styles.fotterButtons} onPress={() => navigateToNext()}>
            {'Next'}
          </Button>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

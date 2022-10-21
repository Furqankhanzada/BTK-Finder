import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, TouchableOpacity, View } from 'react-native';
import remoteConfig from '@react-native-firebase/remote-config';

import { Header, Text, Button, Icon } from '@components';
import { BaseStyle, useTheme } from '@config';
import useAddBusinessStore from '../store/Store';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';

export const FacilitiesScreen = ({
  navigation,
}: StackScreenProps<GlobalParamList>) => {
  const [active, setActive] = useState<boolean>(false);
  const [search, setSearch] = useState<any>();
  const [tags, setTags] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState<any>([]);
  const [items, setItems] = useState(tags);
  const [facilities, setFacilities] = useState([]);

  const sotre = useAddBusinessStore((state: any) => state);
  const setFacility = useAddBusinessStore((state: any) => state.setFacilities);

  console.log('UPDATED STORE IN FACILITY SCREEN', sotre);

  const { colors } = useTheme();

  useEffect(() => {
    const getFacilities = remoteConfig().getValue('facilities');
    getFacilities._value
      ? setFacilities(JSON.parse(getFacilities._value))
      : null;
  }, []);

  const onChange = (facility: any) => {
    console.log('is OnChange Work ?', onChange);

    const isItemSelected = selectedFacilities.some(
      (obj: any) => obj.name === facility.name,
      setActive(true),
    );

    if (!isItemSelected) {
      setSelectedFacilities([...selectedFacilities, facility]);
      setFacility([...selectedFacilities, facility]);
    } else {
      const arr = selectedFacilities.filter(
        (item: any) => item.name === facility.name,
      );
      setSelectedFacilities(arr);
      setFacility(arr);
    }
  };

  const navigateToNext = () => {
    navigation.navigate('Tags');
  };

  const navigateToBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title="Select Facilities"
        renderRight={() => {
          return <Text>Skip</Text>;
        }}
        onPressRight={navigateToNext}
      />

      <View style={styles.contain}>
        <FlatList
          contentContainerStyle={{ paddingVertical: 10 }}
          data={facilities}
          keyExtractor={(item: any, index) => item.id}
          renderItem={({ item }) => {
            const checked = selectedFacilities.some(
              (obj: any) => obj.name === item.name,
            );
            return (
              <TouchableOpacity
                style={[styles.item, { backgroundColor: colors.card }]}
                onPress={() => onChange(item)}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon
                    name={item.icon}
                    color={item?.checked ? colors.primary : colors.text}
                    style={{ marginRight: 10 }}
                    size={15}
                  />
                  <Text
                    body1
                    style={
                      checked
                        ? {
                            color: colors.primary,
                          }
                        : {}
                    }>
                    {item.name}
                  </Text>
                </View>
                {checked && (
                  <Icon name="check" size={14} color={colors.primary} />
                )}
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View style={styles.stickyFooter}>
        <Button style={styles.footerButtons} onPress={() => navigateToBack()}>
          {'Back'}
        </Button>
        {active === true ? (
          <Button style={styles.footerButtons} onPress={() => navigateToNext()}>
            {'Next'}
          </Button>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

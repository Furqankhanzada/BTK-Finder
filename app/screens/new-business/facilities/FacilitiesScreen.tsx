import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, TouchableOpacity, View } from 'react-native';
import remoteConfig from '@react-native-firebase/remote-config';

import { Header, Text, Button, Icon } from '@components';
import { BaseStyle, useTheme } from '@config';
import useAddBusinessStore from '../store/Store';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';
import { useTranslation } from 'react-i18next';

export const FacilitiesScreen = ({
  navigation,
}: StackScreenProps<GlobalParamList>) => {
  const [active, setActive] = useState<boolean>(false);
  const [search, setSearch] = useState<any>();
  const [tags, setTags] = useState([]);
  const [selected, setSelected] = useState<any>([]);
  const [items, setItems] = useState(tags);
  const [facilities, setFacilities] = useState([]);

  // const sotre = useAddBusinessStore((state: any) => state);
  const setFacility = useAddBusinessStore((state: any) => state.setFacilities);

  // console.log('UPDATED STORE IN FACILITY SCREEN', sotre);

  const { colors } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    const getFacilities = remoteConfig().getValue('facilities');
    getFacilities._value
      ? setFacilities(JSON.parse(getFacilities._value))
      : null;
  }, []);

  const onChange = (select: any) => {
    const isItemSelected = selected.some(
      (obj: any) => obj.name === select.name,
      setActive(true),
    );
    if (!isItemSelected) {
      setSelected([...selected, select]);
      setFacility(selected);
    } else {
      const arr = selected.filter((item: any) => item.name != select.name);
      setSelected(arr);
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
            const checked = selected.some((obj: any) => obj.name === item.name);
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

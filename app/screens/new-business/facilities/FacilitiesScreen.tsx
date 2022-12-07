import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, TouchableOpacity, View } from 'react-native';
import remoteConfig from '@react-native-firebase/remote-config';

import { Header, Text, Button, Icon } from '@components';
import { BaseColor, BaseStyle, useTheme } from '@config';
import { StackScreenProps } from '@react-navigation/stack';

import useAddBusinessStore from '../store/Store';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';
import { NewAddBusinessPresentable } from '../models/AddNewBusinessPresentable';
import { useEditBusiness } from '../queries/mutations';
import { useBusiness } from '@screens/businesses/queries/queries';

export const FacilitiesScreen = ({
  navigation,
  route,
}: StackScreenProps<GlobalParamList>) => {
  const [active, setActive] = useState<boolean>(false);
  const [selectedFacilities, setSelectedFacilities] = useState<
    Array<NewAddBusinessPresentable>
  >([]);
  const [facilities, setFacilities] = useState<
    Array<NewAddBusinessPresentable>
  >([]);

  const isEditBusiness = useAddBusinessStore(
    (state: any) => state.isEditBusiness,
  );

  const { data: businessData } = useBusiness(route?.params?.id);
  const { mutate: editFacility } = useEditBusiness(route?.params?.id);

  const setFacility = useAddBusinessStore((state: any) => state.setFacilities);
  const { colors } = useTheme();

  useEffect(() => {
    console.log('Business Data', businessData);
    if (isEditBusiness) {
      setSelectedFacilities(businessData?.facilities);
      setActive(true);
      console.log('Selected Facility', businessData?.facilities);
    }
  }, [businessData?.facilities, isEditBusiness]);

  useEffect(() => {
    const getFacilities = remoteConfig().getValue('facilities');
    getFacilities._value
      ? setFacilities(JSON.parse(getFacilities._value))
      : null;
  }, []);

  const onChange = (facility: NewAddBusinessPresentable) => {
    const isItemSelected = selectedFacilities.some(
      (obj: NewAddBusinessPresentable) => obj.name === facility.name,
      setActive(true),
    );

    if (!isItemSelected) {
      setSelectedFacilities([...selectedFacilities, facility]);
      setFacility([...selectedFacilities, facility]);
    } else {
      const arr = selectedFacilities.filter(
        (item: NewAddBusinessPresentable) => item.name === facility.name,
      );
      setSelectedFacilities(arr);
      setFacility(arr);
    }
  };

  const navigateToNext = () => {
    if (isEditBusiness) {
      editFacility({ facilities: selectedFacilities });
      navigation.navigate('EditBusiness', { id: businessData?._id });
    } else {
      navigation.navigate('Tags');
    }
  };

  const navigateToBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={isEditBusiness ? 'Update Facilites' : 'Select Facilities'}
        renderRight={() => {
          return isEditBusiness ? null : <Text>Skip</Text>;
        }}
        onPressRight={navigateToNext}
        renderLeft={() => {
          return isEditBusiness ? (
            <Icon
              name="arrow-left"
              size={20}
              color="#5dade2"
              enableRTL={true}
            />
          ) : null;
        }}
        onPressLeft={() => {
          navigation.navigate('EditBusiness', { id: businessData?._id });
        }}
      />

      <View style={styles.contain}>
        <FlatList
          contentContainerStyle={styles.flatlistConatiner}
          data={facilities}
          keyExtractor={(item: object, index: any) => {
            return index;
          }}
          renderItem={({ item, index }: any) => {
            const checked = selectedFacilities.some(
              (obj: NewAddBusinessPresentable) => obj.name === item.name,
            );

            return (
              <TouchableOpacity
                key={index}
                style={[styles.item, { backgroundColor: colors.card }]}
                onPress={() => onChange(item)}>
                <View style={styles.facilityView}>
                  <Icon
                    name={item.icon}
                    color={item?.checked ? colors.primary : colors.text}
                    style={styles.facilityViewIcon}
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
      <View
        style={isEditBusiness ? styles.stickyFooterEdit : styles.stickyFooter}>
        {isEditBusiness ? null : (
          <Button style={styles.footerButtons} onPress={navigateToBack}>
            {'Back'}
          </Button>
        )}

        <Button
          style={[
            styles.footerButtons,
            !active ? { backgroundColor: BaseColor.grayColor } : null,
          ]}
          title="submit"
          onPress={() => navigateToNext()}>
          {isEditBusiness ? 'Update Facilities' : 'Next'}
        </Button>
      </View>
    </SafeAreaView>
  );
};

import React, { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import remoteConfig from '@react-native-firebase/remote-config';

import { Header, Text, Button, Icon } from '@components';
import { BaseStyle, useTheme } from '@config';
import { useBusiness } from '@screens/businesses/queries/queries';
import { Facility } from '@screens/businesses/models/BusinessPresentable';

import { styles } from '../styles/styles';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { useEditBusiness } from '../queries/mutations';
import useAddBusinessStore from '../store/Store';

export const FacilitiesScreen = (props: StackScreenProps<GlobalParamList>) => {
  const { navigation, route } = props;
  const { colors } = useTheme();
  const isEditBusiness = route?.params?.id;

  const { data: businessData } = useBusiness(route?.params?.id);
  const { mutate: editFacility } = useEditBusiness(route?.params?.id);

  const storeFacilities = useAddBusinessStore((state: any) => state.facilities);
  const setStoreFacility = useAddBusinessStore(
    (state: any) => state.setFacilities,
  );

  const [facilities, setFacilities] = useState<any>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<any>([]);

  useEffect(() => {
    if (isEditBusiness) {
      setSelectedFacilities(businessData?.facilities);
    } else if (storeFacilities) {
      setSelectedFacilities(storeFacilities);
    }
  }, [businessData?.facilities, isEditBusiness, storeFacilities]);

  useEffect(() => {
    const getFacilities = remoteConfig().getValue('facilities');
    getFacilities._value
      ? setFacilities(JSON.parse(getFacilities._value))
      : null;
  }, []);

  const onChange = (facility: { name: string }) => {
    const isItemSelected = selectedFacilities?.some(
      (obj: Facility) => obj.name === facility.name,
    );

    if (!isItemSelected) {
      setSelectedFacilities([...selectedFacilities, facility]);
    } else {
      const arr = selectedFacilities.filter(
        (item: Facility) => item.name !== facility.name,
      );
      setSelectedFacilities(arr);
    }
  };

  const navigateToNext = () => {
    if (isEditBusiness) {
      editFacility({ facilities: selectedFacilities });
      navigation.navigate('EditBusiness', { id: businessData?._id });
    } else {
      setStoreFacility(selectedFacilities);
      navigation.navigate('Tags');
    }
  };

  const navigateToBack = () => {
    navigation.goBack();
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={isEditBusiness ? 'Edit Facilites' : 'Select Facilities'}
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
        onPressLeft={navigateToBack}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{ flex: 1 }}>
        <View style={styles.contain}>
          <FlatList
            data={facilities}
            keyExtractor={(item: object, index: any) => {
              return index;
            }}
            renderItem={({ item, index }: any) => {
              const checked = selectedFacilities?.some(
                (obj: Facility) => obj.name === item.name,
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
          style={
            isEditBusiness ? styles.stickyFooterEdit : styles.stickyFooter
          }>
          {isEditBusiness ? null : (
            <Button style={styles.footerButtons} onPress={navigateToBack}>
              {'Back'}
            </Button>
          )}

          <Button
            style={styles.footerButtons}
            title="submit"
            onPress={() => navigateToNext()}>
            {isEditBusiness ? 'Update Facilities' : 'Next'}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

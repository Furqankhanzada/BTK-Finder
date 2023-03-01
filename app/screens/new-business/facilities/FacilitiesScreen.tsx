import React, { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { useRemoteConfig } from '@hooks';
import { Header, Text } from '@components';
import { BaseStyle } from '@config';
import { useBusiness } from '@screens/businesses/queries/queries';
import { Facility } from '@screens/businesses/models/BusinessPresentable';

import { NewBusinessParamList } from 'navigation/models/NewBusinessParamList';
import { useEditBusiness } from '../apis/mutations';
import useAddBusinessStore, {
  BusinessStoreActions,
  BusinessStoreTypes,
} from '../store/Store';
import { NavigationButtons } from '../components/NavigationButtons';
import { SelectItem } from '../components/SelectItem';
import ArrowBack from '../components/ArrowBack';

export default function FacilitiesScreen(
  props: StackScreenProps<NewBusinessParamList, 'Facilities'>,
) {
  const { navigation, route } = props;
  const isEditBusiness = route?.params?.businessId;
  const remoteConfig = useRemoteConfig();

  const { data: businessData } = useBusiness(route.params?.businessId);
  const { mutate: editFacility, isLoading } = useEditBusiness(
    route?.params?.businessId ?? '',
  );

  const storeFacilities = useAddBusinessStore(
    (state: BusinessStoreTypes) => state.facilities,
  );
  const setStoreFacility = useAddBusinessStore(
    (state: BusinessStoreActions) => state.setFacilities,
  );

  const [selectedFacilities, setSelectedFacilities] = useState<Facility[]>([]);

  useEffect(() => {
    if (isEditBusiness) {
      setSelectedFacilities(businessData?.facilities ?? []);
    } else if (storeFacilities) {
      setSelectedFacilities(storeFacilities);
    }
  }, [businessData?.facilities, isEditBusiness, storeFacilities]);

  const onChange = (facility: Facility) => {
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

  const onSubmit = () => {
    if (isEditBusiness) {
      editFacility(
        { facilities: selectedFacilities },
        {
          onSuccess() {
            navigation.goBack();
          },
        },
      );
    } else {
      setStoreFacility(selectedFacilities);
      navigation.navigate('Tags');
    }
  };

  const navigateToBack = () => {
    if (isEditBusiness) {
      navigation.goBack();
    }
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={isEditBusiness ? 'Edit Facilites' : 'Select Facilities'}
        renderLeft={() => <ArrowBack show={!!isEditBusiness} />}
        onPressLeft={navigateToBack}
      />

      <KeyboardAvoidingView
        behavior={Platform.select({ android: undefined, ios: 'padding' })}
        keyboardVerticalOffset={offsetKeyboard}
        style={styles.keyboardAvoidView}>
        <FlatList
          contentContainerStyle={styles.container}
          data={remoteConfig.facilities}
          keyExtractor={(item, index) => {
            return `${index}-${item.name}`;
          }}
          ListHeaderComponent={() => (
            <Text title1 bold>
              Select the facilities that you provide{' '}
              <Text body1>(optional)</Text>
            </Text>
          )}
          renderItem={({ item, index }) => {
            const checked = selectedFacilities?.some(
              (obj: Facility) => obj.name === item.name,
            );

            return (
              <SelectItem
                key={`${index + item.name}`}
                onPress={() => onChange(item)}
                text={item.name}
                checked={checked}
                icon={item.icon}
              />
            );
          }}
        />

        <NavigationButtons
          onSubmit={onSubmit}
          loading={isLoading}
          disabled={isLoading}
          isEdit={!!isEditBusiness}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidView: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    marginTop: 10,
    paddingBottom: 50,
  },
});

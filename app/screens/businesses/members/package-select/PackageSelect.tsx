import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { BaseStyle, useTheme } from '@config';
import { Header, SafeAreaView, Icon, Button } from '@components';

import Products from '@screens/businesses/components/Products';
import { useBusiness } from '@screens/businesses/queries/queries';
import { MembersStackParamList } from 'navigation/models/BusinessDetailBottomTabParamList';
import useMemberStore from '../store/Store';

export default function PackageSelect(
  props: StackScreenProps<MembersStackParamList, 'PackageSelect'>,
) {
  const { navigation, route } = props;
  const { businessId } = route.params;
  const { data: business } = useBusiness(businessId);
  const { colors } = useTheme();
  const { setSelectedPackage } = useMemberStore();

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title="Select Package"
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

      <Products
        onProductPress={(item) => {
          setSelectedPackage(item?._id);
        }}
        business={business}
        selectionMode={true}
      />

      <View style={styles.buttonContainer}>
        <Button full onPress={() => navigation.goBack()}>
          Done
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
});

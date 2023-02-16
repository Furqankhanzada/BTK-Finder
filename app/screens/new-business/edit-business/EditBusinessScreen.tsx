import React from 'react';
import { ScrollView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Header, SafeAreaView, Icon, Loading } from '@components';
import { BaseStyle } from '@config';

import ListItem from './components/ListItem/ListItem';
import { useBusiness } from '@screens/businesses/queries/queries';
import { EditBusinessStackParamList } from 'navigation/models/EditBusinessStackParamList';

export default function EditBusinessScreen(
  props: StackScreenProps<EditBusinessStackParamList, 'EditBusiness'>,
) {
  const { navigation, route } = props;
  const { isLoading, data: businessData } = useBusiness(
    route?.params?.businessId,
  );

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Loading loading={isLoading} />
      <Header
        title={'Edit Business'}
        renderLeft={() => {
          return (
            <Icon
              name="arrow-left"
              size={20}
              color="#5dade2"
              enableRTL={true}
            />
          );
        }}
        onPressLeft={() => navigation.goBack()}
      />
      <ScrollView>
        <ListItem
          title="Name"
          businessDetail={businessData?.name}
          onPress={() => {
            navigation.navigate('Edit', {
              screen: 'Name',
              params: { businessId: businessData?._id },
            });
          }}
        />
        <ListItem
          title="Description"
          businessDetail={businessData?.description}
          onPress={() => {}}
        />
        <ListItem
          title="Category"
          businessDetail={businessData?.category}
          onPress={() => {}}
        />
        <ListItem
          title="Facilities"
          businessDetail={
            businessData?.facilities?.length
              ? businessData.facilities[0].name
              : '-'
          }
          onPress={() => {}}
        />
        <ListItem
          title="Tags"
          businessDetail={businessData?.tags ? businessData?.tags[0] : '-'}
          onPress={() => {}}
        />
        <ListItem
          title="Telephone"
          businessDetail={businessData?.telephone}
          onPress={() => {}}
        />
        <ListItem
          title="Email"
          businessDetail={businessData?.email}
          onPress={() => {}}
        />
        <ListItem
          title="Website"
          businessDetail={businessData?.website}
          onPress={() => {}}
        />
        <ListItem
          title="Address"
          businessDetail={businessData?.address}
          onPress={() => {}}
        />
        <ListItem
          title="OpenHours"
          businessDetail={
            businessData?.openHours?.length
              ? `${businessData?.openHours[0]?.day} ${businessData?.openHours[0]?.from} To ${businessData?.openHours[0]?.to}`
              : '-'
          }
          onPress={() => {}}
        />
        <ListItem
          title="Pricing"
          businessDetail={
            businessData?.priceRange?.from && businessData?.priceRange?.to
              ? `${businessData?.priceRange?.from} To ${businessData?.priceRange?.to}`
              : '-'
          }
          onPress={() => {}}
        />
        <ListItem
          title="Gallery"
          businessDetail={businessData?.thumbnail ? 'Gallery' : '-'}
          onPress={() => {}}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

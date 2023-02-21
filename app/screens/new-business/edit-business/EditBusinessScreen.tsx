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
          text={businessData?.name}
          onPress={() => {
            navigation.navigate('Edit', {
              screen: 'Name',
              params: { businessId: businessData?._id },
            });
          }}
        />
        <ListItem
          title="Description"
          text={businessData?.description}
          onPress={() => {
            navigation.navigate('Edit', {
              screen: 'Description',
              params: { businessId: businessData?._id },
            });
          }}
        />
        <ListItem
          title="Category"
          text={businessData?.category}
          onPress={() => {
            navigation.navigate('Edit', {
              screen: 'CategorySelect',
              params: { businessId: businessData?._id },
            });
          }}
        />
        <ListItem
          title="Facilities"
          text={
            businessData?.facilities?.length
              ? businessData.facilities[0].name
              : ''
          }
          onPress={() => {
            navigation.navigate('Edit', {
              screen: 'Facilities',
              params: { businessId: businessData?._id },
            });
          }}
        />
        <ListItem
          title="Tags"
          text={businessData?.tags ? businessData?.tags[0] : ''}
          onPress={() => {
            navigation.navigate('Edit', {
              screen: 'Tags',
              params: { businessId: businessData?._id },
            });
          }}
        />
        <ListItem
          title="Telephone"
          text={businessData?.telephone}
          onPress={() => {
            navigation.navigate('Edit', {
              screen: 'Telephone',
              params: { businessId: businessData?._id },
            });
          }}
        />
        <ListItem
          title="Email"
          text={businessData?.email}
          onPress={() => {
            navigation.navigate('Edit', {
              screen: 'Email',
              params: { businessId: businessData?._id },
            });
          }}
        />
        <ListItem
          title="Website"
          text={businessData?.website}
          onPress={() => {
            navigation.navigate('Edit', {
              screen: 'Website',
              params: { businessId: businessData?._id },
            });
          }}
        />
        <ListItem
          title="Address"
          text={businessData?.address}
          onPress={() => {
            navigation.navigate('Edit', {
              screen: 'Address',
              params: { businessId: businessData?._id },
            });
          }}
        />
        <ListItem
          title="OpenHours"
          text={
            businessData?.openHours?.length
              ? `${businessData?.openHours[0]?.day} ${businessData?.openHours[0]?.from} To ${businessData?.openHours[0]?.to}`
              : ''
          }
          onPress={() => {}}
        />
        <ListItem
          title="Pricing"
          text={
            businessData?.priceRange?.from && businessData?.priceRange?.to
              ? `${businessData?.priceRange?.from} To ${businessData?.priceRange?.to}`
              : ''
          }
          onPress={() => {}}
        />
        <ListItem
          title="Gallery"
          text={businessData?.thumbnail ? 'Gallery' : ''}
          onPress={() => {}}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

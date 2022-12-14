import React from 'react';
import { ScrollView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Header, SafeAreaView, Icon, ListItem, Loading } from '@components';
import { BaseStyle } from '@config';

import { useBusiness } from '@screens/businesses/queries/queries';
import { GlobalParamList } from 'navigation/models/GlobalParamList';

export default function EditBusinessScreen(
  props: StackScreenProps<GlobalParamList, 'EditBusiness'>,
) {
  const { navigation, route } = props;
  const { isLoading, data: businessData } = useBusiness(route?.params?.id);

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
        onPressLeft={() => {
          navigation.navigate('MyBusinesses');
        }}
      />
      <ScrollView>
        <ListItem
          title="Name"
          businessDetail={businessData?.name}
          onPress={() => {
            navigation.navigate('EditBusinessStack', {
              screen: 'Name',
              params: { id: businessData?._id },
            });
          }}
        />
        <ListItem
          title="Description"
          businessDetail={businessData?.description}
          onPress={() => {
            navigation.navigate('EditBusinessStack', {
              screen: 'Description',
              params: { id: businessData?._id },
            });
          }}
        />
        <ListItem
          title="Category"
          businessDetail={businessData?.category}
          onPress={() => {
            navigation.navigate('EditBusinessStack', {
              screen: 'Category',
              params: { id: businessData?._id },
            });
          }}
        />
        <ListItem
          title="Facilities"
          businessDetail={
            businessData?.facilities?.length
              ? businessData.facilities[0].name
              : 'Empty'
          }
          onPress={() => {
            navigation.navigate('EditBusinessStack', {
              screen: 'Facilities',
              params: { id: businessData?._id },
            });
          }}
        />
        <ListItem
          title="Tags"
          businessDetail={businessData?.tags ? businessData?.tags[0] : 'Empty'}
          onPress={() => {
            navigation.navigate('EditBusinessStack', {
              screen: 'Tags',
              params: { id: businessData?._id },
            });
          }}
        />
        <ListItem
          title="Telephone"
          businessDetail={businessData?.telephone}
          onPress={() => {
            navigation.navigate('EditBusinessStack', {
              screen: 'Telephone',
              params: { id: businessData?._id },
            });
          }}
        />
        <ListItem
          title="Email"
          businessDetail={businessData?.email}
          onPress={() => {
            navigation.navigate('EditBusinessStack', {
              screen: 'Email',
              params: { id: businessData?._id },
            });
          }}
        />
        <ListItem
          title="Website"
          businessDetail={businessData?.website}
          onPress={() => {
            navigation.navigate('EditBusinessStack', {
              screen: 'Website',
              params: { id: businessData?._id },
            });
          }}
        />
        <ListItem
          title="Address"
          businessDetail={businessData?.address}
          onPress={() => {
            navigation.navigate('EditBusinessStack', {
              screen: 'Address',
              params: { id: businessData?._id },
            });
          }}
        />
        <ListItem
          title="OpenHours"
          businessDetail={
            businessData?.openHours?.length
              ? `${businessData?.openHours[0]?.day} ${businessData?.openHours[0]?.from} To ${businessData?.openHours[0]?.to}`
              : 'Empty'
          }
          onPress={() => {
            navigation.navigate('EditBusinessStack', {
              screen: 'Hours',
              params: { id: businessData?._id },
            });
          }}
        />
        <ListItem
          title="Price"
          businessDetail={
            businessData?.priceRange?.from && businessData?.priceRange?.to
              ? `${businessData?.priceRange?.from} To ${businessData?.priceRange?.to}`
              : 'Empty'
          }
          onPress={() => {
            navigation.navigate('EditBusinessStack', {
              screen: 'Price',
              params: { id: businessData?._id },
            });
          }}
        />
        <ListItem
          title="Gallery"
          businessDetail={'Gallery'}
          onPress={() => {
            navigation.navigate('EditBusinessStack', {
              screen: 'Gallery',
              params: { id: businessData?._id },
            });
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

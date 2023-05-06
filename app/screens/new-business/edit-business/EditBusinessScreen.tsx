import React from 'react';
import { ScrollView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import NumberFormat from 'react-number-format';

import { Header, SafeAreaView, Icon, Loading, Text } from '@components';
import { BaseStyle } from '@config';

import ListItem from './components/ListItem/ListItem';
import { useBusiness } from '@screens/businesses/queries/queries';
import { EditBusinessStackParamList } from 'navigation/models/EditBusinessStackParamList';

export default function EditBusinessScreen(
  props: StackScreenProps<EditBusinessStackParamList, 'EditBusiness'>,
) {
  const { navigation, route } = props;
  const { isLoading, data: business } = useBusiness(route?.params?.businessId);
  if (isLoading || !business) {
    return <Loading loading={isLoading} />;
  }
  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
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
          text={business.name}
          onPress={() => {
            navigation.navigate('Edit', {
              screen: 'Name',
              params: { businessId: business._id },
            });
          }}
        />
        <ListItem
          title="Description"
          text={business.description}
          onPress={() => {
            navigation.navigate('Edit', {
              screen: 'Description',
              params: { businessId: business._id },
            });
          }}
        />
        <ListItem
          title="Category"
          text={business.category}
          onPress={() => {
            navigation.navigate('Edit', {
              screen: 'CategorySelect',
              params: { businessId: business._id },
            });
          }}
        />
        <ListItem
          title="Facilities"
          text={business.facilities?.length ? business.facilities[0].name : ''}
          onPress={() => {
            navigation.navigate('Edit', {
              screen: 'Facilities',
              params: { businessId: business._id },
            });
          }}
        />
        <ListItem
          title="Tags"
          text={business.tags ? business.tags[0] : ''}
          onPress={() => {
            navigation.navigate('Edit', {
              screen: 'Tags',
              params: { businessId: business._id },
            });
          }}
        />
        <ListItem
          title="Telephone"
          text={business.telephone}
          onPress={() => {
            navigation.navigate('Edit', {
              screen: 'Telephone',
              params: { businessId: business._id },
            });
          }}
        />
        <ListItem
          title="Email"
          text={business.email}
          onPress={() => {
            navigation.navigate('Edit', {
              screen: 'Email',
              params: { businessId: business._id },
            });
          }}
        />
        <ListItem
          title="Website"
          text={business.website}
          onPress={() => {
            navigation.navigate('Edit', {
              screen: 'Website',
              params: { businessId: business._id },
            });
          }}
        />
        <ListItem
          title="Address"
          text={business.address}
          onPress={() => {
            navigation.navigate('Edit', {
              screen: 'Address',
              params: { businessId: business._id },
            });
          }}
        />
        <ListItem
          title="Open Hours"
          text={
            business.openHours?.length
              ? `${business.openHours[0]?.day} ${business.openHours[0]?.from} To ${business.openHours[0]?.to}`
              : ''
          }
          onPress={() => {
            navigation.navigate('Edit', {
              screen: 'OpenHours',
              params: { businessId: business?._id },
            });
          }}
        />
        <ListItem
          title="Pricing"
          renderRightCustom={
            <Text body1 numberOfLines={1}>
              {business?.priceRange?.from && business.priceRange.to ? (
                <Text body1 numberOfLines={1}>
                  <NumberFormat
                    value={business.priceRange?.from}
                    displayType="text"
                    thousandSeparator=","
                    renderText={(value) => value}
                  />{' '}
                  To{' '}
                  <NumberFormat
                    value={business.priceRange?.to}
                    displayType="text"
                    thousandSeparator=","
                    renderText={(value) => value}
                  />
                </Text>
              ) : (
                <Text body1 numberOfLines={1}>
                  {' '}
                </Text>
              )}
            </Text>
          }
          onPress={() => {
            navigation.navigate('Edit', {
              screen: 'Pricing',
              params: { businessId: business._id },
            });
          }}
        />
        <ListItem
          title="Gallery"
          text={business.thumbnail ? 'Gallery' : ''}
          onPress={() => {
            navigation.navigate('Edit', {
              screen: 'Gallery',
              params: { businessId: business._id },
            });
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

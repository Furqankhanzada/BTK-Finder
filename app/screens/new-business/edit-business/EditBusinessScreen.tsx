import React from 'react';
import { ScrollView } from 'react-native';

import { BaseStyle } from '@config';
import { Header, SafeAreaView, Icon, ListItem, Loading } from '@components';
import { useBusiness } from '@screens/businesses/queries/queries';

export default function EditBusinessScreen({ navigation, route }: any) {
  const { isLoading, data: businessData } = useBusiness(route.params.id);

  console.log('What is business Form Data', businessData);

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
          navigation.goBack();
        }}
      />
      <ScrollView>
        <ListItem
          title="Name"
          businessDetail={businessData?.name}
          onPress={() => {
            navigation.navigate('NewBusinessStack', {
              screen: 'Name',
            });
          }}
        />
        <ListItem
          title="Description"
          businessDetail={businessData?.description}
          onPress={() => {
            navigation.navigate('NewBusinessStack', {
              screen: 'Description',
            });
          }}
        />
        <ListItem
          title="Category"
          businessDetail={businessData?.category}
          onPress={() => {
            navigation.navigate('NewBusinessStack', {
              screen: 'Category',
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
            navigation.navigate('NewBusinessStack', {
              screen: 'Facilities',
            });
          }}
        />
        <ListItem
          title="Tags"
          businessDetail={businessData?.tags[0]}
          onPress={() => {
            navigation.navigate('NewBusinessStack', {
              screen: 'Tags',
            });
          }}
        />
        <ListItem
          title="Telephone"
          businessDetail={businessData?.telephone}
          onPress={() => {
            navigation.navigate('NewBusinessStack', {
              screen: 'Telephone',
            });
          }}
        />
        <ListItem
          title="Email"
          businessDetail={businessData?.email}
          onPress={() => {
            navigation.navigate('NewBusinessStack', {
              screen: 'Email',
            });
          }}
        />
        <ListItem
          title="Website"
          businessDetail={businessData?.website}
          onPress={() => {
            navigation.navigate('NewBusinessStack', {
              screen: 'Website',
            });
          }}
        />
        <ListItem
          title="Established"
          businessDetail={businessData?.established}
          onPress={() => {
            navigation.navigate('NewBusinessStack', {
              screen: 'Established',
            });
          }}
        />
        <ListItem
          title="Address"
          businessDetail={businessData?.address}
          onPress={() => {
            navigation.navigate('NewBusinessStack', {
              screen: 'Address',
            });
          }}
        />
        <ListItem
          title="OpenHours"
          businessDetail={`${businessData?.openHours[0]?.day} ${businessData?.openHours[0]?.from} To ${businessData?.openHours[0]?.to}`}
          onPress={() => {
            navigation.navigate('NewBusinessStack', {
              screen: 'Hours',
            });
          }}
        />
        <ListItem
          title="Price"
          businessDetail={`${businessData?.priceRange?.from} To ${businessData?.priceRange?.to}}`}
          onPress={() => {
            navigation.navigate('NewBusinessStack', {
              screen: 'Price',
            });
          }}
        />
        <ListItem
          title="Gallery"
          businessDetail={'Gallery'}
          onPress={() => {
            navigation.navigate('NewBusinessStack', {
              screen: 'Gallery',
            });
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

import React from 'react';
import { View, FlatList } from 'react-native';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import { BaseStyle } from '@config';
import { BaseColor } from '@config';
import { Header, SafeAreaView, Icon, ListItem } from '@components';

export default function EditBusinessScreen({ navigation }: any) {
  const stateProps = useSelector(({ businesses }: any) => {
    return {
      editBusiness: businesses.editBusiness,
      editBusinessData: businesses.editBusinessData,
      businessFormData: businesses.businessFormData,
    };
  });
  const businessFormData = stateProps?.editBusiness
    ? stateProps?.editBusinessData
    : stateProps?.businessFormData;

  console.log('What is business Form Data', businessFormData);

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
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <FlatList
        overScrollMode={'never'}
        scrollEventThrottle={16}
        data={[businessFormData]}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          return (
            <View>
              <ListItem
                title="Name"
                businessDetail={item.name}
                onPress={() => {
                  navigation.navigate('Name');
                }}
              />
              <ListItem
                title="Description"
                businessDetail={item.description}
                onPress={() => {
                  navigation.navigate('Discription');
                }}
              />
              <ListItem
                title="Category"
                businessDetail={item.category}
                onPress={() => {
                  navigation.navigate('Category');
                }}
              />
              <ListItem
                title="Facilities"
                businessDetail={
                  item.facilities.length ? item.facilities[0].name : 'Empty'
                }
                onPress={() => {
                  navigation.navigate('Facilities');
                }}
              />
              <ListItem
                title="Tags"
                businessDetail={item.tags[0]}
                onPress={() => {
                  navigation.navigate('Tags');
                }}
              />
              <ListItem
                title="Telephone"
                businessDetail={item.telephone}
                onPress={() => {
                  navigation.navigate('Telephone');
                }}
              />
              <ListItem
                title="Email"
                businessDetail={item.email}
                onPress={() => {
                  navigation.navigate('Email');
                }}
              />
              <ListItem
                title="Website"
                businessDetail={item.website}
                onPress={() => {
                  navigation.navigate('Website');
                }}
              />
              <ListItem
                title="Established"
                businessDetail={item.established}
                onPress={() => {
                  navigation.navigate('Established');
                }}
              />
              <ListItem
                title="Address"
                businessDetail={item.address}
                onPress={() => {
                  navigation.navigate('Address');
                }}
              />
              <ListItem
                title="OpenHours"
                businessDetail={`${item.openHours[0].day} ${item.openHours[0].from} To ${item.openHours[0].to}`}
                onPress={() => {
                  navigation.navigate('Hours');
                }}
              />
              <ListItem
                title="Price"
                businessDetail={`${item.priceRange.from} To ${item.priceRange.to}}`}
                onPress={() => {
                  navigation.navigate('Price');
                }}
              />
              <ListItem
                title="Gallery"
                businessDetail={'Gallery'}
                onPress={() => {
                  navigation.navigate('Gallery');
                }}
              />
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentTitle: {
    alignItems: 'flex-start',
    width: '100%',
    height: 32,
    justifyContent: 'center',
  },
  contain: {
    flex: 1,
    padding: 20,
  },
  textInput: {
    height: 56,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    padding: 10,
    width: '100%',
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
});

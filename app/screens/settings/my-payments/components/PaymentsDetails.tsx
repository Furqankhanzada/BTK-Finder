import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@config';
import { Header, SafeAreaView, Icon, Text, Tag } from '@components';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { SettingsParamList } from 'navigation/models/SettingsParamList';
import { StackScreenProps } from '@react-navigation/stack';
import { useState, useEffect } from 'react';
// import axios from 'axios';
import axiosApiInstance from '../../../../interceptor/axios-interceptor';

function PaymentsDetails({
  navigation,
  route,
}: StackScreenProps<SettingsParamList, 'Invoices'>) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const { businessId } = route.params || {};
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axiosApiInstance({
      method: 'GET',
      url: `https://dev-apis.explorebtk.com/api/v1/invoices/`,
    })
      .then((response: any) => {
        console.log('response', response);
        setInvoiceData(response?.data);
        setLoading(false);
      })
      .catch((error: any) => {
        console.log('error', error?.response);
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView>
      <Header
        title={t('Payment Details')}
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
      <SafeAreaView>
        <FlatList
          style={[styles.tagsContainer]}
          horizontal={true}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <Tag
                rate
                style={[
                  styles.item,
                  {
                    backgroundColor: colors.primary,
                  },
                ]}>
                All
              </Tag>
              <Tag
                rate
                style={[
                  styles.item,
                  {
                    backgroundColor: colors.primary,
                  },
                ]}>
                Paid
              </Tag>
              <Tag
                rate
                style={[
                  styles.item,
                  {
                    backgroundColor: colors.primary,
                  },
                ]}>
                Unpaid
              </Tag>
            </View>
          }
          data={undefined}
          renderItem={undefined}
        />
      </SafeAreaView>
      <ScrollView>
        {/* {
    "_id": "657afc8cc43552c232c8d81e",
    "ownerId": "656c30b607a1e22ea9815d10",
    "amount": 7000,
    "invoiceDueAt": "2024-01-01T18:59:59.999Z",
    "package": {
        "name": "Weight Training",
        "id": "cmVhY3Rpb24vY2F0YWxvZ1Byb2R1Y3Q6WlFmYWpGR1FxUGhUOXJ0QUQ="
    },
    "business": {
        "_id": "6401d1445d381e3bcd4b47e7",
        "name": "Gym Metrix",
        "telephone": "03325808521",
        "email": "gym@matrix.com",
        "website": "https://explorebtk.gym.com",
        "address": "address of gym"
    },
    "status": "unpaid",
    "createdAt": "2023-12-14T13:01:00.920Z",
    "updatedAt": "2023-12-18T12:09:00.489Z",
    "__v": 0,
    "id": "657afc8cc43552c232c8d81e"
} */}
        <SafeAreaView style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.heading}>
              {t('Invoice ID')}: {businessId}
            </Text>
          </View>
        </SafeAreaView>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  tagsContainer: {
    marginBottom: 10,
    paddingLeft: 20,
  },
  productsContainer: {
    marginTop: 15,
  },
  productList: {
    marginTop: 10,
  },
  item: {
    marginRight: 5,
  },
  listEmptyText: {
    textAlign: 'center',
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    marginHorizontal: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 5,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 16,
    alignSelf: 'center',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10,
    width: '95%',
    marginBottom: 20,
    marginTop: 5,
  },
  text: {
    fontWeight: '900',
  },
  listHeader: {
    flexDirection: 'row',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PaymentsDetails;

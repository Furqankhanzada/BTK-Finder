import React from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BaseStyle, useTheme } from '@config';
import { Header, SafeAreaView, Icon, Text, Tag } from '@components';
import { SettingsParamList } from 'navigation/models/SettingsParamList';
import { StackScreenProps } from '@react-navigation/stack';
import { useInvoices } from '@screens/businesses/queries/queries';
import { useRoute, RouteProp } from '@react-navigation/native';

type PaymentsDetailsScreenProps = StackScreenProps<
  SettingsParamList,
  'Invoices'
>;

export default function PaymentsDetails({
  navigation,
}: PaymentsDetailsScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const route = useRoute<RouteProp<SettingsParamList, 'Invoices'>>();
  const businessId = route.params?.businessId;
  const { data: invoices, isLoading, isError } = useInvoices(businessId);

  console.log('businessId:', businessId);
  console.log('invoices:', invoices);

  if (isLoading) {
    return (
      <SafeAreaView style={BaseStyle.safeAreaView}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={BaseStyle.safeAreaView}>
        <Text>Error loading invoices</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={t('Payment Details')}
        renderLeft={() => (
          <Icon
            name="arrow-left"
            size={20}
            color={colors.primary}
            enableRTL={true}
          />
        )}
        onPressLeft={() => navigation.goBack()}
      />
      <FlatList
        style={styles.tagsContainer}
        horizontal={true}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Tag rate style={styles.item}>
              All
            </Tag>
            <Tag rate style={styles.item}>
              Paid
            </Tag>
            <Tag rate style={styles.item}>
              Unpaid
            </Tag>
          </View>
        }
        data={invoices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.invoiceItem}>
            <Text>Amount: {item.amount}</Text>
            <Text>ID: {item.id}</Text>
            {/* Add more details if needed */}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tagsContainer: {
    marginBottom: 10,
    paddingLeft: 20,
  },
  item: {
    marginRight: 5,
  },
  listHeader: {
    flexDirection: 'row',
  },
  invoiceItem: {
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
    marginTop: 15,
    marginRight: 15,
  },
});

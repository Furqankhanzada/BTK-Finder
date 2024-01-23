import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BaseStyle, useTheme } from '@config';
import { Header, Icon, SafeAreaView, Tag, Text } from '@components';
import { SettingsParamList } from '../../../../navigation/models/SettingsParamList';
import { StackScreenProps } from '@react-navigation/stack';
import {
  InvoiceStatus,
  useInvoices,
} from '@screens/businesses/queries/queries';
import { RouteProp, useRoute } from '@react-navigation/native';

type PaymentsDetailsScreenProps = StackScreenProps<
  SettingsParamList,
  'Invoices'
>;

export default function InvoicesScreen({
  navigation,
}: PaymentsDetailsScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const route = useRoute<RouteProp<SettingsParamList, 'Invoices'>>();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const businessId = route.params?.businessId;
  const { data: invoices, refetch } = useInvoices(
    businessId,
    InvoiceStatus.UNPAID,
  );

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };
  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={t('Invoices')}
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
        refreshControl={
          <RefreshControl
            title="Pull to refresh"
            titleColor={colors.text}
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={isRefreshing}
            onRefresh={onRefresh}
          />
        }
        style={styles.container}
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
  container: {
    padding: 20,
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
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10,
    width: '100%',
    marginTop: 15,
  },
});

import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { StackScreenProps } from '@react-navigation/stack';
import { RouteProp, useRoute } from '@react-navigation/native';

import { BaseColor, BaseStyle, useTheme } from '@config';
import { Header, Icon, SafeAreaView, Tag, Text } from '@components';
import { SettingsParamList } from 'navigation/models/SettingsParamList';
import {
  useInvoices,
  InvoiceStatus,
} from '@screens/businesses/queries/queries';
import { MyMembershipsStackParamList } from 'navigation/models/MyMembershipsStackParamList';

const getStatusColor = (status: InvoiceStatus) => {
  switch (status) {
    case InvoiceStatus.PAID:
      return BaseColor.greenColor;
    case InvoiceStatus.UNPAID:
      return BaseColor.redColor;
    case InvoiceStatus.PENDING:
      return BaseColor.orangeColor;
    default:
      return 'transparent';
  }
};

type InvoicesScreenProps = StackScreenProps<
  MyMembershipsStackParamList,
  'Invoices'
>;
const filters = Object.values(InvoiceStatus).filter(
  (filter) => filter !== InvoiceStatus.PENDING,
);
type Filters = typeof filters[number];
export default function InvoicesScreen({ navigation }: InvoicesScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const route = useRoute<RouteProp<SettingsParamList, 'Invoices'>>();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<Filters>();

  const { data: invoices, refetch } = useInvoices(
    route.params?.businessId,
    selectedFilter ? selectedFilter : undefined,
  );

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const filterInvoices = (filter: Filters | 'all') => {
    setSelectedFilter(filter !== 'all' ? filter : undefined);
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
            <Tag
              onPress={() => filterInvoices('all')}
              rate
              style={[
                styles.headerFilterItem,
                {
                  backgroundColor: !selectedFilter
                    ? colors.primary
                    : colors.primaryLight,
                },
              ]}>
              All
            </Tag>
            {filters.map((filter) => (
              <Tag
                key={filter}
                onPress={() => filterInvoices(filter)}
                rate
                style={[
                  styles.headerFilterItem,
                  {
                    backgroundColor:
                      filter === selectedFilter
                        ? colors.primary
                        : colors.primaryLight,
                  },
                ]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Tag>
            ))}
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.emptyList} semibold textAlign="center">
            No {selectedFilter} invoices found
          </Text>
        }
        data={invoices}
        extraData={selectedFilter}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.invoiceItem,
              {
                backgroundColor: colors.background,
                borderBottomColor: getStatusColor(item.status),
              },
            ]}>
            <Text style={styles.item}>
              Invoice ID:
              <Text bold> {item.id} </Text>
            </Text>
            <Text style={styles.item}>
              Package:
              <Text regular> {item.package.name} </Text>
            </Text>
            <Text style={styles.item}>
              Amount:
              <Text bold> Rs. {item.amount} </Text>
            </Text>
            <Text style={styles.item}>
              {item.status === InvoiceStatus.PAID ? (
                <>
                  Paid At:{' '}
                  <Text bold>
                    {item.paidAt && format(new Date(item.paidAt), 'MMMM d, y')}
                  </Text>
                </>
              ) : (
                <>
                  Due Date:{' '}
                  <Text bold>
                    {format(new Date(item.invoiceDueAt), 'MMMM d, y')}
                  </Text>
                </>
              )}
            </Text>
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
    marginBottom: 3,
  },
  listHeader: {
    flexDirection: 'row',
  },
  headerFilterItem: {
    marginRight: 5,
  },
  invoiceItem: {
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
    borderBottomWidth: 2,
  },
  emptyList: {
    marginTop: 20,
  },
});

// import React, { useState } from 'react';
// import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
// import { useTranslation } from 'react-i18next';
// import { BaseStyle, useTheme } from '@config';
// import { Header, Icon, SafeAreaView, Tag, Text } from '@components';
// import { SettingsParamList } from 'navigation/models/SettingsParamList';
// import { StackScreenProps } from '@react-navigation/stack';
// import {
//   InvoiceStatus,
//   useInvoices,
// } from '@screens/businesses/queries/queries';
// import { RouteProp, useRoute } from '@react-navigation/native';
// import { format } from 'date-fns';
// import { InvoiceType } from '@screens/settings/profile/models/UserPresentable';

// type InvoicesScreenProps = StackScreenProps<SettingsParamList, 'Invoices'>;

// export default function InvoicesScreen({ navigation }: InvoicesScreenProps) {
//   const { t } = useTranslation();
//   const { colors } = useTheme();
//   const route = useRoute<RouteProp<SettingsParamList, 'Invoices'>>();
//   const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
//   const [filteredInvoices, setFilteredInvoices] =
//     useState<Array<InvoiceType>>();

//   const businessId = route.params?.businessId;
//   const { data: invoices, refetch } = useInvoices(
//     businessId,
//     InvoiceStatus.UNPAID,
//   );
//   const filters = ['all', 'paid', 'unpaid'] as const;

//   const onRefresh = async () => {
//     setIsRefreshing(true);
//     await refetch();
//     setIsRefreshing(false);
//   };

//   const filterInvoices = (filter: typeof filters[number]) => {
//     const finvoices = invoices?.filter((invoice) => {
//       if (filter === filters[0]) {
//         return true;
//       }
//       return invoice.status === filter;
//     });
//     setFilteredInvoices(finvoices);
//   };

//   return (
//     <SafeAreaView style={BaseStyle.safeAreaView}>
//       <Header
//         title={t('Invoices')}
//         renderLeft={() => (
//           <Icon
//             name="arrow-left"
//             size={20}
//             color={colors.primary}
//             enableRTL={true}
//           />
//         )}
//         onPressLeft={() => navigation.goBack()}
//       />
//       <FlatList
//         refreshControl={
//           <RefreshControl
//             title="Pull to refresh"
//             titleColor={colors.text}
//             colors={[colors.primary]}
//             tintColor={colors.primary}
//             refreshing={isRefreshing}
//             onRefresh={onRefresh}
//           />
//         }
//         style={styles.container}
//         ListHeaderComponent={
//           <View style={styles.listHeader}>
//             {/* Add the filter tags here */}
//             {filters.map((filter) => (
//               <Tag
//                 onPress={() => filterInvoices(filter)}
//                 rate
//                 style={[
//                   styles.headerFilterItem,
//                   {
//                     backgroundColor: colors.primary,
//                   },
//                 ]}>
//                 {filter.charAt(0).toUpperCase() + filter.slice(1)}
//               </Tag>
//             ))}
//           </View>
//         }
//         data={filteredInvoices ? filteredInvoices : invoices}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <View
//             style={[
//               styles.invoiceItem,
//               { backgroundColor: colors.background },
//             ]}>
//             <Text>
//               Invoice ID:
//               <Text bold> {item.id} </Text>
//             </Text>
//             <Text>
//               Package:
//               <Text regular> {item.package.name} </Text>
//             </Text>
//             <Text>
//               Amount:
//               <Text bold> Rs. {item.amount} </Text>
//             </Text>
//             <Text>
//               Date:{' '}
//               <Text bold>
//                 {format(new Date(item.invoiceDueAt), 'MMMM d, y')}
//               </Text>
//             </Text>
//             <Text>
//               Status:
//               <Text bold> {item.status} </Text>
//             </Text>
//           </View>
//         )}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//   },
//   item: {
//     marginRight: 5,
//   },
//   listHeader: {
//     flexDirection: 'row',
//   },
//   headerFilterItem: {
//     marginRight: 5,
//   },
//   invoiceItem: {
//     borderRadius: 5,
//     padding: 16,
//     shadowColor: 'black',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 10,
//     width: '100%',
//     marginTop: 15,
//   },
// });

// import React, { useState } from 'react';
// import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
// import { useTranslation } from 'react-i18next';
// import { BaseStyle, useTheme } from '@config';
// import { Header, Icon, SafeAreaView, Tag, Text } from '@components';
// import { SettingsParamList } from 'navigation/models/SettingsParamList';
// import { StackScreenProps } from '@react-navigation/stack';
// import {
//   useInvoices,
//   InvoiceStatus,
// } from '@screens/businesses/queries/queries';
// import { RouteProp, useRoute } from '@react-navigation/native';
// import { format } from 'date-fns';

// type InvoicesScreenProps = StackScreenProps<SettingsParamList, 'Invoices'>;

// export default function InvoicesScreen({ navigation }: InvoicesScreenProps) {
//   const { t } = useTranslation();
//   const { colors } = useTheme();
//   const route = useRoute<RouteProp<SettingsParamList, 'Invoices'>>();
//   const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
//   const [filteredInvoices, setFilteredInvoices] = useState<
//     'all' | 'paid' | 'unpaid'
//   >('all');

//   const businessId = route.params?.businessId;
//   const { data: invoices, refetch } = useInvoices(
//     businessId,
//     filteredInvoices === 'all'
//       ? undefined
//       : (filteredInvoices as InvoiceStatus),
//   );

//   const filters = ['all', 'paid', 'unpaid'] as const;

//   const onRefresh = async () => {
//     setIsRefreshing(true);
//     await refetch();
//     setIsRefreshing(false);
//   };

//   const filterInvoices = (filter: typeof filters[number]) => {
//     setFilteredInvoices(filter === 'all' ? 'all' : filter);
//   };

//   return (
//     <SafeAreaView style={BaseStyle.safeAreaView}>
//       <Header
//         title={t('Invoices')}
//         renderLeft={() => (
//           <Icon
//             name="arrow-left"
//             size={20}
//             color={colors.primary}
//             enableRTL={true}
//           />
//         )}
//         onPressLeft={() => navigation.goBack()}
//       />
//       <FlatList
//         refreshControl={
//           <RefreshControl
//             title="Pull to refresh"
//             titleColor={colors.text}
//             colors={[colors.primary]}
//             tintColor={colors.primary}
//             refreshing={isRefreshing}
//             onRefresh={onRefresh}
//           />
//         }
//         style={styles.container}
//         ListHeaderComponent={
//           <View style={styles.listHeader}>
//             {filters.map((filter) => (
//               <Tag
//                 key={filter}
//                 onPress={() => filterInvoices(filter)}
//                 rate
//                 style={[
//                   styles.headerFilterItem,
//                   {
//                     backgroundColor:
//                       filter === filteredInvoices
//                         ? colors.primary
//                         : colors.primaryLight,
//                   },
//                 ]}>
//                 {filter.charAt(0).toUpperCase() + filter.slice(1)}
//               </Tag>
//             ))}
//           </View>
//         }
//         data={
//           filteredInvoices === 'all'
//             ? invoices
//             : invoices?.filter((invoice) => invoice.status === filteredInvoices)
//         }
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <View
//             style={[
//               styles.invoiceItem,
//               { backgroundColor: colors.background },
//             ]}>
//             <Text>
//               Invoice ID:
//               <Text bold> {item.id} </Text>
//             </Text>
//             <Text>
//               Package:
//               <Text regular> {item.package.name} </Text>
//             </Text>
//             <Text>
//               Amount:
//               <Text bold> Rs. {item.amount} </Text>
//             </Text>
//             <Text>
//               Date:{' '}
//               <Text bold>
//                 {format(new Date(item.invoiceDueAt), 'MMMM d, y')}
//               </Text>
//             </Text>
//             <Text>
//               Status:
//               <Text bold> {item.status} </Text>
//             </Text>
//           </View>
//         )}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//   },
//   item: {
//     marginRight: 5,
//   },
//   listHeader: {
//     flexDirection: 'row',
//   },
//   headerFilterItem: {
//     marginRight: 5,
//   },
//   invoiceItem: {
//     borderRadius: 5,
//     padding: 16,
//     shadowColor: 'black',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 10,
//     width: '100%',
//     marginTop: 15,
//   },
// });
import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BaseStyle, useTheme } from '@config';
import { Header, Icon, SafeAreaView, Tag, Text } from '@components';
import { SettingsParamList } from 'navigation/models/SettingsParamList';
import { StackScreenProps } from '@react-navigation/stack';
import {
  useInvoices,
  InvoiceStatus,
} from '@screens/businesses/queries/queries';
import { RouteProp, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';

type InvoicesScreenProps = StackScreenProps<SettingsParamList, 'Invoices'>;
const filters = ['all', 'paid', 'unpaid'] as const;
type Filters = typeof filters[number];
export default function InvoicesScreen({ navigation }: InvoicesScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const route = useRoute<RouteProp<SettingsParamList, 'Invoices'>>();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [filteredInvoices, setFilteredInvoices] = useState<Filters>('all');

  const businessId = route.params?.businessId;
  const { data: invoices, refetch } = useInvoices(
    businessId,
    filteredInvoices === 'all'
      ? undefined
      : (filteredInvoices as InvoiceStatus),
  );

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const filterInvoices = (filter: Filters) => {
    setFilteredInvoices(filter === 'all' ? 'all' : filter);
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
            {filters.map((filter) => (
              <Tag
                key={filter}
                onPress={() => filterInvoices(filter)}
                rate
                style={[
                  styles.headerFilterItem,
                  {
                    backgroundColor:
                      filter === filteredInvoices
                        ? colors.primary
                        : colors.primaryLight,
                  },
                ]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Tag>
            ))}
          </View>
        }
        data={
          filteredInvoices === 'all'
            ? invoices
            : invoices?.filter((invoice) => invoice.status === filteredInvoices)
        }
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.invoiceItem,
              { backgroundColor: colors.background },
            ]}>
            <Text>
              Invoice ID:
              <Text bold> {item.id} </Text>
            </Text>
            <Text>
              Package:
              <Text regular> {item.package.name} </Text>
            </Text>
            <Text>
              Amount:
              <Text bold> Rs. {item.amount} </Text>
            </Text>
            <Text>
              Date:{' '}
              <Text bold>
                {format(new Date(item.invoiceDueAt), 'MMMM d, y')}
              </Text>
            </Text>
            <Text>
              Status:
              <Text bold> {item.status} </Text>
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
    marginRight: 5,
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
  },
});

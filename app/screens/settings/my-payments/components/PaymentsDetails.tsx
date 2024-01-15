import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@config';
import { Header, SafeAreaView, Icon, Text, Tag } from '@components';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { SettingsParamList } from 'navigation/models/SettingsParamList';
import { StackScreenProps } from '@react-navigation/stack';

function PaymentsDetails({
  navigation,
  route,
}: StackScreenProps<SettingsParamList, 'PaymentsDetails'>) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const { invoiceId, packageName, training, amount, date } = route.params || {};

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
        <SafeAreaView style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.heading}>
              {t('Invoice ID')}: {invoiceId}
            </Text>
            <Text style={styles.subHeading}>
              {t('Package')}: {packageName}
            </Text>
            <Text style={styles.text}>
              {t('Training')}: {training}
            </Text>
            <Text style={styles.text}>
              {t('Amount')}: {amount}
            </Text>
            <Text style={styles.text}>
              {t('Date')}: {date}
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
});

export default PaymentsDetails;

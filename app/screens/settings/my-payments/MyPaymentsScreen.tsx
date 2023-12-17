import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import { BaseStyle, useTheme } from '@config';
import { Header, SafeAreaView, Icon, Text, Button } from '@components';

import { SettingsParamList } from '../../../navigation/models/SettingsParamList';

export default function MyPaymentsScreen({
  navigation,
}: StackScreenProps<SettingsParamList, 'MyPayments'>) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={t('my_payments')}
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
        <View style={styles.container}>
          <Button
            style={styles.btn}
            onPress={() => Alert.alert('Unpaid Button')}>
            Unpaid
          </Button>
          <Button style={styles.btn} onPress={() => Alert.alert('Paid Button')}>
            Paid
          </Button>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Gym Metix</Text>
          <View style={styles.cardContainer}>
            <View style={styles.cardDetails}>
              <Text style={styles.contentLeft}>Name</Text>
              <Text style={styles.contentLeft}>Id Number</Text>
              <Text style={styles.contentLeft}>Package</Text>
              <Text style={styles.contentLeft}>Billing Time</Text>
              <Text style={styles.contentLeft}>Subscription</Text>
            </View>
            <View style={styles.cardDetails}>
              <Text style={styles.contentRight}>Abdul Rehman</Text>
              <Text style={styles.contentRight}>#1234</Text>
              <Text style={styles.contentRight}>Weight Traning</Text>
              <Text style={styles.contentRight}>01-01-2024</Text>
              <Text style={styles.contentRight}>Monthly</Text>
            </View>
          </View>
          <View style={styles.buttonsContainer}>
            <Button>See Details</Button>
            <Button>Pay Now</Button>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 180,
    height: 45,
    fontSize: 17,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginBottom: 55,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 16,
    alignSelf: 'center',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 14,
    width: '85%',
    marginBottom: 20,
    marginTop: 5,
  },
  cardContainer: {
    flexDirection: 'row',
  },
  cardDetails: {
    width: '50%',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 5,
    marginBottom: 10,
  },
  contentLeft: {
    textAlign: 'left',
    fontSize: 14,
    marginTop: 10,
  },
  contentRight: {
    textAlign: 'right',
    fontSize: 14,
    marginTop: 10,
  },
  buttonsContainer: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginTop: 20,
  },
});

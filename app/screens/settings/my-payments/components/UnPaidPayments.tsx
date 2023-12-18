import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView, Text, Button } from '@components';
function UnpaidPayments() {
  return (
    <SafeAreaView>
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
            <Text style={styles.contentRight}>Shameel</Text>
            <Text style={styles.contentRight}>#122555</Text>
            <Text style={styles.contentRight}>Cardio</Text>
            <Text style={styles.contentRight}>01-07-2024</Text>
            <Text style={styles.contentRight}>Yearly</Text>
          </View>
        </View>
        <View style={styles.buttonsContainer}>
          <Button>See Details</Button>
          <Button>Pay Now</Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
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
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
  cardContainer: {
    flexDirection: 'row',
  },
  cardDetails: {
    width: '50%',
  },
});

export default UnpaidPayments;

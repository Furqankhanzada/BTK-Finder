import { Text } from '@components';
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';

function InvioceCard() {
  return (
    <SafeAreaView>
      <View style={styles.card}>
        <Text style={styles.heading}>Vortex Gym</Text>
        <Text style={styles.subHeading}>Weight Training</Text>
        <Text>
          Next payment <Text style={styles.text}>Rs.10,000 </Text>
          due by <Text style={styles.text}> December 27, 2023</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
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
});

export default InvioceCard;

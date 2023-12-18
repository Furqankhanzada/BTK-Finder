// import React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import PaymentsDetails from '../components/PaymentsDetails';
// import UnpaidPayments from '../components/UnPaidPayments';
// import MyPayments from '../MyPaymentsScreen';

// const Stack = createStackNavigator();

// export default function MyPaymentsStack() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="MyPayments" component={MyPayments} />
//       {/* <Stack.Screen name="UnPaidPayments" component={UnpaidPayments} /> */}
//       <Stack.Screen name="PaymentsDetails" component={PaymentsDetails} />
//     </Stack.Navigator>
//   );
// }

import { Text } from '@components';
import React from 'react';
import { View } from 'react-native';

function MyPaymentsStack() {
  return (
    <View>
      <Text>MyPaymentsStack</Text>
    </View>
  );
}

export default MyPaymentsStack;

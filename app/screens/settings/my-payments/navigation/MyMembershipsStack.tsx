// import React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import PaymentsDetails from '../components/PaymentsDetails';
// import UnpaidPayments from '../components/UnPaidPayments';
// import MyMemberships from '../MyMembershipsScreen';

// const Stack = createStackNavigator();

// export default function MyMembershipsStack() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="MyMemberships" component={MyMemberships} />
//       {/* <Stack.Screen name="UnPaidPayments" component={UnpaidPayments} /> */}
//       <Stack.Screen name="PaymentsDetails" component={PaymentsDetails} />
//     </Stack.Navigator>
//   );
// }

import { Text } from '@components';
import React from 'react';
import { View } from 'react-native';

function MyMembershipsStack() {
  return (
    <View>
      <Text>MyMembershipsStack</Text>
    </View>
  );
}

export default MyMembershipsStack;

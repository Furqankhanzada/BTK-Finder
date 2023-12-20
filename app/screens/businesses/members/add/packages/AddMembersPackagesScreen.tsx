// import { CardList, Header, Icon, Tag, Text } from '@components';
// import { useTheme } from '@config';
// import { StackScreenProps } from '@react-navigation/stack';
// import { useProductsByTag, useTags } from '@screens/businesses/queries/queries';
// import { NavigationButtons } from '@screens/new-business/components/NavigationButtons';
// import { MembersStackParamList } from 'navigation/models/BusinessDetailBottomTabParamList';
// import React, { useEffect, useState } from 'react';
// import {
//   RefreshControl,
//   StyleProp,
//   StyleSheet,
//   View,
//   ViewStyle,
// } from 'react-native';
// import { FlatList, ScrollView } from 'react-native-gesture-handler';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import useMemberStore from '../../store/Store';
// import { CatalogProduct, Tag as TagType } from 'models/graphql';
// import { BusinessPresentable } from '@screens/businesses/models/BusinessPresentable';

// interface Props {
//   onProductPress: (item: CatalogProduct) => void;
//   onPressTag?: (duration: string, item: CatalogProduct) => void;
//   business: BusinessPresentable | undefined;
//   containerStyle?: StyleProp<ViewStyle>;
//   style?: StyleProp<ViewStyle>;
//   selectionMode?: boolean;
// }

// function AddMembersPackagesScreen(
//   props: StackScreenProps<MembersStackParamList, 'MembersPackages'>,

//   {
//     containerStyle,
//     style,
//     selectionMode,
//   }: Props
// ) {

//   const { navigation, route } = props;
//   const { businessId } = route.params;
//   const { colors } = useTheme();

//   const { selectedPackage } = useMemberStore();
//   const [selectedTag, setSelectedTag] = useState<TagType | undefined>();
//   const [isReFetching, setIsReFetching] = useState<boolean>(false);
//   //Tags
//   const {
//     data: tags,
//     refetch: reFetchTags,
//     isLoading,
//   } = useTags(business?.shop?.shopId);
//   console.log()
//   // Products
//   const {
//     refetch: reFetchProducts,
//     data: products,
//     isLoading: isProductsLoading,
//   } = useProductsByTag(business?.shop?.shopId, selectedTag?._id);
// // console.log(business);

//   useEffect(() => {
//     if (tags && tags.length) {
//       setSelectedTag(tags[0]);
//     }
//   }, [tags]);

//   const onTagPress = (tag: TagType) => {
//     setSelectedTag(tag);
//   };

//   const onRefresh = async () => {
//     setIsReFetching(true);
//     await reFetchTags();
//     await reFetchProducts();
//     setIsReFetching(false);
//   };

//   return (
//     <SafeAreaView>
//       <Header
//         title="Select Packages"
//         renderLeft={() => {
//           return (
//             <Icon
//               name="arrow-left"
//               size={20}
//               color={colors.primary}
//               enableRTL={true}
//             />
//           );
//         }}
//         onPressLeft={() => {
//           navigation.goBack();
//         }}
//       />
//       <SafeAreaView>
//         <View style={[styles.container, containerStyle]}>
//           <FlatList
//             listKey="products"
//             refreshControl={
//               <RefreshControl
//                 title="Pull to refresh"
//                 colors={[colors.primary]}
//                 tintColor={colors.primary}
//                 titleColor={colors.text}
//                 refreshing={isReFetching}
//                 onRefresh={onRefresh}
//               />
//             }
//             style={[styles.productsContainer]}
//             data={products}
//             keyExtractor={(item) => item._id}
//             stickyHeaderIndices={[0]}
//             ListHeaderComponent={
//               isLoading ? (
//                 <View></View>
//               ) : (
//                 <FlatList
//                   contentContainerStyle={[styles.tagsContainer, style]}
//                   horizontal={true}
//                   data={tags}
//                   keyExtractor={(item) => item._id}
//                   renderItem={({ item }) => (
//                     <Tag
//                       key={item._id}
//                       rate
//                       onPress={() => onTagPress(item)}
//                       style={[
//                         styles.item,
//                         selectedTag?._id === item._id
//                           ? {
//                               backgroundColor: colors.primaryDark,
//                             }
//                           : { backgroundColor: colors.primary },
//                       ]}>
//                       {item.displayTitle}
//                     </Tag>
//                   )}
//                 />
//               )
//             }
//             ListEmptyComponent={
//               isProductsLoading && !products ? (
//                <View></View>
//               ) : (
//                 <Text style={[styles.listEmptyText, { color: colors.text }]}>
//                   No Products
//                 </Text>
//               )
//             }
//             renderItem={({ item }) => (
//               // <Text>{item.title}</Text>
//               <CardList
//                 key={item._id}
//                 image={item.primaryImage?.URLs?.thumbnail!}
//                 title={item.title}
//                 subtitle={item.pricing[0]?.displayPrice}
//                 style={[styles.productList, style]}
//                 onPress={() => onProductPress(item)}
//                 onPressTag={(duration) =>
//                   onPressTag ? onPressTag(duration, item) : {}
//                 }
//                 options={item.variants?.map((variant) => variant?.optionTitle)}
//                 selectedOption={selectedPackage.duration}
//                 selectedTitle={selectedPackage.name}
//                 iconRight={
//                   selectionMode && item._id === selectedPackage.id ? (
//                     <Icon
//                       name="check-circle"
//                       color={colors.primary}
//                       size={20}
//                     />
//                   ) : null
//                 }
//               />
//             )}
//           />
//         </View>
//       </SafeAreaView>
//       <ScrollView style={[styles.tagsContainer]}>
//         <NavigationButtons
//         // onSubmit={handleSubmit(onSubmit)}
//         // loading={isLoading}
//         // disabled={!isValid || isLoading}
//         // isEdit={!!isEditBusiness}
//         />
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     // flex: 1,
//     paddingHorizontal: 20,
//     height: 500
//   },
//   tagsContainer: {
//     marginBottom: 10,
//     paddingLeft: 17,
//   },
//   productsContainer: {
//     marginTop: 15,
//   },
//   productList: {
//     marginTop: 10,
//   },
//   item: {
//     marginRight: 5,
//   },
//   listHeader: {
//     flexDirection: 'row',
//   },
//   productsList: {
//     flex: 0,
//     paddingHorizontal: 0,
//   },
//   listEmptyText: {
//     textAlign: 'center',
//     paddingVertical: 20,
//   },
// });
// export default AddMembersPackagesScreen;
import { Text } from '@components';
import React from 'react';
import { View } from 'react-native';

function AddMembersPackagesScreen() {
  return (
    <View>
      <Text>AddMembersPackagesScreen</Text>
    </View>
  );
}

export default AddMembersPackagesScreen;

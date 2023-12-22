// import { CardList, Header, Icon, Tag, Text, TextInput } from '@components';
// import { BaseStyle, useTheme } from '@config';
// import { StackScreenProps } from '@react-navigation/stack';
// import {
//   useBusiness,
//   useProductsByTag,
//   useTags,
// } from '@screens/businesses/queries/queries';
// import { NavigationButtons } from '@screens/new-business/components/NavigationButtons';
// import { MembersStackParamList } from 'navigation/models/BusinessDetailBottomTabParamList';
// import React, { useEffect, useState } from 'react';
// import {
//   KeyboardAvoidingView,
//   Platform,
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
// import { AddMembersParamList } from 'navigation/models/AddMembersParamList';
// import { useCategories } from '@screens/category/queries/queries';
// import { TouchableOpacity } from '@gorhom/bottom-sheet';
// import { SelectItem } from '@screens/new-business/components/SelectItem';
// import { useTranslation } from 'react-i18next';
// import { onChange } from 'react-native-reanimated';
// import { useEditBusiness } from '@screens/new-business/apis/mutations';

// interface Props {
//   onProductPress: (item: CatalogProduct) => void;
//   onPressTag?: (duration: string, item: CatalogProduct) => void;
//   business: BusinessPresentable | undefined;
//   containerStyle?: StyleProp<ViewStyle>;
//   style?: StyleProp<ViewStyle>;
//   selectionMode?: boolean;
// }

// function DurationScreen(
//   props: StackScreenProps<AddMembersParamList, 'duration'>,

//   { containerStyle, style, business: any, selectionMode }: Props,
// ) {
//   const { navigation, route } = props;
//   const businessId = '6401d1445d381e3bcd4b47e7';
//   const { t } = useTranslation();

//   const { colors } = useTheme();

//   // const { selectedPackage } = useMemberStore();
//   const { data: business } = useBusiness(businessId);
//   const [selectedTag, setSelectedTag] = useState<TagType | undefined>();
//   const [isReFetching, setIsReFetching] = useState<boolean>(false);
//   //Tags
//   const {
//     data: tags,
//     refetch: reFetchTags,
//     isLoading,
//   } = useTags(business?.shop?.shopId);
//   console.log(businessId);

//   // Products
//   const {
//     refetch: reFetchProducts,
//     data: products,
//     isLoading: isProductsLoading,
//   } = useProductsByTag(business?.shop?.shopId, selectedTag?._id);
//   // console.log(business);

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
//   const offsetKeyboard = Platform.select({
//     ios: 0,
//     android: 20,
//   });
//   return (
//     <SafeAreaView style={BaseStyle.safeAreaView}>
//       <Header
//         title="Select Package Duration"
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
//       <KeyboardAvoidingView
//         behavior={Platform.select({ android: undefined, ios: 'padding' })}
//         keyboardVerticalOffset={offsetKeyboard}
//         style={styles.keyboardAvoidView}>
//         <View style={styles.container}>
//           <Text title1 bold>
//             Select a Package Duration
//           </Text>
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
//                   showsHorizontalScrollIndicator={false}
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
//                 <View></View>
//               ) : (
//                 <Text style={[styles.listEmptyText, { color: colors.text }]}>
//                   No Products
//                 </Text>
//               )
//             }
//             renderItem={({ item, index }) => (
//               <View>
//                 <SelectItem
//                   key={`${index + item._id}`}
//                   // onPress={() => onChange(item)}
//                   text={item.title}
//                   // checked={checked}
//                 />
//               </View>
//               // const checked = selectedCategory === item.name;
//             )}
//           />
//         </View>
//       </KeyboardAvoidingView>

//       {/* <NavigationButtons
//       // onSubmit={onSubmit}
//       // loading={isLoading}
//       // disabled={!category || isLoading}
//       // isEdit={!!isEditBusiness}
//       /> */}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 20,
//     marginTop: 10,
//     paddingBottom: 10,
//   },
//   tagsContainer: {
//     marginBottom: 10,
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
//   listEmptyText: {
//     textAlign: 'center',
//     paddingVertical: 20,
//   },
//   keyboardAvoidView: {
//     height: '90%',
//   },
//   input: {
//     marginTop: 15,
//   },
// });
// export default DurationScreen;

import { Text } from '@components';
import React from 'react';
import { View } from 'react-native';

function DurationScreen() {
  return (
    <View>
      <Text>DurationScreen</Text>
    </View>
  );
}

export default DurationScreen;

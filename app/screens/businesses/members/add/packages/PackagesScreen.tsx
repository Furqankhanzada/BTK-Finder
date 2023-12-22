import { Header, Icon, Tag, Text, TextInput } from '@components';
import { BaseStyle, useTheme } from '@config';
import { StackScreenProps } from '@react-navigation/stack';
import {
  useBusiness,
  useProductsByTag,
  useTags,
} from '@screens/businesses/queries/queries';
import { NavigationButtons } from '@screens/new-business/components/NavigationButtons';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CatalogProduct, Tag as TagType } from 'models/graphql';
import { AddMembersParamList } from 'navigation/models/AddMembersParamList';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { SelectItem } from '@screens/new-business/components/SelectItem';
import { useTranslation } from 'react-i18next';

interface Props {
  onProductPress: (item: CatalogProduct) => void;
  onPressTag?: (duration: string, item: CatalogProduct) => void;
  business: string | undefined;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  selectionMode?: boolean;
  text: string | undefined;
}

function PackagesScreen(
  props: StackScreenProps<AddMembersParamList, 'Pakages'>,

  { style, }: Props,
) {
  const { navigation } = props;
  const businessId = '6401d1445d381e3bcd4b47e7';
  const { t } = useTranslation();

  const { colors } = useTheme();

  // const { selectedPackage } = useMemberStore();
  const { data: business } = useBusiness(businessId);
  const [selectedTag, setSelectedTag] = useState<TagType | undefined>();
  const [isReFetching, setIsReFetching] = useState<boolean>(false);
  // const [search, setSearch] = useState<string>('');
  // const [items, setItems] = useState(business);
  //Tags
  const {
    data: tags,
    refetch: reFetchTags,
    isLoading,
  } = useTags(business?.shop?.shopId);
  console.log(businessId);

  // Products
  const {
    refetch: reFetchProducts,
    data: products,
    isLoading: isProductsLoading,
  } = useProductsByTag(business?.shop?.shopId, selectedTag?._id);
  // console.log(business);

  useEffect(() => {
    if (tags && tags.length) {
      setSelectedTag(tags[0]);
    }
  }, [tags]);

  const onTagPress = (tag: TagType) => {
    setSelectedTag(tag);
  };

  const onRefresh = async () => {
    setIsReFetching(true);
    await reFetchTags();
    await reFetchProducts();
    setIsReFetching(false);
  };
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });
  // const isEditPackage = businessId;
  // const { data: businessData } = useBusiness(route.params?.businessId);
  // const { mutate: editPackage, isLoading } = useEditBusiness();
  // const category = useAddBusinessStore(
  //   (state: BusinessStoreTypes) => state.category,
  // );
  // const setCategory = useAddBusinessStore(
  //   (state: BusinessStoreActions) => state.setCategory,
  // );
  // useEffect(() => {
  //   if (isEditPackage) {
  //     const unsubscribe = navigation.addListener('beforeRemove', () => {
  //       // Delay the reset to avoid flickering
  //       setTimeout(() => {
  //         setPackage('');
  //       }, 300);
  //     });

  //     return () => {
  //       unsubscribe();
  //     };
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [navigation]);

  // useEffect(() => {
  //   if (isEditPackage && businessData?.package) {
  //     setSelectedPackage(businessData.package);
  //   }
  // }, [businessData?.category, isEditPackage]);
  // const onSubmit = () => {
  //   if (isEditPackage) {
  //     editPackage(
  //       {
  //         businessId: businessId,
  //         data: { business: selectedPackage },
  //       },
  //       {
  //         onSuccess() {
  //           navigation.goBack();
  //         },
  //       },
  //     );
  //   } else if (selectedPackage) {
  //     navigation.navigate('duration');
  //   }
  // };
  // const onSearch = (keyword: string) => {
  //   setSearch(keyword);
  //   if (!keyword) {
  //     setItems(business ?? []);
  //   } else {
  //     setItems(
  //       business?.filter((item: { title: string }) => {
  //         return item.title.toUpperCase().includes(keyword.toUpperCase());
  //       }),
  //     );
  //   }
  // };
  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title="Select Packages"
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
      <KeyboardAvoidingView
        behavior={Platform.select({ android: undefined, ios: 'padding' })}
        keyboardVerticalOffset={offsetKeyboard}
        style={styles.keyboardAvoidView}>
        <View style={styles.container}>
          <Text title1 bold>
            Select a Package for your Membership
          </Text>
          {business ? (
            <TextInput
              style={styles.input}
              // onChangeText={(text) => onSearch(text)}
              placeholder={t('search')}
              // value={search}
              icon={
                <TouchableOpacity>
                  <Icon name="times" size={16} color={colors.primaryLight} />
                </TouchableOpacity>
              }
            />
          ) : null}
          <FlatList
            listKey="products"
            refreshControl={
              <RefreshControl
                title="Pull to refresh"
                colors={[colors.primary]}
                tintColor={colors.primary}
                titleColor={colors.text}
                refreshing={isReFetching}
                onRefresh={onRefresh}
              />
            }
            style={[styles.productsContainer]}
            data={products}
            keyExtractor={(item) => item._id}
            stickyHeaderIndices={[0]}
            ListHeaderComponent={
              isLoading ? (
                <View></View>
              ) : (
                <FlatList
                  contentContainerStyle={[styles.tagsContainer, style]}
                  horizontal={true}
                  data={tags}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <Tag
                      key={item._id}
                      rate
                      onPress={() => onTagPress(item)}
                      style={[
                        styles.item,
                        selectedTag?._id === item._id
                          ? {
                              backgroundColor: colors.primaryDark,
                            }
                          : { backgroundColor: colors.primary },
                      ]}>
                      {item.displayTitle}
                    </Tag>
                  )}
                />
              )
            }
            ListEmptyComponent={
              isProductsLoading && !products ? (
                <View></View>
              ) : (
                <Text style={[styles.listEmptyText, { color: colors.text }]}>
                  No Products
                </Text>
              )
            }
            renderItem={({ }) => (
              <View>
                {/* <SelectItem
                  key={`${index + item._id}`}
                  // onPress={() => onChange(item)}
                  text={item.title}
                  // checked={checked}
                /> */}
              </View>
              // const checked = selectedCategory === item.name;
            )}
          />
        </View>
      </KeyboardAvoidingView>

      <NavigationButtons
        isEdit={false}
        onSubmit={function (): void {
          throw new Error('Function not implemented.');
        }} // onSubmit={onSubmit}
        // loading={isLoading}
        // disabled={!category || isLoading}
        // isEdit={!!isEditBusiness}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
    paddingBottom: 10,
  },
  tagsContainer: {
    marginBottom: 10,
    // paddingLeft: 17,
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
  keyboardAvoidView: {
    height: '90%',
  },
  input: {
    marginTop: 15,
  },
});
export default PackagesScreen;

import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, Icon, Tag, Text, TextInput } from '@components';
import { BaseStyle, useTheme } from '@config';
import { StackScreenProps } from '@react-navigation/stack';
import {
  useBusiness,
  useProductsByTag,
  useTags,
} from '@screens/businesses/queries/queries';
import { NavigationButtons } from '@screens/new-business/components/NavigationButtons';
import { SelectItem } from '@screens/new-business/components/SelectItem';
import { useTranslation } from 'react-i18next';
import { CatalogProduct, Tag as TagType } from 'models/graphql';
import { AddMembersParamList } from 'navigation/models/AddMembersParamList';
import { ViewStyle } from 'react-native';

// Import useNavigation hook from @react-navigation/native
import { useNavigation } from '@react-navigation/native';

interface Props {
  onProductPress: (item: CatalogProduct) => void;
  onPressTag?: (duration: string, item: CatalogProduct) => void;
  business: string | undefined;
  containerStyle?: ViewStyle;
  style?: ViewStyle;
  selectionMode?: boolean;
  text: string | undefined;
}

function PackagesScreen(
  props: StackScreenProps<AddMembersParamList, 'Packages'>,
  { style }: Props,
) {
  const { navigation } = props;
  const businessId = '6401d1445d381e3bcd4b47e7';
  const { t } = useTranslation();

  const { colors } = useTheme();
  const { data: business } = useBusiness(businessId);
  const [selectedTag, setSelectedTag] = useState<TagType | undefined>();
  const [isReFetching, setIsReFetching] = useState<boolean>(false);
  const {
    data: tags,
    refetch: reFetchTags,
    isLoading,
  } = useTags(business?.shop?.shopId);
  const {
    refetch: reFetchProducts,
    data: products,
    isLoading: isProductsLoading,
  } = useProductsByTag(business?.shop?.shopId, selectedTag?._id);

  useEffect(() => {
    if (tags && tags.length) {
      setSelectedTag(tags[0]);
    }
  }, [tags]);

  const onTagPress = async (tag: TagType) => {
    setSelectedTag(tag);
    // await reFetchProducts(business?.shop?.shopId, tag?._id);
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

  const [search, setSearch] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState<CatalogProduct[]>(
    [],
  );
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  useEffect(() => {
    const filtered = products?.filter(
      (item) =>
        item.title?.toLowerCase().includes(search.toLowerCase()) ?? false,
    );
    setFilteredProducts(filtered || []);
  }, [search, products]);

  const toggleSelection = (itemId: string) => {
    setSelectedItemId((prevSelectedItemId) =>
      prevSelectedItemId === itemId ? null : itemId,
    );
  };

  // Use the useNavigation hook to get the navigation object
  const packagesNavigation = useNavigation();

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title="Packages Screen"
        renderLeft={() => (
          <Icon
            name="arrow-left"
            size={20}
            color={colors.primary}
            enableRTL={true}
          />
        )}
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
            Select Membership Package
          </Text>
          {business ? (
            <TextInput
              style={styles.input}
              placeholder={t('search')}
              value={search}
              onChangeText={(text) => setSearch(text)}
              icon={
                <TouchableOpacity onPress={() => setSearch('')}>
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
            data={filteredProducts}
            keyExtractor={(item) => item._id}
            stickyHeaderIndices={[0]}
            ListHeaderComponent={
              isLoading ? (
                <View />
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
                <View />
              ) : (
                <Text style={[styles.listEmptyText, { color: colors.text }]}>
                  No Products
                </Text>
              )
            }
            renderItem={({ item }) => (
              <View>
                <SelectItem
                  text={item?.title || ''}
                  checked={selectedItemId === item._id}
                  onPress={() => toggleSelection(item._id)}
                />
              </View>
            )}
          />
        </View>
      </KeyboardAvoidingView>

      <NavigationButtons
        isEdit={false}
        onSubmit={() => {
          // Your submission logic here
          const selectedPackageId = selectedItemId;
          console.log('Selected Package ID:', selectedPackageId);

          setSelectedItemId(null);

          packagesNavigation.navigate('Duration');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
    paddingBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    height: 40,
  },
  productsContainer: {
    marginTop: 15,
  },
  keyboardAvoidView: {
    height: '90%',
  },
  input: {
    marginTop: 10,
  },
  item: {
    marginRight: 5,
  },
  listEmptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PackagesScreen;

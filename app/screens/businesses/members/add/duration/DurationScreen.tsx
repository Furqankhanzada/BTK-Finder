import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, Icon, Tag, Text } from '@components';
import { BaseStyle, useTheme } from '@config';
import { StackScreenProps } from '@react-navigation/stack';
import {
  useBusiness,
  useProductsByTag,
  useTags,
} from '@screens/businesses/queries/queries';
import { NavigationButtons } from '@screens/new-business/components/NavigationButtons';
import { SelectItem } from '@screens/new-business/components/SelectItem';
import { Tag as TagType } from 'models/graphql';
import { AddMembersParamList } from 'navigation/models/AddMembersParamList';
import { ViewStyle } from 'react-native';

// Import useNavigation hook from @react-navigation/native
import { useNavigation } from '@react-navigation/native';

interface Props {
  // onProductPress: (item: CatalogProduct) => void;
  // onPressTag?: (duration: string, item: CatalogProduct) => void;
  business: string | undefined;
  containerStyle?: ViewStyle;
  style?: ViewStyle;
  selectionMode?: boolean;
  text: string | undefined;
}

function DurationScreen(
  props: StackScreenProps<AddMembersParamList, 'Duration'>,
  { style }: Props,
) {
  const { navigation } = props;
  const businessId = '6401d1445d381e3bcd4b47e7';
  // const { t } = useTranslation();

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

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const toggleSelection = (itemId: string) => {
    setSelectedItemId((prevSelectedItemId) =>
      prevSelectedItemId === itemId ? null : itemId,
    );
  };
  const packagesNavigation = useNavigation();

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title="Duration Screen"
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
        keyboardVerticalOffset={Platform.select({
          ios: 0,
          android: 20,
        })}
        style={styles.keyboardAvoidView}>
        <View style={styles.container}>
          <Text title1 bold>
            Select Membership Duration
          </Text>
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
            style={styles.productsContainer}
            data={products}
            keyExtractor={(item) => item._id}
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
                  text={item.duration}
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

          // Clear the selection for the opposite gender
          setSelectedItemId(null);

          // Use navigation to go to the 'duration' screen
          packagesNavigation.navigate('Pakages');
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
  item: {
    marginRight: 5,
  },
  listEmptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default DurationScreen;

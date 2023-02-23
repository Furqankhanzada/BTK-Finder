import React, { useEffect } from 'react';
import {
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { StackScreenProps } from '@react-navigation/stack';
import { URL } from 'react-native-url-polyfill';

import { Header, Text, Icon, Image, Loading } from '@components';
import { BaseColor, BaseStyle, useTheme } from '@config';

import { useBusiness } from '@screens/businesses/queries/queries';
import { Gallery } from '@screens/businesses/models/BusinessPresentable';

import { GlobalParamList } from 'navigation/models/GlobalParamList';
import { useDeleteImage } from '../../../apis/mutations';
import {
  useAddThumbnail,
  useAddGalleryImages,
  useAddBusiness,
  useEditBusiness,
  AddBusinessPayload,
} from '../apis/mutations';
import useAddBusinessStore, {
  BusinessStoreActions,
  BusinessStoreTypes,
} from '../store/Store';
import { NavigationButtons } from '../components/NavigationButtons';
import _ from 'lodash';

export default function GalleryScreen(
  props: StackScreenProps<GlobalParamList, 'Gallery'>,
) {
  const { navigation, route } = props;
  const { colors } = useTheme();
  const isEditBusiness = route?.params?.businessId;

  const { mutate: uploadThumbnail, isLoading: thumbnailLoading } =
    useAddThumbnail();
  const { mutate: uploadGallery, isLoading: galleryLoading } =
    useAddGalleryImages();
  const { mutate: deleteImage, isLoading: deleteImageLoading } =
    useDeleteImage();
  const { mutate: addNewBusiness, isLoading: addBusinessLoading } =
    useAddBusiness();
  const { mutate: updateGallery, isLoading: updateBusinessLoading } =
    useEditBusiness(route?.params?.businessId ?? '');
  const { data: businessData } = useBusiness(route?.params?.businessId ?? '');

  const resetAddBusinessStore = useAddBusinessStore(
    (state: BusinessStoreActions) => state.resetAddBusinessStore,
  );
  const payload = useAddBusinessStore((state: BusinessStoreTypes) => state);
  const thumbnail = useAddBusinessStore(
    (state: BusinessStoreTypes) => state.thumbnail,
  );
  const setThumbnail = useAddBusinessStore(
    (state: BusinessStoreActions) => state.setThumbnail,
  );
  const gallery = useAddBusinessStore(
    (state: BusinessStoreTypes) => state.gallery,
  );
  const setGallery = useAddBusinessStore(
    (state: BusinessStoreActions) => state.setGallery,
  );

  useEffect(() => {
    if (isEditBusiness && businessData?.thumbnail) {
      setThumbnail(businessData?.thumbnail);
    }
    if (isEditBusiness && businessData?.gallery) {
      setGallery(businessData?.gallery);
    }
  }, [
    businessData?.gallery,
    businessData?.thumbnail,
    isEditBusiness,
    setGallery,
    setThumbnail,
  ]);

  const onSubmit = () => {
    if (isEditBusiness) {
      updateGallery(
        { thumbnail, gallery },
        {
          onSuccess() {
            setThumbnail('');
            setGallery([]);
            navigation.goBack();
          },
        },
      );
    } else {
      // Remove keys containing empty strings to avoid API Errors
      const payloadData = _.pickBy(
        payload,
        _.identity,
      ) as unknown as AddBusinessPayload;

      addNewBusiness(payloadData, {
        onSuccess() {
          navigation.navigate('Dashboard');

          // Reset Store
          resetAddBusinessStore();

          // Reset Stack
          navigation.reset({
            index: 0,
            routes: [{ name: 'Name' }],
          });
        },
      });
    }
  };

  const navigateToBack = () => {
    navigation.goBack();
  };

  const removeThumbnail = (image: string) => {
    const url = new URL(image);

    deleteImage(
      { pathname: url.pathname.replace(/^\/|\/$/g, '') },
      {
        onSuccess() {
          setThumbnail('');
        },
      },
    );
  };

  const onChangeCover = (item: Gallery) => {
    let data = [...gallery];
    data.map((el) => (el.cover = el.image === item.image));
    setGallery(data);
  };

  const removeSingleGalleryImage = (item: Gallery) => {
    const url = new URL(item.image);

    deleteImage(
      { pathname: url.pathname.replace(/^\/|\/$/g, '') },
      {
        onSuccess() {
          const newPayload = { ...payload };
          let data = newPayload.gallery.filter(
            (el: Gallery) => el.image !== item.image,
          );
          setGallery(data);
        },
      },
    );
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const renderGalleryImages = (data: Gallery[]) => {
    if (data?.length) {
      return data?.map((image: Gallery, index: number) => {
        return (
          <View key={index} style={styles.galleryImageSubContainer}>
            <TouchableOpacity
              style={styles.galleryImageButton}
              onPress={() => onChangeCover(image)}>
              {image?.cover ? (
                <Text semibold style={styles.galleryImageBadge}>
                  Cover
                </Text>
              ) : null}
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => removeSingleGalleryImage(image)}>
                <Icon style={styles.actionButtonIcon} name="minus" />
              </TouchableOpacity>
              <Image
                style={styles.galleryImage}
                source={{ uri: image.image }}
              />
            </TouchableOpacity>
          </View>
        );
      });
    }
    return null;
  };

  const pickSingle = () => {
    ImagePicker.openPicker({
      width: 250,
      height: 250,
      cropping: true,
      compressImageMaxWidth: 1000,
      compressImageMaxHeight: 500,
      mediaType: 'photo',
      cropperStatusBarColor: colors.primary,
      cropperToolbarColor: colors.primary,
      cropperToolbarWidgetColor: BaseColor.whiteColor,
      cropperActiveWidgetColor: colors.primary,
    })
      .then((image) => {
        uploadThumbnail(image);
      })
      .catch((e) => {
        console.log('IMAGE_PICKER_ERROR', e);
      });
  };

  const pickMultiple = () => {
    ImagePicker.openPicker({
      compressImageMaxWidth: 1000,
      compressImageMaxHeight: 1000,
      mediaType: 'photo',
      multiple: true,
    })
      .then((images) => {
        if (images.length) {
          uploadGallery(images);
        }
      })
      .catch((e) => {
        console.log('IMAGE_PICKER_ERROR', e);
      });
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={isEditBusiness ? 'Edit Gallery' : 'Gallery'}
        renderLeft={() => {
          return isEditBusiness ? (
            <Icon
              name="arrow-left"
              size={20}
              color="#5dade2"
              enableRTL={true}
            />
          ) : null;
        }}
        onPressLeft={navigateToBack}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? undefined : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={styles.keyboardAvoidView}>
        <Loading loading={deleteImageLoading} />

        <FlatList
          style={styles.container}
          overScrollMode={'never'}
          scrollEventThrottle={16}
          data={[1]}
          renderItem={() => {
            return (
              <ScrollView style={styles.scrollView}>
                <View style={styles.thumbnailSection}>
                  <Loading loading={thumbnailLoading} />
                  <Text title3 semibold>
                    Thumbnail
                  </Text>
                  <Text>Thumbnail size must be 300x300</Text>
                  {thumbnail ? (
                    <View style={styles.thumbnailContainer}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => removeThumbnail(thumbnail)}>
                        <Icon style={styles.actionButtonIcon} name="minus" />
                      </TouchableOpacity>
                      <Image
                        style={styles.thumbnailContainerImage}
                        source={{ uri: thumbnail }}
                      />
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.thumbnailAddOverlay}
                      onPress={() => pickSingle()}>
                      <Text semibold style={styles.thumbnailAddOverlayText}>
                        Tap To Add Thumbnail
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.gallerySection}>
                  <Loading loading={galleryLoading} />
                  <Text title3 semibold>
                    Gallery
                  </Text>
                  <Text>Gallery Images size must be 600x400</Text>
                  <View style={styles.gallerySectionImagesContainer}>
                    {renderGalleryImages(gallery)}
                    <TouchableOpacity
                      style={
                        payload.gallery.length === 0
                          ? styles.galleryImageContainer
                          : styles.galleryImageSubContainer
                      }
                      onPress={() => pickMultiple()}>
                      <View style={styles.galleryImageBox}>
                        <View style={styles.galleryImageAddIconContainer}>
                          <Icon
                            name="plus"
                            style={styles.galleryImageAddIcon}
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            );
          }}
        />

        <NavigationButtons
          onSubmit={onSubmit}
          isEdit={!!isEditBusiness}
          loading={addBusinessLoading || updateBusinessLoading}
          disabled={addBusinessLoading || updateBusinessLoading}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidView: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginTop: 10,
  },
  scrollView: {
    flex: 1,
  },
  thumbnailSection: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  thumbnailContainer: {
    marginTop: 15,
    backgroundColor: BaseColor.grayColor,
    position: 'relative',
    borderRadius: 5,
  },
  thumbnailContainerImage: {
    borderRadius: 5,
    aspectRatio: 300 / 300,
  },
  thumbnailAddOverlay: {
    marginTop: 15,
    height: 300,
    borderRadius: 5,
    backgroundColor: BaseColor.grayColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailAddOverlayText: {
    fontSize: 20,
    textAlign: 'center',
    color: BaseColor.whiteColor,
  },
  gallerySection: {
    marginBottom: 5,
    paddingHorizontal: 20,
  },
  gallerySectionImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  galleryImageContainer: {
    marginTop: 15,
    width: '100%',
    height: 120,
    borderRadius: 5,
    backgroundColor: BaseColor.grayColor,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  galleryImageBox: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BaseColor.grayColor,
  },
  galleryImageSubContainer: {
    width: '33.33%',
    padding: 10,
    height: 120,
    borderRadius: 5,
    position: 'relative',
  },
  galleryImageAddIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 52 / 2,
    backgroundColor: BaseColor.whiteColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryImageAddIcon: {
    color: BaseColor.blueColor,
    fontSize: 22,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 32,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1,
    right: -10,
    top: -10,
  },
  actionButtonIcon: {
    color: BaseColor.whiteColor,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  galleryImageButton: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
    overflow: 'visible',
  },
  galleryImageBadge: {
    backgroundColor: BaseColor.blueColor,
    color: BaseColor.whiteColor,
    paddingVertical: 5,
    paddingHorizontal: 15,
    position: 'absolute',
    zIndex: 1,
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 4,
  },
});

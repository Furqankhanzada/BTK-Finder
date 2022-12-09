import React, { Fragment, useEffect } from 'react';
import { FlatList, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { Formik } from 'formik';
import ImagePicker from 'react-native-image-crop-picker';

import { Header, Text, Button, Icon, Image } from '@components';
import { BaseStyle } from '@config';
import useAddBusinessStore from '../store/Store';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';
import {
  useAddNewBusiness,
  useAddNewThumbnail,
  useAddGalleryImages,
  useEditBusiness,
} from '../queries/mutations';
import { ScrollView } from 'react-native-gesture-handler';
import { NewAddBusinessPresentable } from '../models/AddNewBusinessPresentable';
import { useBusiness } from '@screens/businesses/queries/queries';

export const GalleryScreen = ({
  navigation,
  route,
}: StackScreenProps<GlobalParamList>) => {
  const { mutate: updateGallery } = useEditBusiness(route?.params?.id);
  const { mutate: uploadThumbnail } = useAddNewThumbnail();
  const { mutate: uploadGallery } = useAddGalleryImages();
  const { mutate: addNewBusiness } = useAddNewBusiness();
  const { data: businessData } = useBusiness(route?.params?.id);

  const payload = useAddBusinessStore((state: any) => state);
  const thumbnail = useAddBusinessStore((state: any) => state.thumbnail);
  const setThumbnail = useAddBusinessStore((state: any) => state.setThumbnail);
  const gallery = useAddBusinessStore((state: any) => state.gallery);
  const setGallery = useAddBusinessStore((state: any) => state.setGallery);
  const isEditBusiness = route?.params?.id;

  console.log('UPDATED STORE IN GALLERY SCREEN', payload);

  useEffect(() => {
    if (isEditBusiness && businessData?.thumbnail) {
      console.log('SET THUMBNAIL IF AVAILABLE');
      setThumbnail(businessData?.thumbnail);
    }
    if (isEditBusiness && businessData?.gallery) {
      console.log('SET GALLERY IF AVAILABLE');
      setGallery(businessData?.gallery);
    }
  }, [
    businessData?.gallery,
    businessData?.thumbnail,
    isEditBusiness,
    setGallery,
    setThumbnail,
  ]);

  const navigateToNext = () => {
    if (isEditBusiness) {
      updateGallery({ thumbnail, gallery });
      setThumbnail('');
      setGallery('');
      navigation.navigate('EditBusiness', { id: route?.params?.id });
    } else {
      addNewBusiness(payload);
      navigation.navigate('Dashboard');
    }
  };

  const navigateToBack = () => {
    navigation.goBack();
  };

  const removeThumbnail = () => {
    if (thumbnail) {
      setThumbnail('');
    } else {
      null;
    }
  };

  const onChangeCover = (item: any) => {
    let data = [...gallery];
    data.map((el) => (el.cover = el.image === item.image));
    setGallery(data);
  };

  const removeSingleGalleryImage = (item: any) => {
    const newPayload = { ...payload };
    let data = newPayload.gallery.filter((el: any) => el.image !== item.image);
    console.log('Remove Gallery data', data);
    setGallery(data);
  };

  const renderGalleryImages = (data: Array<NewAddBusinessPresentable>) => {
    if (data?.length) {
      return data?.map((el: any, i: any) => (
        <View key={i} style={styles.galleryImageSubContainer}>
          <TouchableOpacity
            style={styles.galleryActionButton}
            onPress={() => removeSingleGalleryImage(el)}>
            <Icon style={styles.galleryActionButtonIcon} name="minus" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.galleryImageButton}
            onPress={() => onChangeCover(el)}>
            {el?.cover ? (
              <Text semibold style={styles.galleryImageBadge}>
                Cover
              </Text>
            ) : null}
            <Image style={styles.galleryImage} source={{ uri: el.image }} />
          </TouchableOpacity>
        </View>
      ));
    }
    return null;
  };

  const pickSingle = () => {
    ImagePicker.openPicker({
      width: 250,
      height: 250,
      cropping: true,
      cropperCircleOverlay: true,
      sortOrder: 'none',
      compressImageMaxWidth: 1000,
      compressImageMaxHeight: 1000,
      compressImageQuality: 1,
      compressVideoPreset: 'MediumQuality',
      includeExif: true,
      cropperStatusBarColor: 'white',
      cropperToolbarColor: 'white',
      cropperActiveWidgetColor: 'white',
      cropperToolbarWidgetColor: '#3498DB',
      multiple: false,
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
      compressImageQuality: 1,
      compressVideoPreset: 'MediumQuality',
      includeExif: true,
      multiple: true,
    })
      .then((images) => {
        console.log('Multiple Image Selected: ', images);
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
        renderRight={() => {
          return isEditBusiness ? null : <Text>Skip</Text>;
        }}
        onPressRight={navigateToNext}
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
        onPressLeft={() => {
          navigation.navigate('EditBusiness', { id: businessData?._id });
        }}
      />
      <Formik
        initialValues={{ gallery: gallery }}
        onSubmit={() => {
          navigateToNext();
        }}>
        {({ handleSubmit }) => {
          return (
            <>
              <FlatList
                style={styles.container}
                overScrollMode={'never'}
                scrollEventThrottle={16}
                data={[1]}
                renderItem={() => {
                  return (
                    <ScrollView style={{ flex: 1, marginTop: 20 }}>
                      <View style={styles.thumbnailSection}>
                        <View style={styles.title}>
                          <Text title3 semibold style={{ textAlign: 'center' }}>
                            Thumbnail
                          </Text>
                        </View>
                        <View
                          style={{ marginHorizontal: 25, marginBottom: 10 }}>
                          <Text>Thumbnail size must be 300x300</Text>
                        </View>
                        <View style={styles.thumbnailContainer}>
                          {thumbnail ? (
                            <Fragment>
                              <TouchableOpacity
                                style={styles.galleryActionButton}
                                onPress={() => removeThumbnail()}>
                                <Icon
                                  style={styles.galleryActionButtonIcon}
                                  name="minus"
                                />
                              </TouchableOpacity>
                              <Image
                                style={styles.thumbnailContainerImage}
                                source={{ uri: thumbnail }}
                              />
                            </Fragment>
                          ) : (
                            <TouchableOpacity
                              style={styles.thumbnailAddOverlay}
                              onPress={() => pickSingle()}>
                              <Text
                                semibold
                                style={styles.thumbnailAddOverlayText}>
                                Tap To Add Thumbnail
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                      <View style={styles.gallerySection}>
                        <View style={styles.title}>
                          <Text title3 semibold style={{ textAlign: 'center' }}>
                            Gallery
                          </Text>
                        </View>
                        <View style={{ marginHorizontal: 25, marginBottom: 5 }}>
                          <Text>Gallery Images size must be 600x400</Text>
                        </View>
                        <View style={styles.gallerySectionImagesContainer}>
                          {renderGalleryImages(gallery)}
                          <TouchableOpacity
                            style={
                              payload.gallery.length === 0
                                ? styles.galleryImageContainer
                                : styles.galleryImageSubContainer
                            }
                            onPress={() => pickMultiple()}>
                            <View style={styles.galleryImageAddIconContainer}>
                              <Icon
                                name="plus"
                                style={styles.galleryImageAddIcon}
                              />
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </ScrollView>
                  );
                }}
              />
              <View
                style={
                  isEditBusiness ? styles.stickyFooterEdit : styles.stickyFooter
                }>
                {isEditBusiness ? null : (
                  <Button style={styles.footerButtons} onPress={navigateToBack}>
                    {'Back'}
                  </Button>
                )}

                <Button
                  style={styles.footerButtons}
                  title="submit"
                  onPress={handleSubmit}>
                  {isEditBusiness ? 'Update Gallery' : 'Submit'}
                </Button>
              </View>
            </>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
};

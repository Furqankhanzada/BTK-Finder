import React, { Fragment, useState } from 'react';
import { FlatList, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { Formik } from 'formik';
import ImagePicker from 'react-native-image-crop-picker';

import { Header, Text, Button, Icon, Loading, Image } from '@components';
import { BaseColor, BaseStyle } from '@config';
import useAddBusinessStore from '../store/Store';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';
import {
  useAddNewBusiness,
  useAddNewThumbnail,
  useAddGalleryImages,
} from '../queries/mutations';
import { ScrollView } from 'react-native-gesture-handler';

export const GalleryScreen = ({
  navigation,
}: StackScreenProps<GlobalParamList>) => {
  const { mutate: uploadThumbnail } = useAddNewThumbnail();
  const { mutate: uploadGallery } = useAddGalleryImages();
  const { mutate: addNewBusiness, isLoading } = useAddNewBusiness();

  const payload = useAddBusinessStore((state: any) => state);
  const gallery = useAddBusinessStore((state: any) => state.gallery);
  const setGallery = useAddBusinessStore((state: any) => state.setGallery);

  console.log('UPDATED STORE IN GALLERY SCREEN', payload);

  const [active, setActive] = useState(false);
  const navigateToNext = () => {
    navigation.navigate('Dashboard');
    addNewBusiness(payload);
  };

  const navigateToBack = () => {
    navigation.goBack();
  };

  const removeThumbnail = () => {
    if (payload.thumbnail) {
      delete payload.thumbnail;
      uploadThumbnail(payload.thumbnail);
    } else {
      null;
    }
    console.log('payload Thumbnail', payload);
  };

  const onChangeCover = (item: any) => {
    let data = [...gallery];
    data.map((el) => (el.cover = el.image === item.image));
    console.log('On Change Cover', data);
    setGallery(data);
  };

  const removeSingleGalleryImage = (item: any) => {
    const newPayload = { ...payload };
    let data = newPayload.gallery.filter((el: any) => el.image !== item.image);
    console.log('Remove Gallery data', data);
    setGallery(data);
  };

  const renderGalleryImages = (data: any) => {
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
        title="Gallery"
        renderRight={() => {
          return <Text>Skip</Text>;
        }}
        onPressRight={navigateToNext}
      />
      <Formik
        initialValues={{ gallery: gallery }}
        onSubmit={(values) => {
          navigation.navigate('Dashboard');
          addNewBusiness(payload);
        }}>
        {({ values, handleSubmit }) => {
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
                          {payload.thumbnail ? (
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
                                source={{ uri: payload.thumbnail }}
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
                          {renderGalleryImages(payload.gallery)}
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

              <View style={styles.stickyFooter}>
                <Button
                  style={styles.footerButtons}
                  onPress={() => navigateToBack()}>
                  {'Back'}
                </Button>

                <Button
                  style={[
                    styles.footerButtons,
                    active === true
                      ? { backgroundColor: BaseColor.grayColor }
                      : null,
                  ]}
                  title="submit"
                  onPress={handleSubmit}>
                  {'Next'}
                </Button>
              </View>
            </>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
};

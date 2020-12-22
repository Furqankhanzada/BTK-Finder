import React, {Fragment} from 'react';
import {View, TouchableOpacity, Platform} from 'react-native';
import { BaseStyle } from '@config';
import {
    Header,
    SafeAreaView,
    Icon,
    Text,
    CustomStepIndicator,
    Image,
} from '@components';
import styles from './styles';
import { ScrollView } from 'react-native-gesture-handler';
import ActionButton from 'react-native-action-button';
import {useDispatch, useSelector} from "react-redux";
import ImagePicker from "react-native-image-crop-picker";
import {setImagesIntoRedux, updateGalleryImagesIntoRedux} from "../../actions/business";
import {uuid} from "../../utils";

export default function Gallery({ navigation }) {

    const dispatch = useDispatch();
    const stateProps = useSelector(({businesses, profile}) => {
        return {
            userId: profile._id,
            thumbnail: businesses.thumbnail || '',
            thumbnailLoading: businesses.thumbnailLoading,
            gallery: businesses.gallery,
            galleryLoading: businesses.galleryLoading
        }
    });

    const onNext = () => {

    };

    //for thumbnail function
    const removeThumbnail = () => {
        dispatch(setImagesIntoRedux('thumbnail', {}));
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
        })
            .then((image) => {
                const filename = image.path.replace(/^.*[\\\/]/, '');
                let file = {
                    uri:
                        Platform.OS === 'android'
                            ? image.path
                            : image.path.replace('file://', ''),
                    type: 'multipart/form-data',
                    name: filename,
                };
                dispatch(setImagesIntoRedux('thumbnail', file));
            })
            .catch((e) => {
                console.log('IMAGE_PICKER_ERROR', e);
            });
    };

    //for gallery function
    const removeSingleGalleryImage = (item) => {
        let data = stateProps.gallery.filter(el => el.id !== item.id);
        dispatch(updateGalleryImagesIntoRedux(data));
    };
    const renderGalleryImages = (data) => {
        if(data?.length){
           return data.map(el => <View style={styles.galleryImageContainer}>
               <TouchableOpacity style={styles.galleryActionButton}
                                 onPress={() => removeSingleGalleryImage(el)}>
                   <Icon style={styles.galleryActionButtonIcon} name="minus" />
               </TouchableOpacity>
               <Image style={styles.galleryImage} source={{uri: el.uri}}/>
           </View>)
        }
        return null;
    };
    const updateImagesArray = (data) => {
        let array = [];
        if(data.length) {
            data.forEach((el) => {
                const filename = el.path.replace(/^.*[\\\/]/, '');
                array.push({
                    uri: Platform.OS === 'android' ? el.path : el.path.replace('file://', ''),
                    type: 'multipart/form-data',
                    name: filename,
                    id: uuid()
                })
            })
        }
        return array
    };
    const pickMultiple = () => {
        ImagePicker.openPicker({
            compressImageMaxWidth: 1000,
            compressImageMaxHeight: 1000,
            compressImageQuality: 1,
            compressVideoPreset: 'MediumQuality',
            includeExif: true,
            multiple: true
        })
            .then((images) => {
                dispatch(setImagesIntoRedux('gallery', updateImagesArray(images)));
            })
            .catch((e) => {
                console.log('IMAGE_PICKER_ERROR', e);
            });
    };

    return (
        <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
            <Header
                title={'Add Your Business'}
                renderLeft={() => {
                    return (
                        <Icon
                            name="arrow-left"
                            size={20}
                            color="#5dade2"
                            enableRTL={true}
                        />
                    );
                }}
                onPressLeft={() => {
                    navigation.goBack();
                }}
            />
            <CustomStepIndicator position={4} />
            <ScrollView
                style={{ flex: 1, marginTop: 20 }}>
                <View style={styles.thumbnailSection}>
                    <View style={styles.title}>
                        <Text title3 semibold style={{ textAlign: 'center' }}>
                            Thumbnail
                        </Text>
                    </View>
                    <View style={styles.thumbnailContainer}>
                        {stateProps.thumbnail?.uri ?
                            <Fragment>
                                <TouchableOpacity style={styles.galleryActionButton}
                                                  onPress={() => removeThumbnail()}>
                                    <Icon style={styles.galleryActionButtonIcon} name="minus" />
                                </TouchableOpacity>
                                <Image style={styles.thumbnailContainerImage} source={{uri: stateProps.thumbnail?.uri}}/>
                            </Fragment>
                            :  <TouchableOpacity style={styles.thumbnailAddOverlay} onPress={() => pickSingle()}>
                                <Text semibold style={styles.thumbnailAddOverlayText}>
                                    Tap To Add Thumbnail
                                </Text>
                            </TouchableOpacity>}

                    </View>
                </View>
                <View style={styles.gallerySection}>
                    <View style={styles.title}>
                        <Text title3 semibold style={{textAlign: 'center'}}>Gallery</Text>
                    </View>
                    <View style={styles.gallerySectionImagesContainer}>
                        {renderGalleryImages(stateProps.gallery)}
                        <TouchableOpacity style={[styles.galleryImageContainer, !stateProps.gallery?.length && {flex: 1}]}
                                          onPress={() => pickMultiple()}>
                            <View style={styles.galleryImageAddIconContainer}>
                                <Icon name="plus" style={styles.galleryImageAddIcon}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <ActionButton
                buttonColor="rgba(93, 173, 226, 1)"
                onPress={() => onNext()}
                offsetX={20}
                offsetY={10}
                icon={
                    <Icon name="arrow-right" size={20} color="white" enableRTL={true} />
                }
            />
        </SafeAreaView>
    );
}

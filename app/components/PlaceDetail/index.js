import React, {
    Fragment,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import PropTypes from 'prop-types';
import {
    View,
    ScrollView,
    Animated,
    TouchableOpacity,
    Linking,
    Alert,
    Share,
} from 'react-native';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { useTranslation } from 'react-i18next';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { useSelector, useDispatch } from 'react-redux';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import {
    Placeholder,
    PlaceholderLine,
    Progressive,
    PlaceholderMedia,
} from 'rn-placeholder';
import { BaseColor, Images, useTheme } from '@config';
import {
    ContactItems,
    Header,
    SafeAreaView,
    Icon,
    Text,
    Tag,
    Image,
    FavouriteIcon,
} from '@components';
import * as Utils from '@utils';
import styles from './styles';
import PlaceItem from '../PlaceItem';
import CardList from '../CardList';
import {getRelatedBusinesses, getBusinesses, getSingleBusiness} from '../../actions/business';
import SectionList from '../../screens/Home/sectionList';

let defaultDelta = {
    latitudeDelta: 0.003,
    longitudeDelta: 0.003,
};

export default function PlaceDetailComponent(props) {
    const mapRef = useRef();
    const scrollY = useRef(new Animated.Value(0)).current;
    const { t } = useTranslation();
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const { navigation, business, preview } = props;
    const [isPreview] = useState(preview);
    const [collapseHour, setCollapseHour] = useState(true);
    const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
    const [businessLink, setBusinessLink] = useState('');
    const appLink = 'http://onelink.to/xwhffr';

    const stateProps = useSelector(({ businesses, favorites }) => {
        return {
            recentlyAddedBusinesses: businesses.placeDetailRecentlyAddedBusinesses,
            getRecentlyAddedBusinessesLoading:
            businesses.placeDetailRecentlyAddedBusinessesLoading,
            relatedBusiness: businesses.relatedBusinesses,
            getRelatedBusinessesLoading: businesses.getRelatedBusinessesLoading,
            favoriteBusinesses: favorites.getFavoriteBusinesses,
            isFavoriteLoading: favorites.isFavoriteLoading,
            getSingleBusinessLoading: businesses.getSingleBusinessLoading,
        };
    });

    useEffect(() => {
        async function businessLink() {
            const link = await dynamicLinks().buildShortLink({
                link: `https://explorebtk.page.link/PlaceDetail?id=${business._id}`,
                domainUriPrefix: 'https://explorebtk.page.link',
                android: {
                    packageName: 'com.explore.btk',
                },
            });
            setBusinessLink(link);
        }
        businessLink();
    }, [business._id]);

    useEffect(() => {
        dispatch(
            getRelatedBusinesses({
                limit: 5,
                skip: 0,
                fields: 'name, thumbnail, category, averageRatings',
                category: business.category,
            }),
        );
        dispatch(
            getBusinesses({
                placeDetail: true,
                recent: true,
                limit: 5,
                skip: 0,
                fields: 'name, thumbnail, category, address, averageRatings',
            }),
        );
    }, [business.category, dispatch]);

    useEffect(() => {
        let loc =
            business.location && business.location.coordinates
                ? business.location.coordinates
                : null;
        if (loc) {
            const payload = {
                latitude: loc[0],
                longitude: loc[1],
                ...defaultDelta,
            };
            setLocation(payload);
            setRegion(payload);
            reCenterMap(payload);
        }
    }, [business.location]);

    const businessStatus = () => {
        //Week Days
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        //Current Date that gives us current Time also
        let dt = new Date();

        //Current Day
        let getCurrentDay = days[dt.getDay()];

        //Return Open if current day is available in open hours days
        if(business?.openHours.find(item => item.day === getCurrentDay)) {
            //12 hours to 24 hours converting function
            const convertTime12to24 = (time12h) => {
                const [time, modifier] = time12h.split(' ');

                let [hours, minutes] = time.split(':');

                if (hours === '12') {
                    hours = '00';
                }

                if (modifier === 'pm') {
                    hours = parseInt(hours, 10) + 12;
                }
                if (modifier === 'PM') {
                    hours = parseInt(hours, 10) + 12;
                }

                return `${hours}:${minutes}:00`;
            };

            //Get Data of current day from Open hours
            let currentDayObject = business?.openHours.filter((obj) => obj.day === 'Tuesday');

            let startTime = convertTime12to24(currentDayObject[0].from);
            let endTime = convertTime12to24(currentDayObject[0].to);

            let s =  startTime.split(':');
            let dt1 = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(),
                parseInt(s[0]), parseInt(s[1]), parseInt(s[2]));

            let e =  endTime.split(':');
            let dt2 = new Date(dt.getFullYear(), dt.getMonth(),
                dt.getDate(),parseInt(e[0]), parseInt(e[1]), parseInt(e[2]));

            if((dt >= dt1 && dt <= dt2)) {
                return 'Opened'
            }
        }

        return 'Closed'
    };

    const onShare = async () => {
        try {
            await Share.share({
                message: `${business.name}: ${businessLink} \n \nDownload Explore BTK: ${appLink}`,
                url: businessLink,
                title: business.name,
                dialogTitle: business.name,
            });
        } catch (error) {
            console.log('Error while sharing Business', error.message);
        }
    };

    const navigateBusinessDetail = (id) => {
        navigation.replace('PlaceDetail', { id });
    };
    const navigateToReview = (id) => {
        navigation.navigate('Review', { id });
    };

    const headerBackgroundColor = scrollY.interpolate({
        inputRange: [0, 140],
        outputRange: [BaseColor.whiteColor, colors.text],
        extrapolate: 'clamp',
        useNativeDriver: true,
    });

    const headerImageOpacity = scrollY.interpolate({
        inputRange: [0, 250 - heightHeader - 20],
        outputRange: [1, 0],
        extrapolate: 'clamp',
        useNativeDriver: true,
    });

    const heightViewImg = scrollY.interpolate({
        inputRange: [0, 250 - heightHeader],
        outputRange: [250, heightHeader],
        useNativeDriver: true,
    });
    const information = [
        {
            id: '1',
            icon: 'map-marker-alt',
            title: t('address'),
            type: 'map',
            information: business?.address,
            location: business?.location?.coordinates,
            rightText: 'Get Directions',
        },
        {
            id: '2',
            icon: 'mobile-alt',
            title: t('tel'),
            type: 'phone',
            information: business?.telephone,
            rightText: 'Call Now',
        },
        {
            id: '3',
            icon: 'envelope',
            title: t('email'),
            type: 'email',
            information: business?.email ? business.email : '',
            rightText: 'Send Mail',
        },
        {
            id: '4',
            icon: 'globe',
            title: t('website'),
            type: 'web',
            information: business?.website ? business.website : '',
            rightText: 'Visit Website',
        },
    ];

    const openGps = (lat, lng) => {
        let url = `http://maps.google.com/maps?daddr=${lat},${lng}`;
        Linking.openURL(url);
    };

    const onOpen = (item) => {
        Alert.alert(
            'Explore BTK',
            `${t('do_you_want_to')} ${item.rightText} ?`,
            [
                {
                    text: t('cancel'),
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: t('yes'),
                    onPress: () => {
                        switch (item.type) {
                            case 'web':
                                Linking.openURL(item.information);
                                break;
                            case 'phone':
                                Linking.openURL('tel://' + item.information);
                                break;
                            case 'email':
                                Linking.openURL('mailto:' + item.information);
                                break;
                            case 'whatsapp':
                                Linking.openURL('whatsapp://send?phone=' + checkPhoneCode(item.information));
                                break;
                            case 'map':
                                openGps(item?.location[0], item?.location[1]);
                                break;
                        }
                    },
                },
            ],
            { cancelable: true },
        );
    };

    const checkPhoneCode = (phone) => {
        if(business?.telephone?.includes('03')) {
            return `+92${phone.slice(1)}`
        }

        return phone
    };

    const [region, setRegion] = useState({
        latitude: 1.352083,
        longitude: 103.819839,
        latitudeDelta: 0.009,
        longitudeDelta: 0.004,
    });
    const [location, setLocation] = useState({
        latitude: 1.352083,
        longitude: 103.819839,
        latitudeDelta: 0.009,
        longitudeDelta: 0.004,
    });

    const reCenterMap = (currentLocation) => {
        mapRef?.current?.animateToRegion({
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: defaultDelta.latitudeDelta,
            longitudeDelta: defaultDelta.longitudeDelta,
        });
    };

    const onCollapse = () => {
        Utils.enableExperimental();
        setCollapseHour(!collapseHour);
    };

    const updateOpenHours = (data) => {
        let array = [
            { day: 'Monday' },
            { day: 'Tuesday' },
            { day: 'Wednesday' },
            { day: 'Thursday' },
            { day: 'Friday' },
            { day: 'Saturday' },
            { day: 'Sunday' },
        ];
        if (data?.length) {
            array = data.concat(
                array.filter(({ day }) => !data.find((f) => f.day === day)),
            );
        }
        return array;
    };

    const getCoverImage = useCallback(() => {
        if (business.gallery && business.gallery.length) {
            return business.gallery.find((image) => image?.cover)?.image;
        } else {
            return Images.imagePlaceholder;
        }
    }, [business]);

    const renderBanner = () => {
        if (stateProps?.getSingleBusinessLoading) {
            return (
                <Placeholder Animation={Progressive}>
                    <PlaceholderMedia style={{width: '100%', height: '100%'}} />
                </Placeholder>
            );
        }

        return <Image source={getCoverImage()} style={{ flex: 1 }} />;
    };

    const renderContent = () => {
        if (stateProps?.getSingleBusinessLoading) {
            return (
                <View>
                    <Placeholder Animation={Progressive}>
                        <PlaceholderLine
                            style={{width: '90%', height: 20, marginTop: 80}}
                        />
                        <PlaceholderLine style={{width: '90%', height: 20}} />
                        <PlaceholderLine style={{width: '90%', height: 20}} />
                        <PlaceholderLine style={{width: '90%', height: 20}} />
                        <PlaceholderLine style={{width: '90%', height: 20}} />
                        <PlaceholderLine style={{width: '90%', height: 20}} />
                        <PlaceholderLine style={{width: '90%', height: 20}} />
                        <PlaceholderLine style={{width: '90%', height: 20}} />
                        <PlaceholderLine style={{width: '90%', height: 20}} />
                        <PlaceholderLine style={{width: '90%', height: 20}} />
                        <PlaceholderLine style={{width: '90%', height: 20}} />
                        <PlaceholderLine style={{width: '90%', height: 20}} />
                    </Placeholder>
                </View>
            );
        }

        return (
            <View>
                <View
                    style={[
                        styles.boxInfo,
                        {
                            backgroundColor: colors.card,
                            shadowColor: colors.border,
                            borderColor: colors.border,
                        },
                    ]}>
                    <View style={{flex: 1}}>
                        <Text title1 semibold numberOfLines={1}>
                            {business.name}
                        </Text>
                        <View>
                            {business.status ? (
                                <View style={styles.contentStatus}>
                                    <Text caption2 accentColor medium>
                                        {businessStatus()}
                                    </Text>
                                    <View style={styles.dot} />
                                    <Text caption2 grayColor style={{flex: 1}} numberOfLines={1}>
                                        {business.category}
                                    </Text>
                                </View>
                            ) : <View>
                                <View style={styles.contentStatus}>
                                    <Text caption2 grayColor style={{flex: 1}} numberOfLines={1}>
                                        {business.category}
                                    </Text>
                                </View>
                            </View>}
                        </View>
                        <View style={styles.contentStatus}>
                            {isPreview ? (
                                <TouchableOpacity
                                    onPress={() => {}}
                                    style={[
                                        styles.tagRate,
                                        {backgroundColor: colors.primaryLight},
                                    ]}>
                                    <Icon
                                        name="star"
                                        size={10}
                                        color={BaseColor.whiteColor}
                                        solid
                                    />
                                    <Text caption2 whiteColor semibold style={{marginLeft: 4}}>
                                        0.0
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    onPress={() => navigateToReview(business._id)}
                                    style={[
                                        styles.tagRate,
                                        {backgroundColor: colors.primaryLight},
                                    ]}>
                                    <Icon
                                        name="star"
                                        size={10}
                                        color={BaseColor.whiteColor}
                                        solid
                                    />
                                    <Text caption2 whiteColor semibold style={{marginLeft: 4}}>
                                        <NumberFormat
                                            value={
                                                business?.reviewStats?.averageRatings
                                                    ? business?.reviewStats?.averageRatings
                                                    : '0.0'
                                            }
                                            displayType={'text'}
                                            decimalScale={1}
                                            fixedDecimalScale={true}
                                            renderText={(value) => (
                                                <Text style={{ fontSize: 10, color: 'white' }}>
                                                    {value}
                                                </Text>
                                            )}
                                        />
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                    <View style={styles.boxContentRight}>
                        {isPreview ? null : (
                            <View
                                style={styles.iconLike}>
                                <FavouriteIcon
                                    style={styles.iconGirdLike}
                                    navigation={navigation}
                                    lastRoute="PlaceDetail"
                                    routeId={business?._id}
                                    isFavorite={stateProps?.favoriteBusinesses?.some(
                                        (obj) => obj._id === business?._id,
                                    )}
                                    favoriteId={business?._id}
                                />
                            </View>
                        )}
                    </View>
                </View>
                <ContactItems
                    data={business}
                    onPressWhatsApp={() => onOpen({
                        title: t('tel'),
                        type: 'whatsapp',
                        information: business?.telephone,
                        rightText: 'open WhatsApp'
                    })}
                    onPressPhone={() => onOpen({
                        title: t('tel'),
                        type: 'phone',
                        information: business?.telephone,
                        rightText: 'call'
                    })}
                />
                <View>
                    {information?.map((item) => {
                        if (item?.information) {
                            return (
                                <TouchableOpacity
                                    style={styles.line}
                                    key={item.id}
                                    onPress={() => onOpen(item)}>
                                    <View
                                        style={[
                                            styles.contentIcon,
                                            { backgroundColor: colors.border },
                                        ]}>
                                        <Icon
                                            name={item.icon}
                                            size={16}
                                            color={BaseColor.whiteColor}
                                        />
                                    </View>
                                    <View
                                        style={{
                                            marginLeft: 10,
                                            flexDirection: 'column',
                                            flex: 1,
                                        }}>
                                        <Text caption2 grayColor>
                                            {item.title}
                                        </Text>
                                        <Text footnote semibold style={{ marginTop: 5 }}>
                                            {item.information}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text caption1 semibold style={{ color: colors.primary }}>
                                            {item.rightText}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        }
                    })}
                    {business?.openHours && business?.openHours?.length ? (
                        <Fragment>
                            <TouchableOpacity style={styles.line} onPress={onCollapse}>
                                <View
                                    style={[
                                        styles.contentIcon,
                                        { backgroundColor: colors.border },
                                    ]}>
                                    <Icon name="clock" size={16} color={BaseColor.whiteColor} />
                                </View>
                                <View style={styles.contentInforAction}>
                                    <View>
                                        <Text caption2 grayColor>
                                            {' '}
                                            {t('open_hour')}{' '}
                                        </Text>
                                        <Text footnote semibold style={{ marginTop: 5 }}>
                                            {business.openHours[0].from
                                                ? business.openHours[0].from.toLowerCase()
                                                : ''}
                                            {' - '}
                                            {business.openHours[0].to
                                                ? business.openHours[0].to.toLowerCase()
                                                : ''}
                                        </Text>
                                    </View>
                                    <Icon
                                        name={collapseHour ? 'angle-down' : 'angle-up'}
                                        size={24}
                                        color={BaseColor.grayColor}
                                    />
                                </View>
                            </TouchableOpacity>
                            {business?.openHours?.length > 1 ? (
                                <View
                                    style={{
                                        paddingLeft: 40,
                                        paddingRight: 20,
                                        marginTop: 5,
                                        height: collapseHour ? 0 : null,
                                        overflow: 'hidden',
                                    }}>
                                    {updateOpenHours(business.openHours).map((item) => {
                                        return (
                                            <View
                                                style={[
                                                    styles.lineWorkHours,
                                                    { borderColor: colors.border },
                                                ]}
                                                key={item.day}>
                                                <Text body2 grayColor>
                                                    {item.day}
                                                </Text>
                                                {'isOpen' in item && !item.isOpen ? (
                                                    <Text body2 accentColor semibold>
                                                        {' '}
                                                        Close{' '}
                                                    </Text>
                                                ) : (
                                                    <Text body2 accentColor semibold>
                                                        {item.from ? item.from.toLowerCase() : ''}
                                                        {!(item.isOpen || item.from || item.to)
                                                            ? 'Close'
                                                            : ''}
                                                        {item.from && item.to ? ' - ' : ''}
                                                        {item.to ? item.to.toLowerCase() : ''}
                                                    </Text>
                                                )}
                                            </View>
                                        );
                                    })}
                                </View>
                            ) : null}
                        </Fragment>
                    ) : null}
                </View>
                <View
                    style={[styles.contentDescription, { borderColor: colors.border }]}>
                    {business.description ? (
                        <Text body2 numberOfLines={100} style={{ lineHeight: 20 }}>
                            {business.description}
                        </Text>
                    ) : null}
                    <View
                        style={{
                            paddingVertical: 20,
                            flexDirection: 'row',
                        }}>
                        {business.established ? (
                            <View style={{ flex: 1 }}>
                                <Text caption1 grayColor>
                                    {t('date_established')}
                                </Text>
                                <Text headline style={{ marginTop: 5 }}>
                                    {moment(business.established).format('DD/MM/YYYY')}
                                </Text>
                            </View>
                        ) : null}
                        {business.priceRange &&
                        (business.priceRange.from || business.priceRange.to) ? (
                            <View style={styles.priceRangeSection}>
                                <Text caption1 grayColor>
                                    {t('price_range')}
                                </Text>
                                <View style={styles.prices}>
                                    <NumberFormat
                                        value={
                                            business.priceRange.from
                                                ? `${business.priceRange.from}`
                                                : ''
                                        }
                                        displayType={'text'}
                                        prefix={' RS '}
                                        thousandSeparator={true}
                                        renderText={(value) => (
                                            <Text headline style={{ marginTop: 5 }}>
                                                {value} -
                                            </Text>
                                        )}
                                    />
                                    <NumberFormat
                                        value={
                                            business.priceRange.to
                                                ? `${business.priceRange.to}`
                                                : ''
                                        }
                                        displayType={'text'}
                                        prefix={' RS '}
                                        thousandSeparator={true}
                                        renderText={(value) => (
                                            <Text headline style={{ marginTop: 5 }}>
                                                {value}
                                            </Text>
                                        )}
                                    />
                                </View>
                            </View>
                        ) : null}
                    </View>
                    <View
                        style={{
                            height: 180,
                            paddingVertical: 20,
                        }}>
                        <MapView
                            ref={mapRef}
                            scrollEnabled={false}
                            pitchEnabled={false}
                            zoomEnabled={false}
                            provider={PROVIDER_GOOGLE}
                            style={styles.map}
                            region={region}
                            onRegionChange={() => {}}>
                            <Marker coordinate={location} />
                        </MapView>
                    </View>
                </View>
                {business?.facilities?.length ? (
                    <View>
                        <Text
                            title3
                            semibold
                            style={{
                                paddingBottom: 5,
                                paddingTop: 15,
                            }}>
                            {t('facilities')}
                        </Text>
                        <View
                            style={[styles.wrapContent, { borderColor: colors.border }]}>
                            {business?.facilities?.map((item) => {
                                return (
                                    <Tag
                                        icon={
                                            <Icon
                                                name={item.icon}
                                                size={12}
                                                color={colors.accent}
                                                solid
                                                style={{ marginRight: 5 }}
                                            />
                                        }
                                        chip
                                        key={item.id}
                                        style={{
                                            marginTop: 8,
                                            marginRight: 8,
                                        }}>
                                        {item?.name}
                                    </Tag>
                                );
                            })}
                        </View>
                    </View>
                ) : null}
            </View>
        )
    };

    const renderRecentBusinesses = () => {
        if(!stateProps?.getSingleBusinessLoading) {
            return (
                isPreview ? null : (
                    <View style={{ marginTop: 20 }}>
                        <SectionList
                            title="Recently Added"
                            data={stateProps.recentlyAddedBusinesses}
                            horizontal={true}
                            loading={stateProps.getRecentlyAddedBusinessesLoading}
                            renderItem={({ item, index }) => {
                                return (
                                    <PlaceItem
                                        grid
                                        image={item?.thumbnail}
                                        title={item.name}
                                        subtitle={item.category}
                                        location={item?.address}
                                        rate={item?.averageRatings || '0.0'}
                                        isFavorite={stateProps?.favoriteBusinesses?.some(
                                            (obj) => obj._id === item?._id,
                                        )}
                                        businessId={item?._id}
                                        navigation={navigation}
                                        lastRoute="PlaceDetail"
                                        routeId={business?._id}
                                        // status='Open Now'
                                        onPress={() => navigateBusinessDetail(item._id)}
                                        onPressTag={() => navigateToReview(item._id)}
                                        style={{ marginLeft: 15, width: 175 }}
                                    />
                                );
                            }}
                        />
                    </View>
                )
            )
        }
    };

    const renderRelatedBusinesses = () => {
        if(!stateProps?.getSingleBusinessLoading && business?.category) {
            return (
                isPreview ? null : (
                    <SectionList
                        title={t('related')}
                        data={stateProps.relatedBusiness}
                        loading={stateProps.getRelatedBusinessesLoading}
                        renderItem={({ item, index }) => {
                            return (
                                <CardList
                                    key={index}
                                    image={item?.thumbnail}
                                    title={item.name}
                                    subtitle={item.category}
                                    rate={item?.averageRatings || '0.0'}
                                    style={{ marginBottom: 15 }}
                                    onPress={() => navigateBusinessDetail(item._id)}
                                    onPressTag={() => navigateToReview(item._id)}
                                />
                            );
                        }}
                    />
                )
            )
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <Header title={isPreview ? 'Business Review' : ''} />
            <Animated.View
                style={[
                    styles.headerImageStyle,
                    {
                        opacity: headerImageOpacity,
                        height: heightViewImg,
                    },
                ]}>
                {renderBanner()}
            </Animated.View>
            <Animated.View style={[styles.headerStyle, {position: 'absolute'}]}>
                <Header
                    title={isPreview ? 'Business Review' : ''}
                    renderLeft={() => {
                        return (
                            <Animated.Image
                                resizeMode="contain"
                                style={[
                                    styles.icon,
                                    {
                                        tintColor: headerBackgroundColor,
                                    },
                                ]}
                                source={Images.back}
                            />
                        );
                    }}
                    renderRightSecond={() => {
                        return (
                            <View style={styles.iconContent}>
                                <Animated.Image
                                    resizeMode="contain"
                                    style={[
                                        styles.icon,
                                        {
                                            tintColor: headerBackgroundColor,
                                        },
                                    ]}
                                    source={Images.gallery}
                                />
                            </View>
                        );
                    }}
                    renderRight={isPreview ? null : (
                        () => {
                            return (
                                <View style={styles.iconContent}>
                                    <Animated.Image
                                        resizeMode="contain"
                                        style={[
                                            styles.icon,
                                            {
                                                tintColor: headerBackgroundColor,
                                            },
                                        ]}
                                        source={Images.share}
                                    />
                                </View>
                            );
                        }
                    )}
                    onPressLeft={() => {
                        navigation.goBack();
                    }}
                    onPressRight={() => onShare()}
                    onPressRightSecond={() => {
                        navigation.navigate('PreviewImage', {
                            title: business.name,
                            gallery: business.gallery,
                        });
                    }}
                />
            </Animated.View>
            <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always' }}>
                <ScrollView
                    onContentSizeChange={() => {
                        setHeightHeader(Utils.heightHeader());
                    }}
                    overScrollMode={'never'}
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                        [
                            {
                                nativeEvent: {
                                    contentOffset: {y: scrollY},
                                },
                            },
                        ],
                        {
                            useNativeDriver: false,
                        },
                    )}>
                    <View style={{height: 170 - heightHeader}} />
                    <View style={{ paddingHorizontal: 20 }}>
                        {renderContent()}
                    </View>
                    {renderRecentBusinesses()}
                    {renderRelatedBusinesses()}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

PlaceDetailComponent.propTypes = {
    business: PropTypes.object,
};

PlaceDetailComponent.defaultProps = {
    business: {},
};

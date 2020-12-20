import React, {useEffect} from 'react';
import {FlatList, View} from 'react-native';
import {BaseStyle} from '@config';
import {Header, SafeAreaView, CardList, Text, Loading} from '@components';
import {useDispatch, useSelector} from "react-redux";
import {getFavoriteBusinesses} from "../../actions/favorites";
import styles from "../Place/styles";

export default function Favourite({navigation}) {
    const dispatch = useDispatch();

    const stateProps = useSelector(({favorites, businesses}) => {
        return {
            loading: favorites.loadingFavoriteBusinesses,
            data: favorites.favoriteBusinesses,
            ids: businesses.favoriteIds,
        }
    });

    useEffect(() => {
        dispatch(getFavoriteBusinesses())
    }, [stateProps.ids]);

    const listEmptyComponent = () => {
        return (
            <View style={styles.sectionEmpty}>
                <Text semibold style={styles.sectionEmptyText}>
                    No Favourite Available
                </Text>
            </View>
        )
    };

    const navigateBusinessDetail = (id) => {
        navigation.navigate('PlaceDetail', {id})
    };

    return (
        <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
            <Header title='Favourite' />
            <View style={{flex: 1}}>
                <Loading loading={stateProps.loading}/>
                <FlatList
                    contentContainerStyle={{
                        paddingHorizontal: 20,
                        paddingTop: 15,
                        flex: stateProps?.data?.length ? 0 : 1,
                    }}
                    data={stateProps.data}
                    ListEmptyComponent={listEmptyComponent}
                    keyExtractor={(item, index) => item.id}
                    renderItem={({item, index}) => (
                        <CardList
                            image={item?.image}
                            title={item?.name}
                            subtitle={item?.category}
                            rate={item?.averageRatings}
                            style={{marginBottom: 15}}
                            onPress={() => navigateBusinessDetail(item._id)}
                        />
                    )}
                />
            </View>
        </SafeAreaView>
    );
}

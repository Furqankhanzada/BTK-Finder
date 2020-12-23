import React, {useEffect, useState} from 'react';
import { View, Platform } from 'react-native';
import { BaseStyle, BaseColor, useTheme } from '@config';
import {
    Header,
    SafeAreaView,
    Icon,
    Text,
    CustomStepIndicator,
} from '@components';
import styles from './styles';
import TextInputMask from 'react-native-text-input-mask';
import { ScrollView } from 'react-native-gesture-handler';
import ActionButton from 'react-native-action-button';
import {useDispatch, useSelector} from "react-redux";
import {setBusinessFormData} from "../../actions/business";

export default function PriceRange({ navigation }) {

    const dispatch = useDispatch();
    const {colors} = useTheme();
    const cardColor = colors.card;
    const businesses = useSelector(({businesses}) => businesses);
    const { businessFormData } = businesses;
    const [priceFrom, setPriceFrom] = useState('');
    const [priceTo, setPriceTo] = useState('');

    useEffect(() => {
        if(businessFormData.priceRange){
            setPriceFrom(businessFormData.priceRange.from ? businessFormData.priceRange.from : '')
            setPriceTo(businessFormData.priceRange.to ? businessFormData.priceRange.to : '')
        }

    }, []);

    const onNext = () => {
        let payload = {};
        if(priceFrom) {
            payload.priceRange = {
                ...payload.priceRange,
                from : priceFrom
            }
        }
        if(priceTo) {
            payload.priceRange = {
                ...payload.priceRange,
                to : priceTo
            }
        }

        dispatch(setBusinessFormData(payload));

        // navigation.navigate('FinalReview');
        navigation.navigate('Gallery');
    };

    const offsetKeyboard = Platform.select({
        ios: 0,
        android: 20,
    });
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
            <CustomStepIndicator position={3} />
            <ScrollView
                behavior={Platform.OS === 'android' ? 'height' : 'padding'}
                keyboardVerticalOffset={offsetKeyboard}
                style={{ flex: 1, marginTop: 20 }}>
                <View style={styles.contain}>
                    <View style={styles.title}>
                        <Text title3 semibold>
                            Price Range
                        </Text>
                    </View>
                    <TextInputMask
                        style={[BaseStyle.textInput, { backgroundColor: cardColor, color: colors.text }]}
                        refInput={(ref) => {
                            // this.input = ref;
                        }}
                        onChangeText={(text) => setPriceFrom(text)}
                        placeholder="From"
                        placeholderTextColor={BaseColor.grayColor}
                        keyboardType="numeric"
                        value={priceFrom}
                        autoCapitalize="none"
                        mask={'RS [0000000000]'}
                    />
                    <TextInputMask
                        style={[BaseStyle.textInput, { backgroundColor: cardColor, color: colors.text, marginTop:10 }]}
                        refInput={(ref) => {
                            // this.input = ref;
                        }}
                        onChangeText={(text) => setPriceTo(text)}
                        placeholder="To"
                        placeholderTextColor={BaseColor.grayColor}
                        keyboardType="numeric"
                        value={priceTo}
                        autoCapitalize="none"
                        mask={'RS [0000000000]'}
                    />
                </View>
            </ScrollView>
            <ActionButton
                buttonColor={colors.primary}
                nativeFeedbackRippleColor='transparent'
                onPress={() => onNext()}
                offsetX={20}
                offsetY={10}
                icon={
                    <Icon
                        name="arrow-right"
                        size={20}
                        color="white"
                        enableRTL={true} />
                }
            />
        </SafeAreaView>
    );
}

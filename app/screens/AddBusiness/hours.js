import React, {useEffect, useState} from 'react';
import { View } from 'react-native';
import { BaseStyle } from '@config';
import {
    Header,
    SafeAreaView,
    Icon,
    Text,
    CustomStepIndicator,
    HoursCheckbox,
} from '@components';
import styles from './styles';
import { ScrollView } from 'react-native-gesture-handler';
import ActionButton from 'react-native-action-button';
import {useDispatch, useSelector} from "react-redux";
import {setBusinessFormData} from "../../actions/business";

export default function Hours({ navigation }) {
    const dispatch = useDispatch();
    const businesses = useSelector(({businesses}) => businesses);
    const { businessFormData } = businesses;

    const [selectedDays, setSelectedDays] = useState([]);

    useEffect(() => {
        if(businessFormData.openHours && businessFormData.openHours.length){
            setSelectedDays(businessFormData.openHours)
        } else {
            setSelectedDays([
                { day: 'Monday', from: '9:00 am', to: '5:00 pm', isOpen: false },
                { day: 'Tuesday', from: '9:00 am', to: '5:00 pm', isOpen: false },
                { day: 'Wednesday', from: '9:00 am', to: '5:00 pm', isOpen: false },
                { day: 'Thursday', from: '9:00 am', to: '5:00 pm', isOpen: false },
                { day: 'Friday', from: '9:00 am', to: '5:00 pm', isOpen: false },
                { day: 'Saturday', from: '9:00 am', to: '5:00 pm', isOpen: false },
                { day: 'Sunday', from: '9:00 am', to: '5:00 pm', isOpen: false },
            ])
        }
    }, []);

    const onNext = () => {
        let payload = {};
        if(selectedDays && selectedDays.length) {
            payload.openHours = selectedDays
        }
        dispatch(setBusinessFormData(payload));
        navigation.navigate('PriceRange');
    };

    const updateSelectedDays = (payload) => {
        let array = [...selectedDays];
        array.map(el => {
            if(el.day === payload.day) {
                el.isOpen = payload.isOpen;
                if(payload.to) {
                    el.to = payload.to;
                }
                if(payload.from) {
                    el.from = payload.from;
                }
            }
        });
        setSelectedDays(array)
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
            <CustomStepIndicator position={2} />
            <ScrollView
                style={{ flex: 1, marginTop: 20 }}>
                <View style={{ padding: 20, flex: 1 }}>
                    <View style={styles.title}>
                        <Text title3 semibold style={{ textAlign: 'center' }}>
                            Hours
                        </Text>
                    </View>
                    {selectedDays.map((day, index) => {
                        return <HoursCheckbox key={index} day={day} getObject={updateSelectedDays}/>;
                    })}
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

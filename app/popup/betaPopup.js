import { Alert } from 'react-native';

export const showBetaModal = () => {
    let Beta_Version = 'Beta Version';
    let Beta_Message = 'We are excited that you have selected this feature, although it is still in development.';
	Alert.alert(Beta_Version, Beta_Message);
};
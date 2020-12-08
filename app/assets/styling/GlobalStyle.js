import { StyleSheet } from 'react-native';
import { BaseColor } from '@config';

export default StyleSheet.create({
  errorText: {
    fontSize: 12,
    color: 'red',
    marginTop: 5
  },
  inputContainer: {
    flexDirection: 'column',
    width: '100%'
  },
  datePickerContainer: {
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    marginTop: 10,
    padding: 15,
    width: '100%',
    justifyContent: 'center'
    // flex: 1
  },
  datePickerContainerText: {
    color: 'black',
    fontSize: 14
  }
});

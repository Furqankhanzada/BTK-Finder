import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  errorText: {
    fontSize: 12,
    color: 'red',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'column',
    width: '100%',
    position: 'relative',
  },
  datePickerContainer: {
    height: 46,
    borderRadius: 5,
    marginTop: 10,
    padding: 15,
    width: '100%',
    justifyContent: 'center',
    // flex: 1
  },
  datePickerContainerText: {
    fontSize: 14,
  },
});

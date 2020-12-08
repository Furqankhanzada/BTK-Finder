import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  checkBoxSection: {
    display: 'flex',
    flexDirection: 'row',
  },
  checkBox: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: -6,
    width: 130,
  },
  checkBoxText: {
    marginTop: 8,
    marginRight: 15,
  },
  inputsSection: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: -10,
  },
  textInput: {
    marginTop: 17,
    maxWidth: 85,
    height: 30,
    marginRight: 10,
  },
  closeText: {
    marginTop: 15,
    color: 'red',
  },
});

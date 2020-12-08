import { StyleSheet } from 'react-native';
import { BaseColor } from '@config';

export default StyleSheet.create({
  checkBoxSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
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
    color: 'red',
  },
  sectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionInnerContainer: {
    backgroundColor: BaseColor.fieldColor,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
  },
  sectionInnerContainerText: {
    fontSize: 14,
  },
});

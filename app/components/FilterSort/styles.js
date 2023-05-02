import { StyleSheet } from 'react-native';
import { BaseColor } from '@config';

export default StyleSheet.create({
  contain: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  line: {
    width: 1,
    height: 14,
    backgroundColor: BaseColor.grayColor,
    marginLeft: 10,
  },
  contentModeView: {
    width: 30,
    height: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  contentFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  contentFilterBottom: {
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingHorizontal: 20,
  },
  contentSwipeDown: {
    paddingTop: 10,
    alignItems: 'center',
  },
  lineSwipeDown: {
    width: 30,
    height: 2.5,
    backgroundColor: BaseColor.dividerColor,
  },
  contentActionModalBottom: {
    flexDirection: 'row',
    paddingVertical: 15,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  listThumbCircle: {
    paddingHorizontal: 20,
  },
  sectionHeaderTitle: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  selectedRecordText: {
    paddingTop: 10,
    paddingBottom: 5,
  },
  recordSubText: {
    paddingVertical: 10,
  },
  callButton: {
    marginTop: 10,
    marginBottom: 20,
  },
});

import { StyleSheet } from 'react-native';
import { BaseColor } from '@config';

export default StyleSheet.create({
  menuContent: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  lineSwipeDown: {
    width: 30,
    height: 2.5,
    backgroundColor: BaseColor.dividerColor,
  },
  contentSwipeDown: {
    paddingTop: 10,
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 11,
  },
  modalImage: {
    height: 300,
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  contentPadding: {
    paddingHorizontal: 20,
  },
  modalTitle: {
    paddingTop: 10,
  },
  modalDescription: {
    paddingVertical: 10,
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  contentFilterBottom: {
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingHorizontal: 0,
  },
  extraItemsSection: {
    paddingBottom: 10,
  },
  extraItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
  },
});

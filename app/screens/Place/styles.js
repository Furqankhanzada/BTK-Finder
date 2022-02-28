import { StyleSheet } from 'react-native';
import { BaseColor } from '@config';

export default StyleSheet.create({
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: BaseColor.whiteColor,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  iconLocation: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followLocationIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BaseColor.whiteColor,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listFooter: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  sectionEmptyText: {
    textAlign: 'center',
  },
  sectionListContainer: {
    paddingLeft: 5,
    paddingRight: 15,
  },
});

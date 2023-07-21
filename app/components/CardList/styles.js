import { StyleSheet } from 'react-native';
import * as Utils from '@utils';

export default StyleSheet.create({
  contain: {
    flexDirection: 'row',
  },
  contentRate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  image: {
    width: Utils.scaleWithPixel(80),
    height: Utils.scaleWithPixel(80),
    borderRadius: 8,
  },
  deleteIcon: {
    alignSelf: 'center',
    position: 'absolute',
    right: 30,
    width: 25,
    height: 25,
    borderRadius: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    alignSelf: 'center',
    position: 'absolute',
    right: 0,
    width: 25,
    height: 25,
    borderRadius: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRight: {
    position: 'absolute',
    right: 5,
    alignSelf: 'center',
  },
});

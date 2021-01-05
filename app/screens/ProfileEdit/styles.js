import React from 'react';
import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';

export default StyleSheet.create({
  contentTitle: {
    alignItems: 'flex-start',
    width: '100%',
    height: 32,
    justifyContent: 'center',
  },
  contain: {
    alignItems: 'center',
    padding: 20,
  },
  textInput: {
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    padding: 10,
    width: '100%',
    color: BaseColor.grayColor,
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  thumbContainer: {
    flexDirection: 'row',
    position: 'relative',
    borderRadius: 50,
    borderWidth: 1,
    overflow: 'hidden',
    width: 100,
    height: 100,
    marginBottom: 15
  },

  imageLoading: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'red',
    zIndex: 1
  }
});

import React from 'react';
import { StyleSheet } from 'react-native';
import { BaseColor } from '@config';

export default StyleSheet.create({
  contain: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  contentHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  contentLeft: {
    flex: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  thumb: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginRight: 5,
  },
  contentRight: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  contentRate: {
    flex: 1,
    marginTop: 5,
    flexDirection: 'row',
  },
});

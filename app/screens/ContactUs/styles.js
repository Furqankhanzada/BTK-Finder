import React from 'react';
import { StyleSheet } from 'react-native';
import { BaseColor } from '@config';

export default StyleSheet.create({
  contain: {
    padding: 20,
  },
  textInput: {
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  item: {
    marginTop: 8,
    marginBottom: 8,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: { width: 100, height: 100, alignSelf: 'center' },
  text: { marginTop: 10, textAlign: 'center' },
});

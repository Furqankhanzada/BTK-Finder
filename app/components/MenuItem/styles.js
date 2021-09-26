import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  contain: {
    flexDirection: 'column',
    alignItems: 'center',
    width: 110,
    padding: 10,
    borderWidth: 1,
    borderLeftWidth: 0,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginBottom: 5,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
});

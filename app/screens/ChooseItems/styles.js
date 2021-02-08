import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  contain: {
    flex: 1,
    padding: 20,
  },
  item: {
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
});

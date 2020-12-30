import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  textShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  banner: {
    height: 135,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'flex-start',
    width: '100%',
    padding: 20,
  },
  team: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  title: { paddingHorizontal: 20, paddingBottom: 15 },
});

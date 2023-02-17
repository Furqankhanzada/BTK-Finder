import { StyleSheet } from 'react-native';

export const newBusinessStyles = StyleSheet.create({
  keyboardAvoidView: {
    flex: 1,
  },
  scrollViewContainerStyle: {
    flexGrow: 1,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    flex: 1,
    marginTop: 10,
  },
  input: {
    marginTop: 15,
  },
  textArea: {
    height: 80,
    padding: 10,
    marginTop: 15,
  },
  stickyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  stickyFooterEdit: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  footerButton: {
    height: 40,
  },
});

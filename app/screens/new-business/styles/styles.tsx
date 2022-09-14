import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
  },
  input: {
    marginTop: 15,
  },
  stickyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  renderItemList: {
    fontSize: 18,
    lineHeight: 45,
    borderBottomWidth: 2,
  },
  viewContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  itemIcon: {
    marginBottom: 10,
    borderBottomWidth: 0.5,
    paddingBottom: 10,
  },
  activeItem: {
    marginBottom: 10,
    borderBottomWidth: 0.5,
    paddingBottom: 10,
    borderBottomColor: 'blue',
  },
  textPadding: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  fotterButtons: {
    height: 40,
  },
  textArea: {
    height: 80,
    padding: 10,
    marginTop: 10,
  },
  phoneInputView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  phoneInput: {
    marginTop: 5,
    width: '95%',
    paddingHorizontal: 20,
  },
  phoneIcon: {
    marginTop: 2,
    width: '20%',
    textAlign: 'center',
    paddingLeft: 10,
  },
  addMore: {
    display: 'flex',
    alignItems: 'center',
    padding: 10,
  },
  addMoreText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
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
  title: {
    marginBottom: 15,
  },
  contentResultRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  rangeSlider: {
    paddingVertical: 10,
  },
  fontSize: {
    fontSize: 18,
  },
});

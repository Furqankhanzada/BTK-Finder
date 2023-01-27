import { BaseColor } from '@config';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    marginTop: 10,
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollViewContainerStyle: {
    flexGrow: 1,
  },
  scrollView: {
    flex: 1,
  },
  input: {
    marginTop: 15,
  },
  inputDescription: {
    marginTop: 15,
    height: 100,
    padding: 10,
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
  footerButtons: {
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  phoneInput: {
    width: '90%',
    paddingHorizontal: 20,
  },
  phoneIconContainer: {
    width: '10%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
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
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    marginRight: 10,
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
    paddingTop: 15,
    paddingBottom: 8,
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
  thumbnailContainer: {
    marginHorizontal: 10,
    backgroundColor: BaseColor.grayColor,
    height: 150,
    position: 'relative',
    borderRadius: 5,
  },
  thumbnailAddOverlay: {
    height: 150,
    borderRadius: 5,
    backgroundColor: BaseColor.grayColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailAddOverlayText: {
    fontSize: 20,
    textAlign: 'center',
    color: BaseColor.whiteColor,
  },
  galleryImageContainer: {
    width: '93%',
    height: 120,
    margin: 10,
    borderRadius: 5,
    backgroundColor: BaseColor.grayColor,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  galleryImageBox: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BaseColor.grayColor,
  },
  galleryImageSubContainer: {
    width: '33.33%',
    padding: 10,
    height: 120,
    borderRadius: 5,
    position: 'relative',
  },
  gallerySection: {
    marginBottom: 5,
  },
  galleryImageAddIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 52 / 2,
    backgroundColor: BaseColor.whiteColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryImageAddIcon: {
    color: BaseColor.blueColor,
    fontSize: 22,
  },
  galleryActionButton: {
    width: 32,
    height: 32,
    borderRadius: 32,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1,
    right: -10,
    top: -10,
  },
  galleryActionButtonIcon: {
    color: BaseColor.whiteColor,
  },
  galleryImageButton: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
    overflow: 'visible',
  },
  galleryImageBadge: {
    backgroundColor: BaseColor.blueColor,
    color: BaseColor.whiteColor,
    paddingVertical: 5,
    paddingHorizontal: 15,
    position: 'absolute',
    zIndex: 1,
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 4,
  },
  thumbnailSection: {
    marginBottom: 30,
  },
  thumbnailContainerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  gallerySectionImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  galleryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  galleryContainer: {
    flex: 1,
  },
  thumbnailText: {
    textAlign: 'center',
  },
  mapFabButtonContainer: {
    alignItems: 'flex-end',
  },
  mapFabButton: {
    width: 52,
    height: 52,
    borderRadius: 52 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BaseColor.whiteColor,
    shadowColor: BaseColor.kashmir,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20,
  },
  activeMapFabButton: {
    backgroundColor: BaseColor.blueColor,
  },
  mapFabButtonIcon: {
    fontSize: 22,
    color: BaseColor.blueColor,
  },
  activeMapFabButtonIcon: {
    color: BaseColor.whiteColor,
  },
  mapContainer: {
    flex: 1,
    paddingTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  titleCenter: {
    textAlign: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 60,
    right: 10,
    left: 15,
  },
  show: {
    display: 'flex',
  },
  hide: {
    display: 'none',
  },
  flatlistConatiner: {
    paddingVertical: 10,
  },
  facilityView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  facilityViewIcon: {
    marginRight: 10,
  },
});

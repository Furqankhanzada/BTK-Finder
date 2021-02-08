import { StyleSheet } from 'react-native';
import * as Utils from '@utils';
import { BaseColor } from '../../config';

export default StyleSheet.create({
  imageBackground: {
    height: 140,
    width: '100%',
    position: 'absolute',
  },
  contentPage: {
    bottom: 10,
  },
  searchForm: {
    marginHorizontal: 20,
    padding: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    shadowOffset: { width: 1.5, height: 1.5 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 1,
  },
  lineForm: {
    width: 1,
    height: '100%',
    margin: 10,
  },
  serviceItem: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 15,
  },
  serviceCircleIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    marginBottom: 5,
  },
  contentPopular: {
    marginHorizontal: 20,
    marginBottom: 15,
  },
  promotionBanner: {
    height: Utils.scaleWithPixel(100),
    width: '100%',
    marginTop: 10,
  },
  popularItem: {
    width: Utils.scaleWithPixel(135),
    height: Utils.scaleWithPixel(160),
  },

  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    marginHorizontal: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeaderContent: {
    flex: 1,
    alignItems: 'flex-start',
  },
  sectionHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeaderButtonText: {
    fontSize: 16,
    color: BaseColor.blueColor,
  },
  sectionHeaderButtonIcon: {
    marginLeft: 5,
    fontSize: 18,
    color: BaseColor.blueColor,
  },
  sectionLoading: {
    height: Utils.scaleWithPixel(160),
    position: 'relative',
  },
  sectionEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    height: Utils.scaleWithPixel(160),
    flex: 1,
  },
  sectionEmptyText: {
    textAlign: 'center',
  },
  sectionListContainer: {
    paddingLeft: 5,
    paddingRight: 15,
  },
});

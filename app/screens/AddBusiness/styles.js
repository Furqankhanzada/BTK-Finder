import { StyleSheet } from 'react-native';
import { BaseColor } from '@config';

export default StyleSheet.create({
  contain: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    flex: 1,
  },
  textInput: {
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
    width: '100%',
  },
  title: {
    marginHorizontal: 20,
    marginBottom: 15,
  },

  //FOR REVIEW PAGE
  imgBanner: {
    width: '100%',
    height: 250,
    position: 'absolute',
  },
  lineSpace: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rateLine: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  contentIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'white',
    marginRight: 5,
  },
  contentInforAction: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  lineWorkHours: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  wrapContent: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginHorizontal: 20,
    borderBottomWidth: 1,
    paddingBottom: 20,
  },
  contentDescription: {
    marginHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 0.5,
  },

  mapContainer: {
    flex: 1,
    paddingTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 15
  },
  container: {
    // height: 400,
    width: null,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 15,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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
  mapFabButtonIcon: {
    fontSize: 22,
    color: BaseColor.blueColor,
  },

  activeMapFabButton: {
    backgroundColor: BaseColor.blueColor,
  },
  activeMapFabButtonIcon: {
    color: BaseColor.whiteColor,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 60,
    right: 10,
    left: 15,
  },
  titleCenter: {
    textAlign: 'center'
  },
  textArea: {
    height: 100,
    padding: 10
  },
});

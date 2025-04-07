import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import GlobalConfig from '../../components/global-config';

const { APP_CARD_WIDTH, APP_CARD_HEIGHT } = GlobalConfig;

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#ffffff',
  },
  main: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#000',
  },
  simple: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#ffffff',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    padding: 3,
  },
  appContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.white,
  },
  appCard: {
    width: APP_CARD_WIDTH,
    height: APP_CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3,
  },
  appInner: {
    width: APP_CARD_WIDTH,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appIcon: {
    width: 50,
    height: 50,
  },
  appName: {
    fontSize: 10,
  },
  appList: {
    flex: 1,
  },
  appItem: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appItemName: {
    fontSize: 22,
  },
  centerView: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    width: '75%',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  action: {
    width: '100%',
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
  pagination: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: Dimensions.get('window').height,
  }
});

export default styles;

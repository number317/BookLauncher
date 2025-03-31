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
  appContainer: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
  },
  appCard: {
    width: APP_CARD_WIDTH,
    height: APP_CARD_HEIGHT,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appInner: {
    width: '100%',
    height: '100%',
    flex: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: Colors.green,
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  action: {
    width: 400,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 100,
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

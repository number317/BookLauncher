import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import ConstData from '../../components/const-data';

const { APP_CARD_WIDTH, APP_CARD_HEIGHT } = ConstData;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
    backgroundColor: Colors.white,
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
  },
  appIcon: {
    width: 50,
    height: 50,
  },
  appName: {
    fontSize: 10,
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
    height: 200,
    width: 300,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
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

import { StyleSheet } from 'react-native';
import GlobalConfig from '../global-config';

const { NAVIGATION_BAR_WIDTH } = GlobalConfig;

const styles = StyleSheet.create({
  bar: {
    backgroundColor: '#ffffff',
    width: NAVIGATION_BAR_WIDTH,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10, 
    borderRightWidth: 1,
    borderRightColor: '#000000',
    position: 'relative',
  },
  top: {
    
  },
  bottom: {
    
  },
  iconWrap: {
    marginBottom: 10,
  },
  pager: {
    position: 'absolute',
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    top: '50%',
    bottom: '50%',
  }
});

export default styles;

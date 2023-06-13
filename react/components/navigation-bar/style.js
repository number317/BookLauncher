import { StyleSheet } from 'react-native';
import { NAVIGATION_BAR_WIDTH } from '../const-data';

const styles = StyleSheet.create({
  bar: {
    backgroundColor: '#ffffff',
    width: NAVIGATION_BAR_WIDTH,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10, 
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  top: {
    
  },
  bottom: {
    
  },
  iconWrap: {
    marginBottom: 10,
  },
});

export default styles;

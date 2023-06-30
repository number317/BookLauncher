import { Dimensions, StyleSheet } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width,
    height,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  modal: {
    minHeight: 200,
    minWidth: 300,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderRadius: 5,
  },
  modalHeader: {
    height: 25,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: 5,
  },
  modalBody: {
    flex: 1,
  },
});

export default styles;

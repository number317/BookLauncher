import { Dimensions, StyleSheet } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const { width, height } = Dimensions.get('window');

const styles_center = StyleSheet.create({
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
    minHeight: 300,
    minWidth: '75%',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderRadius: 5,
  },
  header: {
    height: 42,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: 5,
  },
  footer: {
    height: 42,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingHorizontal: 15,
  },
  cancel: {
    marginRight: 30,
  },
  ok: {
  },
  actionText: {
    fontSize: 16,
  },
  body: {
    flex: 1,
  },
});

const styles_bottom = StyleSheet.create({
  container: {
    position: 'absolute',
    width,
    height,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 999,
  },
  modal: {
    minHeight: 200,
    width,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderRadius: 5,
  },
  header: {
    height: 42,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: 5,
  },
  body: {
    flex: 1,
  },
});

const styles_fullscreen = StyleSheet.create({
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
    width,
    height,
    backgroundColor: Colors.white,
  },
  header: {
    height: 42,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: 5,
  },
  body: {
    flex: 1,
  },
});

export {
  styles_center,
  styles_bottom,
  styles_fullscreen,
};

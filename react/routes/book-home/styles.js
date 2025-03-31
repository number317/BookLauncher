import { StyleSheet } from 'react-native';

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
  list: {
    flex: 1,
    padding: 5,
  },
  book: {
    borderWidth: 1,
    borderColor: '#000',
    position: 'relative',
  },
  cover: {
    minWidth: 144,
    aspectRatio: 3 / 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  info: {
    position: 'absolute',
  },
});

export default styles;

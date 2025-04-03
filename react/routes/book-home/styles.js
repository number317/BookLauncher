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
  grid: {
    padding: 3,
  },
  book: {
    borderWidth: 1,
    borderColor: '#000',
    position: 'relative',
    margin: 3,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  cover: {
    bottom: 0,
    aspectRatio: 3 / 4,
  },
  info: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    paddingHorizontal: 5,
    width: '100%',
    alignItems: 'flex-end',
  },
  name: {
    fontSize: 8,
    color: '#666',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;

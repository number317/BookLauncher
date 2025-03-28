import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  list: {
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    height: 50,
    paddingHorizontal: 10,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 200,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 150,
  }
});

export default styles;

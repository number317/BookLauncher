import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text, FlatList, TouchableOpacity, NativeModules } from 'react-native';
import TopStatus from '../../components/top-status';
import NavitaionBar from '../../components/navigation-bar';
import { BookCoverView } from '../../components/native-components';
import Store from '../../store';
import styles from './styles';

const { _BookManager } = NativeModules;

const BookHome = () => {
  const { rootStore } = useContext(Store);

  const handleOpenBook = (book) => {
    _BookManager.openBook(book.path);
  };

  return (
    <View style={styles.wrap}>
      <TopStatus />
      <View style={styles.main}>
        <NavitaionBar currentMenu="Book" />
        <View style={styles.list}>
          {
            rootStore.bookList.length > 0 ? (
              <FlatList
                data={rootStore.bookList}
                keyExtractor={(item) => item.name}  
                numColumns={3}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleOpenBook(item)}>
                    <View style={styles.book}>
                      <View style={styles.info}>
                        <Text>{item.name}</Text>
                      </View>
                      <BookCoverView filePath={item.path} style={styles.cover} />
                    </View>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <Text>/sdcard/Books 暂无书籍</Text>
            )
          }
        </View>
      </View>
    </View>
  );
};

export default observer(BookHome);

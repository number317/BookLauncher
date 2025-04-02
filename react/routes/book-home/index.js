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
        {
          rootStore.bookLoading && (
            <View style={styles.empty}>
              <Text>{rootStore.formatMessage('book.loading.tip')}</Text>
            </View>
          )
        }
        {
          rootStore.bookList.length > 0 ? (
            <FlatList
              data={rootStore.bookList}
              keyExtractor={(item) => item.name}  
              numColumns={3}
              contentContainerStyle={styles.grid}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleOpenBook(item)}>
                  <View style={styles.book}>
                    <BookCoverView filePath={item.path} style={{ ...styles.cover, width: rootStore.bookWidth }} />
                    <View style={styles.info}>
                      <Text
                        style={styles.name}
                        numberOfLines={1}
                        ellipsizeMode="middle"
                      >
                        {item.name.split('.')[0]}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <View style={styles.empty}>
              <Text>{rootStore.formatMessage('book.empty.tip')}</Text>
            </View>
          )
        }
      </View>
    </View>
  );
};

export default observer(BookHome);

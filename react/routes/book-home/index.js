import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text, FlatList } from 'react-native';
import TopStatus from '../../components/top-status';
import NavitaionBar from '../../components/navigation-bar';
import Book from './Book';
import Store from '../../store';
import styles from './styles';

const BookHome = () => {
  const { rootStore } = useContext(Store);
  const {
    bookList,
    bookColumns,
    bookRows,
    bookPages,
    bookCurrentPage,
  } = rootStore;

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
          bookList.length > 0 ? (
            <FlatList
              data={bookPages > 1 ? bookList.slice((bookCurrentPage - 1) * bookColumns * bookRows, bookColumns * bookRows * bookCurrentPage) : bookList}
              keyExtractor={(item) => item.name}  
              numColumns={bookColumns}
              pagingEnable
              showHorizontalScrollIndicator={false}
              showVerticalScrollIndicator={false}
              contentContainerStyle={styles.grid}
              renderItem={({ item, index }) => <Book book={item} index={index} />}
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

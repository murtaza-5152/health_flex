import {StyleSheet, Text, FlatList, View, StatusBar} from 'react-native';
import React from 'react';

export const History = ({route}) => {

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar animated={true} backgroundColor="green" />
      <View style={styles.header}>
        <Text style={{fontSize: 20, color: 'white'}}>History </Text>
      </View>
      <View style={{padding: 20}}>
        <Text style={{fontSize: 20, marginTop: 20}}>History</Text>
        <FlatList
          data={route?.params.params}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View style={{padding: 10, borderBottomWidth: 1}}>
              <Text>
                {item.name} - Completed at {item.completedAt}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    header: {
        height: '10%',
        width: '100%',
        backgroundColor: 'green',
        alignItems: 'center',
        justifyContent: 'center',
      },
});

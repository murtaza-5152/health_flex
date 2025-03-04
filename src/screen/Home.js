import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Modal,
  Alert,
  StyleSheet,
  ToastAndroid,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ProgressBar} from 'react-native-paper';
import {History} from './History';

export const Home = ({navigation}) => {
  const [timers, setTimers] = useState([]);
  const [history, setHistory] = useState([]);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [completedTimer, setCompletedTimer] = useState(null);

  useEffect(() => {
    loadTimers();
    loadHistory();
  }, []);

  const loadTimers = async () => {
    const savedTimers = await AsyncStorage.getItem('timers');
    if (savedTimers) setTimers(JSON.parse(savedTimers));
  };

  const loadHistory = async () => {
    const savedHistory = await AsyncStorage.getItem('history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  };

  const saveTimers = async updatedTimers => {
    await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
  };

  const saveHistory = async updatedHistory => {
    await AsyncStorage.setItem('history', JSON.stringify(updatedHistory));
  };

  const addTimer = () => {
    if (!name || !duration || !category)
      return ToastAndroid.show('Please add all the fields', ToastAndroid.LONG);
    const newTimer = {
      id: Date.now(),
      name,
      duration: parseInt(duration),
      category,
      remaining: parseInt(duration),
      status: 'Paused',
      alerted: false,
    };
    const updatedTimers = [...timers, newTimer];
    setTimers(updatedTimers);
    saveTimers(updatedTimers);
    setName('');
    setDuration('');
    setCategory('');
  };

  const startTimer = id => {
    setTimers(prev =>
      prev.map(timer =>
        timer.id === id && timer.status !== 'Completed'
          ? {...timer, status: 'Running'}
          : timer,
      ),
    );
  };

  const pauseTimer = id => {
    setTimers(prev =>
      prev.map(timer =>
        timer.id === id ? {...timer, status: 'Paused'} : timer,
      ),
    );
  };

  const resetTimer = id => {
    setTimers(prev =>
      prev.map(timer =>
        timer.id === id
          ? {
              ...timer,
              remaining: timer.duration,
              status: 'Paused',
              alerted: false,
            }
          : timer,
      ),
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev =>
        prev.map(timer => {
          if (timer.status === 'Running' && timer.remaining > 0) {
            if (
              !timer.alerted &&
              timer.remaining === Math.floor(timer.duration / 2)
            ) {
              Alert.alert('Halfway Alert', `${timer.name} is halfway done!`);
              return {...timer, remaining: timer.remaining - 1, alerted: true};
            }
            return {...timer, remaining: timer.remaining - 1};
          } else if (timer.status === 'Running' && timer.remaining === 0) {
            setCompletedTimer(timer);
            setModalVisible(true);
            const newHistory = [
              ...history,
              {name: timer.name, completedAt: new Date().toLocaleString()},
            ];
            setHistory(newHistory);
            saveHistory(newHistory);
            return {...timer, status: 'Completed'};
          }
          return timer;
        }),
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [history]);

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <StatusBar animated={true} backgroundColor="green" />
      <View style={styles.header}>
        <Text style={{fontSize: 20, color: 'white'}}>Timer Details </Text>
      </View>
      <View style={{padding: 20}}>
        <TextInput
          placeholder="Timer Name"
          value={name}
          placeholderTextColor={'black'}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Duration (seconds)"
          value={duration}
          placeholderTextColor={'black'}
          onChangeText={setDuration}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="Category"
          value={category}
          placeholderTextColor={'black'}
          onChangeText={setCategory}
          style={styles.input}
        />
        <Button title="Add Timer" onPress={addTimer} />

        <FlatList
          data={timers}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View style={styles.timerContainer}>
              <ProgressBar
                progress={item.remaining / item.duration}
                color={'green'}
                style={{height: 10, marginVertical: 5}}
              />
              <Text>
                {item.name} - {item.remaining}s ({item.status})
              </Text>
              <Button title="Start" onPress={() => startTimer(item.id)} />
              <Button title="Pause" onPress={() => pauseTimer(item.id)} />
              <Button title="Reset" onPress={() => resetTimer(item.id)} />
            </View>
          )}
        />
        {history.length != 0 && (
          <View style={{marginTop: 10}}>
            <Button
              title="History"
              onPress={() => navigation.navigate('History', {params: history}) }
            />
          </View>
        )}

        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={styles.successContainer}>
            <View style={styles.successInnerContainer}>
              <Text>Congratulations! {completedTimer?.name} is completed.</Text>
              <Button title="OK" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
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
  input: {borderWidth: 1, padding: 5, marginBottom: 10},
  timerContainer: {marginVertical: 10, padding: 10, borderWidth: 1},
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  successInnerContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
});

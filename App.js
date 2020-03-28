import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';

import Header from './components/Header';
import StartGameScreen from './screens/StartGameScreen';
import GameScreen from './screens/GameScreen';
import GameOverScreen from './screens/GameOverScreen';


const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
  });
};

export default function App() {
  const [userNumber, setUserNumber] = useState();
  const [numberOfRounds, setNumberOfRounds] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);

  if (!dataLoaded) { // if we havent loaded fonts...
    // ... then return AppLoading component from expo AppLoading will fetch fonts.
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setDataLoaded(true)}
        onError={(error) => console.log(error)}
      />
    );
  }

  const configureNewGameHandler = () => {
    setNumberOfRounds(0);
    setUserNumber(null);
  };

  const startGameHandler = (selectedNumber) => {
    setUserNumber(selectedNumber);
  };

  const gameOverHandler = (rounds) => {
    setNumberOfRounds(rounds);
  };

  let contentToShow = <StartGameScreen onStartGame={startGameHandler} />;

  if (userNumber && numberOfRounds <= 0) {
    contentToShow = <GameScreen userChoice={userNumber} onGameOver={gameOverHandler}/>;
  }
  else if (numberOfRounds > 0) {
    contentToShow = (
      <GameOverScreen
        numberOfRounds={numberOfRounds}
        userNumber={userNumber}
        onRestart={configureNewGameHandler}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <Header title="Guess a Number"/>
      {contentToShow}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  }
});

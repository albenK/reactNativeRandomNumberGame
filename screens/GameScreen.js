import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Alert} from 'react-native';

import NumberContainer from '../components/NumberContainer';
import Card from '../components/Card';
import MainButton from '../components/MainButton';

import DefaultStyles from '../constants/default-styles';


const generateRandomBetween = (min, max, exclude) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    const randomNumber = Math.random() * (max - min);
    const roundedDown = Math.floor(randomNumber) + min;
    /* if the random number happens to be the number we want to exclude...*/
    if (roundedDown === exclude) {
        /* ... then call this function again...*/
        return generateRandomBetween(min, max, exclude);
    }
    return roundedDown;
};

const GameScreen = (props) => {
    // currentGuess refers to computers guess.
    const [currentGuess, setCurrentGuess] = useState(generateRandomBetween(1, 100, props.userChoice));
    const [numberOfRounds, setNumberOfRounds] = useState(0);
    const currentLow = useRef(1);
    const currentHigh = useRef(100);

    const { userChoice, onGameOver} = props;

    useEffect(() => {
        if (currentGuess === userChoice) {
            onGameOver(numberOfRounds);
        }
    }, [currentGuess, userChoice, onGameOver]);

    const nextGuessHandler = (direction) => {
        /* If user tries to cheat. If user presses lower when computer guess is already lower than answer
        or when user presses greater when computer  guess is already greater than answer.*/
        if (
            (direction === 'lower' && currentGuess < props.userChoice)
            || (direction === 'greater' && currentGuess > props.userChoice)
        ) {
            Alert.alert('Don\'t lie!', 'You know this is wrong....', [{text: 'Sorry!', style:'cancel'}]);
            return;
        }

        if (direction === 'lower') { // if user presses lower...
            // ... then the maximum bound becomes the current guess.
            currentHigh.current = currentGuess;
        }
        else if (direction === 'greater') { // if user presses greater...
            // ... then the minimum bound becomes currentGuess.
            currentLow.current = currentGuess;
        }
        const nextNumber = generateRandomBetween(currentLow.current, currentHigh.current, currentGuess);
        setCurrentGuess(nextNumber);
        setNumberOfRounds(currentRound => currentRound + 1);
    };

    return (
        <View style={styles.screen}>
            <Text style={DefaultStyles.title}>Opponent's guess</Text>
            <NumberContainer>{currentGuess}</NumberContainer>
            <Card style={styles.buttonContainer}>
                <MainButton onPress={nextGuessHandler.bind(this, 'lower')}>LOWER</MainButton>
                <MainButton onPress={nextGuessHandler.bind(this, 'greater')}>GREATER</MainButton>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 10,
        alignItems: 'center'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        width: 400,
        maxWidth: '90%'
    }
});

export default GameScreen;
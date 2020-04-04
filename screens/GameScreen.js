import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import NumberContainer from '../components/NumberContainer';
import Card from '../components/Card';
import MainButton from '../components/MainButton';
import BodyText from '../components/BodyText';

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

const renderListItem = (value, numberOfRounds) => {
    return  (
        <View key={value} style={styles.listItem}>
            <BodyText>#{numberOfRounds}</BodyText>
            <BodyText>{value}</BodyText>
        </View>
    );
};

const GameScreen = (props) => {
    const initialGuess = generateRandomBetween(1, 100, props.userChoice);
    // currentGuess refers to computers guess.
    const [currentGuess, setCurrentGuess] = useState(initialGuess);
    const [pastGuesses, setPastGuesses] = useState([initialGuess]); // an array containing all of the guesses computer has made.
    const currentLow = useRef(1);
    const currentHigh = useRef(100);

    const { userChoice, onGameOver} = props;

    useEffect(() => {
        if (currentGuess === userChoice) {
            onGameOver(pastGuesses.length);
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
            // ... then the minimum bound becomes currentGuess + 1.
            currentLow.current = currentGuess + 1;
        }
        const nextNumber = generateRandomBetween(currentLow.current, currentHigh.current, currentGuess);
        setCurrentGuess(nextNumber);
        // setNumberOfRounds(currentRound => currentRound + 1);
        setPastGuesses((currentStateOfPastGuesses) => {
            return [nextNumber, ...currentStateOfPastGuesses];
        });
    };

    return (
        <View style={styles.screen}>
            <Text style={DefaultStyles.title}>Opponent's guess</Text>
            <NumberContainer>{currentGuess}</NumberContainer>
            <Card style={styles.buttonContainer}>
                <MainButton onPress={nextGuessHandler.bind(this, 'lower')}>
                    <Ionicons name="md-remove" size={34} color="white" />
                </MainButton>
                <MainButton onPress={nextGuessHandler.bind(this, 'greater')}>
                    <Ionicons name="md-add" size={34} color="white" />
                </MainButton>
            </Card>

            <View style={styles.listContainer}>
                <ScrollView contentContainerStyle={styles.list}>
                    {pastGuesses.map((guess, index) => renderListItem(guess, pastGuesses.length - index))}
                </ScrollView>
            </View>
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
    },
    listContainer: {
        flex: 1,
        width: '80%'
    },
    list: {
        flexGrow: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    listItem: {
        width: '60%',
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 15,
        marginVertical: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});

export default GameScreen;
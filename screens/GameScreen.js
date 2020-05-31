import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, Alert, Dimensions} from 'react-native';

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

const renderListItem = (listLength, itemData) => {
    return  (
        <View style={styles.listItem}>
            <BodyText>#{listLength - itemData.index}</BodyText>
            <BodyText>{itemData.item}</BodyText>
        </View>
    );
};

const GameScreen = (props) => {
    const initialGuess = generateRandomBetween(1, 100, props.userChoice);
    // currentGuess refers to computers guess.
    const [currentGuess, setCurrentGuess] = useState(initialGuess);
    const [pastGuesses, setPastGuesses] = useState([initialGuess.toString()]); // an array containing all of the guesses computer has made.
    const [availableDeviceWidth, setAvailableDeviceWidth] = useState(Dimensions.get('window').width);
    const [availableDeviceHeight, setAvailableDeviceHeight] = useState(Dimensions.get('window').height);

    const currentLow = useRef(1);
    const currentHigh = useRef(100);

    const { userChoice, onGameOver} = props;

    useEffect(() => {
        const updateLayout = () => {
            setAvailableDeviceWidth(Dimensions.get('window').width);
            setAvailableDeviceHeight(Dimensions.get('window').height);
        };
        /* Detect orientation change and run updateLayout function.
         When user switches orientation, we need to update some styles. */
        Dimensions.addEventListener('change', updateLayout);
        return () => {
            Dimensions.removeEventListener('change', updateLayout);
        };
    });

    useEffect(() => {
        if (currentGuess === userChoice) {
            onGameOver(pastGuesses.length);
        }
    }, [currentGuess, userChoice, onGameOver]);

    const nextGuessHandler = (direction) => {
        /* If user tries to cheat. If user presses lower when computer guess is already lower than answer
        or when user presses greater when computer guess is already greater than answer.*/
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
            return [nextNumber.toString(), ...currentStateOfPastGuesses];
        });
    };

    let pastGuessesListStyle = styles.listContainer;
    if (availableDeviceWidth < 350) { // if its a small device..
        pastGuessesListStyle = styles.listContainerBig;
    }

    let gameControls = (
        <React.Fragment>
            <NumberContainer>{currentGuess}</NumberContainer>
            <Card style={styles.buttonContainer}>
                <MainButton onPress={nextGuessHandler.bind(this, 'lower')}>
                    <Ionicons name="md-remove" size={34} color="white" />
                </MainButton>
                <MainButton onPress={nextGuessHandler.bind(this, 'greater')}>
                    <Ionicons name="md-add" size={34} color="white" />
                </MainButton>
            </Card>
        </React.Fragment>
    );

    if (availableDeviceHeight < 500) {
        gameControls = (
            <View style={styles.controls}>
                <MainButton onPress={nextGuessHandler.bind(this, 'lower')}>
                     <Ionicons name="md-remove" size={34} color="white" />
                </MainButton>
                <NumberContainer>{currentGuess}</NumberContainer>
                <MainButton onPress={nextGuessHandler.bind(this, 'greater')}>
                    <Ionicons name="md-add" size={34} color="white" />
                </MainButton>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            <Text style={DefaultStyles.title}>Opponent's guess</Text>
            {gameControls}

            <View style={pastGuessesListStyle}>
                {/* <ScrollView contentContainerStyle={styles.list}>
                    {pastGuesses.map((guess, index) => renderListItem(guess, pastGuesses.length - index))}
                </ScrollView> */}
                <FlatList
                    data={pastGuesses}
                    keyExtractor={(item) => item}
                    renderItem={renderListItem.bind(this, pastGuesses.length)}
                    contentContainerStyle={styles.list}
                />
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
        marginTop: Dimensions.get('window').height > 600 ? 20 : 5,
        width: 400,
        maxWidth: '90%'
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '80%'
    },
    listContainer: {
        flex: 1,
        width: '60%'
    },
    listContainerBig: {
        flex: 1,
        width: '80%' 
    },
    list: {
        flexGrow: 1,
        justifyContent: 'flex-end'
        // alignItems: 'center'
    },
    listItem: {
        width: '100%',
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
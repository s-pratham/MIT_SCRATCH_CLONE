import React, { useState, useRef, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../app/types';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ActionScreen from './ActionScreen';

const characters = [
  { id: 1, name: 'Cat', image: require('../assets/cat.png') },
  { id: 2, name: 'Dog', image: require('../assets/dog.png') },
  { id: 3, name: 'Penguin', image: require('../assets/penguin.png') },
  { id: 4, name: 'Scratch', image: require('../assets/scratch.png') },
];

type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

type CharacterState = {
  size: number;
  position: { x: number; y: number };
  rotation: number;
  message: string;
};

type CharacterStates = {
  [key: string]: CharacterState;
};

const HomeScreen = ({ navigation }: any) => { 
  const route = useRoute<HomeScreenRouteProp>();
  const initialActions = route.params?.actions || {};
  const [actions, setActions] = useState(initialActions); // Initialize with actions from route params
  const [visibleCharacters, setVisibleCharacters] = useState<number[]>([]);
  const [characterStates, setCharacterStates] = useState<CharacterStates>(
    characters.reduce((acc, char) => ({
      ...acc,
      [char.id]: {
        size: 50,
        position: { x: 0, y: 0 },
        rotation: 0,
        message: '',
      },
    }), {} as CharacterStates)
  );

  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const handleGestureEnd = useCallback(
    (characterId: string, event) => {
      const { translationX, translationY } = event.nativeEvent;
      setCharacterStates((prev) => ({
        ...prev,
        [characterId]: {
          ...prev[characterId],
          position: {
            x: Math.ceil(prev[characterId].position.x + translationX),
            y: Math.ceil(prev[characterId].position.y + translationY),
          },
        },
      }));
      translateX.setValue(0);
      translateY.setValue(0);
    },
    []
  );

  const checkAndHandleCollisions = () => {
    const newActions = { ...actions }; // Create a copy of actions
    const charactersArray = Object.entries(characterStates);
  
    // Check for collisions between each pair of characters
    for (let i = 0; i < charactersArray.length; i++) {
      for (let j = i + 1; j < charactersArray.length; j++) {
        const [charIdA, stateA] = charactersArray[i];
        const [charIdB, stateB] = charactersArray[j];
  
        // Check if both characters occupy the same position and are not at the default position (0, 0)
        if (
          stateA.position.x === stateB.position.x &&
          stateA.position.y === stateB.position.y &&
          !(stateA.position.x === 0 && stateA.position.y === 0)
        ) {
          // Swap actions between the two characters
          const tempAction = newActions[charIdA];
          newActions[charIdA] = newActions[charIdB];
          newActions[charIdB] = tempAction;
  
          console.log(`Collision detected between ${charIdA} and ${charIdB}. Actions swapped.`);
        }
      }
    }
  
    setActions(newActions); // Update the actions state with swapped actions
  };
  

  const handleReset = useCallback(() => {
    setCharacterStates((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([id, state]) => [
          id,
          { ...state, position: { x: 0, y: 0 }, size: 50, rotation: 0, message: '' },
        ])
      )
    );
  }, []);

  const executeAction = useCallback(
    async (action, characterId) => {
      setCharacterStates((prev) => {
        const characterState = prev[characterId];
        switch (action) {
          case 'Increase Size':
            return { ...prev, [characterId]: { ...characterState, size: characterState.size + 10 } };
          case 'Decrease Size':
            return { ...prev, [characterId]: { ...characterState, size: Math.max(characterState.size - 10, 10) } };
          case 'Move X by 50':
            return { ...prev, [characterId]: { ...characterState, position: { ...characterState.position, x: characterState.position.x + 50 } } };
          case 'Move Y by 50':
            return { ...prev, [characterId]: { ...characterState, position: { ...characterState.position, y: characterState.position.y + 50 } } };
          case 'Move X=50, Y=50':
            return { ...prev, [characterId]: { ...characterState, position: { x: characterState.position.x + 50, y: characterState.position.y + 50 } } };
          case 'Go to (0,0)':
            return { ...prev, [characterId]: { ...characterState, position: { x: 0, y: 0 } } };
          case 'Go to random position':
            return { ...prev, [characterId]: { ...characterState, position: { x: Math.random() * 200, y: Math.random() * 200 } } };
          case 'Say Hello':
            return { ...prev, [characterId]: { ...characterState, message: 'Hello' } };
          case 'Rotate 180':
            return { ...prev, [characterId]: { ...characterState, rotation: characterState.rotation + 180 } };
          default:
            return prev;
        }
      });
      if (action === 'Say Hello') {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setCharacterStates((prev) => ({
          ...prev,
          [characterId]: { ...prev[characterId], message: '' },
        }));
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
    []
  );

  const addActionForCharacter = (characterId, newAction) => {
    setActions((prevActions) => {
      const updatedActions = { ...prevActions };
      updatedActions[characterId] = newAction; // Replace or add the new action
      console.log(`Updated actions for ${characterId}:`, updatedActions[characterId]);
      return updatedActions;
    });
  };

  // Effect to update actions when route params change
  useEffect(() => {
    const newActions = route.params?.actions || {};
    Object.entries(newActions).forEach(([characterId, action]) => {
      addActionForCharacter(characterId, action);
    });
  }, [route.params?.actions]);

  const handlePlay = useCallback(async () => {
    console.log("Final Actions:", actions); // Log the actions to verify they are set correctly

    const playActions = characters.map((character) => {
      const characterActions = actions[character.id] || []; // Retrieve actions by id

      return characterActions.reduce(async (prevAction, action) => {
        await prevAction;
        await executeAction(action, character.id);
        checkAndHandleCollisions(); // Check for collisions after each action
      }, Promise.resolve());
    });

    await Promise.all(playActions); // Run all character actions concurrently
  }, [actions, executeAction]);

  const addCharacterToStage = () => {
    const nextCharacter = characters.find((char) => !visibleCharacters.includes(char.id));
    if (nextCharacter) {
      setVisibleCharacters((prev) => [...prev, nextCharacter.id]);
      setCharacterStates((prev) => ({
        ...prev,
        [nextCharacter.id]: {
          size: 50,
          position: { x: 0, y: 0 },
          rotation: 0,
          message: '',
        },
      }));
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Image source={require('../assets/scratch_logo.png')} style={styles.logo} />
        <Text style={styles.signInText}>Sign In</Text>
      </View>

      <View style={styles.stage}>
        {visibleCharacters.map((characterId) => {
          const character = characters.find((char) => char.id === characterId);
          const characterState = characterStates[characterId];
          const animatedStyle = {
            transform: [
              { translateX: characterState.position.x },
              { translateY: characterState.position.y },
              { rotate: `${characterState.rotation}deg` },
            ],
          };
          return (
            <PanGestureHandler
              key={characterId}
              onGestureEvent={Animated.event(
                [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
                { useNativeDriver: false }
              )}
              onHandlerStateChange={(event) =>
                event.nativeEvent.state === State.END && handleGestureEnd(characterId.toString(), event)
              }
            >
              <Animated.View style={[styles.sprite, animatedStyle]}>
                <Image source={character.image} style={{ width: characterState.size, height: characterState.size }} />
                {characterState.message !== '' && <Text style={{ textAlign: 'center' }}>{characterState.message}</Text>}
              </Animated.View>
            </PanGestureHandler>
          );
        })}
      </View>

      <View style={styles.controlBar}>
        <TouchableOpacity onPress={handlePlay}>
          <Text>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleReset}>
          <Text>Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.characterListSection}>
        <FlatList
          data={characters}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => {
                addActionForCharacter(item.id, 'Move X by 50');
                navigation.navigate('Action', { character: item });
              }} 
              style={styles.characterContainer}
            >
              <Image source={item.image} style={styles.characterIcon} />
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.characterList}
        />
        <TouchableOpacity onPress={addCharacterToStage} style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer independent>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Action" component={ActionScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#4285F4',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 40,
  },
  signInText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  stage: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  sprite: {
    position: "absolute",
    width: 50,
    height: 50,
  },
  controlBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  positionControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    width: 50,
    marginHorizontal: 5,
  },
  characterListSection: {
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  characterList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  characterContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  characterIcon: {
    width: 50,
    height: 50,
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

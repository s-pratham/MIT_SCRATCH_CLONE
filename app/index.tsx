import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../app/types';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ActionScreen from './ActionScreen';
const characters = [
  { id: '1', name: 'Cat', image: require('../assets/cat.png') },
  { id: '2', name: 'Dog', image: require('../assets/dog.png') },
  { id: '3', name: 'Penguin', image: require('../assets/penguin.png') },
];

type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: any) => {
  const route = useRoute<HomeScreenRouteProp>();
  const { actions } = route.params || {}; // Get actions from params

  const [selectedCharacter, setSelectedCharacter] = useState(characters[0]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState(50); // Initial size for the sprite

  useEffect(() => {
    if (actions && actions.length > 0) {
      // Process each action
      actions.forEach((action) => {
        switch (action) {
          case 'Increase Size':
            setSize((prevSize) => prevSize + 10); // Increase the size by 10
            break;
          case 'Decrease Size':
            setSize((prevSize) => Math.max(prevSize - 10, 10)); // Decrease size but don't go below 10
            break;
          case 'Move X by 50':
            setPosition((prevPos) => ({ ...prevPos, x: prevPos.x + 50 }));
            break;
          case 'Move Y by 50':
            setPosition((prevPos) => ({ ...prevPos, y: prevPos.y + 50 }));
            break;
          case 'Go to (0,0)':
            setPosition({ x: 0, y: 0 });
            break;
          case 'Go to random position':
            setPosition({
              x: Math.random() * 100, // Example of random movement
              y: Math.random() * 100,
            });
            break;
          // Add more cases here as per your actions
          default:
            console.log(`Unhandled action: ${action}`);
        }
      });
    }
  }, [actions]);

  const handlePositionChange = (axis: 'x' | 'y', value: string) => {
    setPosition((prev) => ({ ...prev, [axis]: parseFloat(value) }));
  };

  const renderCharacter = ({ item }: any) => (
    <TouchableOpacity onPress={() => navigation.navigate('Action', { character: item })} style={styles.characterContainer}>
      <Image source={item.image} style={styles.characterIcon} />
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Image source={require('../assets/scratch_logo.png')} style={styles.logo} />
        <Text style={styles.signInText}>Sign In</Text>
      </View>

      {/* Main Stage (Sprite Display) */}
      <View style={styles.stage}>
        <Image
          source={selectedCharacter.image}
          style={[
            styles.sprite,
            { transform: [{ translateX: position.x }, { translateY: position.y }], width: size, height: size }, // Apply size state
          ]}
        />
      </View>

      {/* Control Bar */}
      <View style={styles.controlBar}>
        <Text>Sprite: {selectedCharacter.name}</Text>
        <View style={styles.positionControls}>
          <Text>X</Text>
          <TextInput
            style={styles.input}
            value={position.x.toString()}
            onChangeText={(value) => handlePositionChange('x', value)}
            keyboardType="numeric"
          />
          <Text>Y</Text>
          <TextInput
            style={styles.input}
            value={position.y.toString()}
            onChangeText={(value) => handlePositionChange('y', value)}
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Character List Section */}
      <View style={styles.characterListSection}>
        <FlatList
          data={characters}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={renderCharacter}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.characterList}
        />
        
      </View>
    </View>
  );
};
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Action" component={ActionScreen} />
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
  addCharacterButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginLeft: 10,
  },
  addText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

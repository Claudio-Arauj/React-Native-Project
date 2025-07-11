import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import { StackParamList } from '../styles/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import styles from '../styles/welcomeStyles'

type NavigationProps = NativeStackNavigationProp<StackParamList>;

export default function WelcomeScreen(){
  const navigation = useNavigation<NavigationProps>();

  return (
    <View style={styles.container}>

      <View style={styles.containerLogo}>
        <Animatable.Image
          animation="flipInY" // corrigido aqui
          source={require('../assets/logo.png')}
          style={{ width: '100%' }}
          resizeMode="contain"
        />
      </View>

      <Animatable.View delay={600} animation="fadeInUp" style={styles.containerForm}>
        <Text style={styles.title}>Cultive bons hábitos e supere vícios!</Text>
        <Text style={styles.text}>Faça o login para começar</Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Acessar</Text>
        </TouchableOpacity>
      </Animatable.View>

    </View>
  );
}



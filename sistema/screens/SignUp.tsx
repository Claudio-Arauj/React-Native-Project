import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import { StackParamList } from '../styles/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type NavigationProps = NativeStackNavigationProp<StackParamList>;

export default function SignUp() {
  const navigation = useNavigation<NavigationProps>();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <Animatable.View animation="fadeInLeft" delay={300} style={styles.containerHeader}>
        <Text style={styles.message}>Crie sua conta</Text>
        <Text style={styles.subMessage}>Junte-se à nossa jornada de bem-estar</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={600} style={styles.containerForm}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          placeholder="Digite seu nome"
          placeholderTextColor="#999"
          style={styles.input}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Digite seu email"
          placeholderTextColor="#999"
          style={styles.input}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          placeholder="Crie uma senha"
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={() => navigation.replace('MainApp')}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerContainer} onPress={() => navigation.goBack()}>
          <Text style={styles.registerText}>
            Já possui uma conta? <Text style={styles.registerLink}>Entrar</Text>
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3EB489',
  },
  containerHeader: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: '8%',
    paddingTop: 60,
  },
  message: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  subMessage: {
    fontSize: 16,
    color: '#E0F5EF',
    marginTop: 6,
  },
  containerForm: {
    flex: 2,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: '8%',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    height: 44,
    backgroundColor: '#F1F1F1',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#3EB489',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: '#888',
  },
  registerLink: {
    color: '#3EB489',
    fontWeight: 'bold',
  },
});

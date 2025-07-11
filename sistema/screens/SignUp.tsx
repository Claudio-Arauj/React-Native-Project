import React, { useState } from 'react';
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

import styles from '../styles/signupStyles'

import app from '../firebase-config';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';


type NavigationProps = NativeStackNavigationProp<StackParamList>;

export default function SignUp() {
  const navigation = useNavigation<NavigationProps>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignUp = async () => {
    setSuccessMessage('');
    setErrorMessage('');

    if (!name || !email || !password) {
      setErrorMessage('Preencha todos os campos.');
      return;
    }

    const auth = getAuth(app);
    const db = getFirestore(app);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Salvar no Firestor
      await setDoc(doc(db, 'usuarios', user.uid), {
        nome: name,
        email: user.email,
        criadoEm: new Date().toISOString(),
      });

      setSuccessMessage('Cadastro realizado com sucesso! Redirecionando...');
      setTimeout(() => {
        navigation.replace('Login');
      }, 2000);
    } catch (error: any) {
      console.log('Erro no cadastro:', error);

      let msg = 'Erro ao criar conta. Tente novamente.';
      if (error.code === 'auth/email-already-in-use') msg = 'Este email já está em uso.';
      if (error.code === 'auth/invalid-email') msg = 'Email inválido.';
      if (error.code === 'auth/weak-password') msg = 'A senha deve ter pelo menos 6 caracteres.';
      if (error.code === 'auth/network-request-failed') msg = 'Sem conexão com a internet.';

      setErrorMessage(msg);
    }
  };

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

        {/* Mensagem de sucesso */}
        {successMessage ? (
          <Text style={styles.successMessage}>{successMessage}</Text>
        ) : null}

        {/* Mensagem de erro */}
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}

        <Text style={styles.label}>Nome</Text>
        <TextInput
          placeholder="Digite seu nome"
          placeholderTextColor="#999"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Digite seu email"
          placeholderTextColor="#999"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          placeholder="Crie uma senha"
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
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


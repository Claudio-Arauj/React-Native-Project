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

import styles from '../styles/loginStyles'

import app from '../firebase-config';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import { useEffect } from 'react';
import { buscarMensagemAleatoria, inicializarBanco } from '../data/bancoSq';


type NavigationProps = NativeStackNavigationProp<StackParamList>;

export default function SignIn() {
  const navigation = useNavigation<NavigationProps>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    async function carregarMensagem() {
      await inicializarBanco();
      const texto = await buscarMensagemAleatoria();
      if (texto) setMensagem(texto);
    }

    carregarMensagem();
  }, []);



  const handleLogin = async () => {
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Preencha todos os campos.');
      return;
    }

    const auth = getAuth(app);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('MainApp'); // Redireciona após login bem-sucedido
    } catch (error: any) {
      let msg = 'Erro ao fazer login.';
      if (error.code === 'auth/invalid-email') msg = 'Email inválido.';
      if (error.code === 'auth/user-not-found') msg = 'Usuário não encontrado.';
      if (error.code === 'auth/wrong-password') msg = 'Senha incorreta.';
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

        {mensagem !== '' && (
          <Animatable.View animation="fadeIn" delay={500} style={styles.caixaMensagem}>
            <Text style={styles.mensagemTexto}>{mensagem}</Text>
          </Animatable.View>
        )}


        <Text style={styles.message}>Bem-vindo(a) de volta</Text>
        <Text style={styles.subMessage}>Vamos continuar sua jornada de bem-estar</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={600} style={styles.containerForm}>

        {/* Mensagem de erro */}
        {errorMessage !== '' && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}

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
          placeholder="Digite sua senha"
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Acessar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerContainer} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.registerText}>
            Não possui uma conta? <Text style={styles.registerLink}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    </KeyboardAvoidingView>
  );
}


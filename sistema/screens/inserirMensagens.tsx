

// Screen temporaria para adcionar novas mensagens

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import app from '../firebase-config';
import { MensagemMotivacional } from '../models/mensagemMotivacional';

const db = getFirestore(app);

const mensagensTexto = [
  'A persistência realiza o impossível.',
  'Você é mais forte do que pensa.',
  'Cada passo te aproxima do seu objetivo.',
  'A disciplina é a ponte entre metas e realizações.',
  'Pequenas conquistas diárias constroem grandes vitórias.',
  'Hoje é um bom dia para começar algo novo.',
  'Foco, força e fé.',
  'Seja constante, não perfeito.',
];

export default function InserirMensagensScreen() {
  const [carregando, setCarregando] = useState(false);

  const inserirMensagens = async () => {
    setCarregando(true);
    const ref = collection(db, 'mensagens_motivacionais');

    try {
      for (const texto of mensagensTexto) {
        const msg = new MensagemMotivacional(texto);
        await addDoc(ref, {
          mensagem: msg.mensagem,
          ativo: msg.ativo,
        });
        console.log(`✅ Mensagem adicionada: "${msg.mensagem}"`);
      }
      Alert.alert('Sucesso', 'Todas as mensagens foram adicionadas.');
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Falha ao inserir mensagens.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Inserir Frases Motivacionais</Text>

      <TouchableOpacity
        style={estilos.botao}
        onPress={inserirMensagens}
        disabled={carregando}
      >
        {carregando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={estilos.botaoTexto}>Inserir Mensagens</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  botao: {
    backgroundColor: '#2b8a3e',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 3,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Modal, TextInput, Button, Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../styles/globalStyles';
import estilos from '../styles/habitosStyles';

import { getAuth } from 'firebase/auth';
import app from '../firebase-config';

import { MetaHabito } from '../models/habito';
import { adicionarHabito, observarHabitos, excluirHabito } from '../services/habitoService';
import HabitoCard from '../components/HabitoCard';

export default function HabitosScreen() {
  const auth = getAuth(app);
  const user = auth.currentUser;

  const [habitos, setHabitos] = useState<MetaHabito[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState('');
  const [frequencia, setFrequencia] = useState('');
  const [lembreteHorario, setLembreteHorario] = useState('');
  const [cor, setCor] = useState('');

  useEffect(() => {
    if (!user) return;

    const unsubscribe = observarHabitos(user.uid, setHabitos);
    return () => unsubscribe();
  }, [user]);

  const handleAdicionarHabito = async () => {
    if (!user || !nome || !frequencia) return;

    const novo = new MetaHabito(
      '', // id será preenchido pelo Firestore
      user.uid,
      nome,
      frequencia as 'diária' | 'semanal',
      new Date(),
      lembreteHorario || undefined,
      cor || undefined
    );

    await adicionarHabito(user.uid, novo);
    setModalVisible(false);
    setNome('');
    setFrequencia('');
    setLembreteHorario('');
    setCor('');
  };

  const handleExcluirHabito = (id: string) => {
    Alert.alert(
      'Excluir Hábito',
      'Tem certeza que deseja excluir este hábito?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            if (!user) return;
            try {
              await excluirHabito(user.uid, id);
            } catch (error) {
              console.error('Erro ao excluir hábito:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };



  const renderItem = ({ item }: { item: MetaHabito }) => (
    <HabitoCard habito={item} onDelete={handleExcluirHabito} />
  );



  return (
    <View style={[styles.container, { backgroundColor: '#e6e6e6', flex: 1 }]}>
      <Text style={estilos.title}>Hábitos</Text>
      <Text style={estilos.subtitle}>Crie e acompanhe seus hábitos saudáveis aqui.</Text>

      <FlatList
        data={habitos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 140 }}
      />

      <TouchableOpacity style={estilos.botao} onPress={() => setModalVisible(true)}>
        <Text style={estilos.botaoTexto}>+ Novo Hábito</Text>
      </TouchableOpacity>

      {/* Modal de criação */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={estilos.modalContainer}>
          <View style={estilos.modalContent}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Novo Hábito</Text>

            <TextInput
              placeholder="Nome"
              value={nome}
              onChangeText={setNome}
              style={estilos.input}
            />

            <Picker
              selectedValue={frequencia}
              onValueChange={(val) => setFrequencia(val)}
              style={estilos.input}
            >
              <Picker.Item label="Selecione a frequência" value="" />
              <Picker.Item label="Diária" value="diária" />
              <Picker.Item label="Semanal" value="semanal" />
            </Picker>

            <TextInput
              placeholder="Horário do lembrete (opcional)"
              value={lembreteHorario}
              onChangeText={setLembreteHorario}
              style={estilos.input}
            />

            <Text style={{ marginTop: 10, marginBottom: 5 }}>Escolha uma cor:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 15 }}>
              {[
                '#FF6B6B', '#FF8C42', '#FFD93D', '#6BCB77',
                '#4ECDC4', '#36A2EB', '#A29BFE', '#C77DFF',
                '#F67280', '#F8B195', '#55EFC4', '#FAB1A0',
              ].map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setCor(c)}
                  style={{
                    backgroundColor: c,
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    marginRight: 8,
                    marginBottom: 8,
                    borderWidth: cor === c ? 2 : 0,
                    borderColor: 'black',
                  }}
                />
              ))}
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button title="Cancelar" color="gray" onPress={() => setModalVisible(false)} />
              <Button title="Salvar" onPress={handleAdicionarHabito} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}


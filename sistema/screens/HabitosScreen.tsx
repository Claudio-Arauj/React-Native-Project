import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Modal, TextInput, Button
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../styles/globalStyles';

import { getAuth } from 'firebase/auth';
import app from '../firebase-config';

import { MetaHabito } from '../models/habito';
import { adicionarHabito, observarHabitos } from '../services/habitoService';

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

  const calcularDias = (data: Date): string => {
    const hoje = new Date();
    const diff = Math.floor((hoje.getTime() - data.getTime()) / (1000 * 60 * 60 * 24));
    return `${diff} dias atrás`;
  };

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

  const renderItem = ({ item }: { item: MetaHabito }) => (
    <View style={[estilos.card, { borderLeftColor: item.cor || '#ccc', borderLeftWidth: 6 }]}>
      <Text style={estilos.nome}>{item.nome}</Text>
      <Text style={estilos.info}>Frequência: {item.frequencia}</Text>
      <Text style={estilos.info}>Criado há: {calcularDias(item.criadoEm)}</Text>
      {item.lembreteHorario && <Text style={estilos.info}>Lembrete: {item.lembreteHorario}</Text>}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: '#e6e6e6', flex: 1 }]}>
      <Text style={[styles.titulo, { color: '#2b8a3e' }]}>Hábitos</Text>
      <Text style={styles.subtitulo}>Crie e acompanhe seus hábitos saudáveis aqui.</Text>

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

const estilos = StyleSheet.create({
  card: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    color: '#555',
  },
  botao: {
    position: 'absolute',
    bottom: 140,
    right: 20,
    backgroundColor: '#2b8a3e',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 3,
  },
  botaoTexto: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    width: '80%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
    marginBottom: 10,
  },
});

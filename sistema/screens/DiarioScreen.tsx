import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import styles from '../styles/globalStyles';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';

export default function DiarioScreen() {
  const hoje = moment().format('YYYY-MM-DD');
  const [dataSelecionada, setDataSelecionada] = useState(hoje);
  const [nota, setNota] = useState('');
  const [diariosSalvos, setDiariosSalvos] = useState<{ [data: string]: string }>({});

  const salvarNota = () => {
    if (nota.trim() === '') {
      Alert.alert('Campo vazio', 'Escreva algo antes de salvar.');
      return;
    }

    setDiariosSalvos({ ...diariosSalvos, [dataSelecionada]: nota });
    Alert.alert('Salvo!', 'Seu diário foi salvo com sucesso!');
    setNota('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.titulo}>Diário Pessoal</Text>

      <Calendar
        onDayPress={(day) => {
          setDataSelecionada(day.dateString);
          setNota(diariosSalvos[day.dateString] || '');
        }}
        markedDates={{
          [dataSelecionada]: {
            selected: true,
            marked: !!diariosSalvos[dataSelecionada],
            selectedColor: '#4a90e2',
          },
        }}
        theme={{
          todayTextColor: '#4a90e2',
          selectedDayBackgroundColor: '#4a90e2',
          arrowColor: '#4a90e2',
        }}
      />

      <Text style={styles.data}>Data selecionada: {moment(dataSelecionada).format('DD/MM/YYYY')}</Text>

      <TextInput
        style={styles.textarea}
        multiline
        numberOfLines={6}
        placeholder="Escreva aqui sua reflexão do dia..."
        value={nota}
        onChangeText={setNota}
      />

      <Button title="Salvar Nota" onPress={salvarNota} color="#4a90e2" />
    </KeyboardAvoidingView>
  );
}


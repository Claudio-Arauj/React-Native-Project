import React, { useState } from 'react';
import { View, Text, Button, FlatList, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import styles from '../styles/globalStyles';
import { Sono } from '../models/sono';

export default function SonoScreen() {
  // Estado para cálculo de ciclos
  const [horaCalculo, setHoraCalculo] = useState(new Date());
  const [showCalculoPicker, setShowCalculoPicker] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Estado para cadastro de horário de sono
  const [horaSonoCadastro, setHoraSonoCadastro] = useState(new Date());
  const [showCadastroPicker, setShowCadastroPicker] = useState(false);
  const [sonos, setSonos] = useState<Sono[]>([]);

  // Função para calcular ciclos de sono
  const calcularMelhoresHorarios = (startTime: Date) => {
    const ciclos = [1.5, 3, 4.5, 6, 7.5, 9]; // horas
    const resultados = ciclos.map((ciclo) => {
      const acordar = new Date(startTime.getTime() + ciclo * 60 * 60 * 1000);
      const horas = acordar.getHours().toString().padStart(2, '0');
      const minutos = acordar.getMinutes().toString().padStart(2, '0');
      return `${horas}:${minutos}`;
    });
    setSuggestions(resultados);
  };

  // Handler para DatePicker de cálculo
  const handleCalculoPickerChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    if (Platform.OS === 'android') setShowCalculoPicker(false); // Fecha o picker no Android
    if (event.type === 'set' && selectedTime) {
      setHoraCalculo(selectedTime);
      calcularMelhoresHorarios(selectedTime);
    }
  };

  // Handler para DatePicker de cadastro
  const handleCadastroPickerChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    if (Platform.OS === 'android') setShowCadastroPicker(false);
    if (event.type === 'set' && selectedTime) {
      setHoraSonoCadastro(selectedTime);
    }
  };

  // Salvar sono
  const salvarHorarioSono = () => {
    const horarioFormatado = horaSonoCadastro.toTimeString().split(' ')[0]; // "HH:MM:SS"
    const novoSono = new Sono(
      '1',
      'usuarioExemplo', // Trocar pelo ID do usuário real
      horarioFormatado,
      true
    );
    setSonos((prev) => [...prev, novoSono]);
  };

  return (
    <View style={[styles.container, {backgroundColor: '#e6e6e6'}]}>
      {/* Seção: Calcular Ciclos de Sono */}
      <Text style={[styles.titulo, { color: '#2b8a3e' }]}>Calcular Ciclos de Sono</Text>


      {showCalculoPicker && (
        <DateTimePicker
          value={horaCalculo}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleCalculoPickerChange}
        />
      )}

      <Text style={styles.subtitulo}>
        Horário escolhido: {horaCalculo.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>

      {suggestions.length > 0 && (
        <View style={{ marginTop: 10 }}>
          <Text style={styles.subtitulo}>Melhores horários para acordar:</Text>
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text style={{ fontSize: 16, marginVertical: 2 }}>{item}</Text>
            )}
          />
        </View>
      )}

      {/* Seção: Cadastro de Horário de Sono */}
      <View style={{ marginTop: 30 }}>
        <Text style={[styles.titulo, { color: '#2b8a3e' }]}>Cadastrar Horário de Sono</Text>

        {showCadastroPicker && (
          <DateTimePicker
            value={horaSonoCadastro}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={handleCadastroPickerChange}
          />
        )}

        <Text style={styles.subtitulo}>
          Horário selecionado: {horaSonoCadastro.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>


        {sonos.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <Text style={styles.subtitulo}>Horários registrados:</Text>
            {sonos.map((sono) => (
              <Text key={sono.id}>
                {sono.horarioDormir} - Notificações: {sono.notificacoesAtivas ? 'Ativas' : 'Desativadas'}
              </Text>
            ))}
          </View>
        )}
      </View>

      <View style={estilos.botoesRodape}>
        <TouchableOpacity style={estilos.botao} onPress={() => setShowCalculoPicker(true)}>
          <Text style={estilos.botaoTexto}>Escolher horário para cálculo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={estilos.botao} onPress={() => setShowCadastroPicker(true)}>
          <Text style={estilos.botaoTexto}>Escolher horário para cadastro</Text>
        </TouchableOpacity>

        <TouchableOpacity style={estilos.botao} onPress={salvarHorarioSono}>
          <Text style={estilos.botaoTexto}>Salvar horário de sono</Text>
        </TouchableOpacity>
      </View>

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
  botoesRodape: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    flexDirection: 'column', // ou 'row' se quiser lado a lado
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    gap: 10, // se usar RN >= 0.71
  },
  botao: {
    backgroundColor: '#2b8a3e',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 3,
    alignItems: 'center',
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

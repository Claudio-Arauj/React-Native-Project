import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import globalStyles from '../styles/globalStyles';
import styles from '../styles/diarioStyles'
import { Diario } from '../models/diario';
import { salvarDiario, buscarDiarios, buscarDiarioPorData } from '../services/diarioService';

export default function DiarioScreen() {
  const hoje = moment().format('YYYY-MM-DD');
  const [dataSelecionada, setDataSelecionada] = useState<string>(hoje);
  const [nota, setNota] = useState<string>('');
  const [emocao, setEmocao] = useState<string>('');
  const [diariosSalvos, setDiariosSalvos] = useState<Record<string, Diario>>({});
  const [mostrarMenuFlutuante, setMostrarMenuFlutuante] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [emojiModalVisivel, setEmojiModalVisivel] = useState(false);

  const animMenu = useRef(new Animated.Value(0)).current;

  // Atualiza animação do menu flutuante
  useEffect(() => {
    Animated.timing(animMenu, {
      toValue: mostrarMenuFlutuante ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [mostrarMenuFlutuante]);

  // Busca todos os diários salvos ao montar
  useEffect(() => {
    (async () => {
      try {
        const diarios = await buscarDiarios();
        setDiariosSalvos(diarios);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os diários');
      }
    })();
  }, []);

  // Atualiza nota e emoção ao mudar a data selecionada
  useEffect(() => {
    (async () => {
      try {
        const diario = await buscarDiarioPorData(dataSelecionada);
        setNota(diario?.nota || '');
        setEmocao(diario?.emocao || '');
      } catch {
        setNota('');
        setEmocao('');
      }
    })();
  }, [dataSelecionada]);

  const salvarNota = async () => {
    if (nota.trim() === '') {
      Alert.alert('Campo vazio', 'Escreva algo antes de salvar.');
      return;
    }
    try {
      const novoDiario: Diario = { data: dataSelecionada, nota, emocao };
      await salvarDiario(novoDiario);

      setDiariosSalvos((prev) => ({ ...prev, [dataSelecionada]: novoDiario }));
      Alert.alert('Salvo!', 'Seu diário foi salvo com sucesso!');
      setModalVisivel(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o diário.');
    }
  };

  const selecionarEmoji = (emoji: string) => {
    setEmocao(emoji);
    setEmojiModalVisivel(false);
    setMostrarMenuFlutuante(false);
    Alert.alert('Salvo!', `Você escolheu ${emoji} como humor do dia.`);
  };

  const fecharMenus = () => {
    if (mostrarMenuFlutuante) setMostrarMenuFlutuante(false);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableWithoutFeedback onPress={fecharMenus}>
        <View style={{ flex: 1, backgroundColor: '#e6e6e6' }}>
          <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
            <View style={{ alignItems: 'center', marginBottom: 10 }}>
              <FontAwesome5 name="calendar-alt" size={28} color="#3a3a3a" />
              <Text style={styles.title}>Calendário</Text>
            </View>

            <Calendar
              onDayPress={(day) => {
                setDataSelecionada(day.dateString);
              }}
              markedDates={{
                ...Object.fromEntries(
                  Object.entries(diariosSalvos).map(([data]) => [
                    data,
                    { marked: true, dotColor: '#2b8a3e' },
                  ])
                ),
                [dataSelecionada]: {
                  ...(diariosSalvos[dataSelecionada] ? { marked: true, dotColor: '#2b8a3e' } : {}),
                  selected: true,
                  selectedColor: '#2b8a3e',
                },
              }}
              style={styles.calendar}
              theme={{
                calendarBackground: '#f0f0f0',
                textDayFontFamily: 'monospace',
                textMonthFontFamily: 'monospace',
                textDayHeaderFontFamily: 'monospace',
                todayTextColor: '#2b8a3e',
                selectedDayBackgroundColor: '#2b8a3e',
                selectedDayTextColor: '#fff',
                arrowColor: '#2b8a3e',
                monthTextColor: '#2b8a3e',
              }}
            />

            <Text style={styles.selectedDate}>
              Dia selecionado: <Text style={{ fontWeight: 'bold' }}>{moment(dataSelecionada).format('DD/MM/YYYY')}</Text>
            </Text>

            {emocao && (
              <View>
                <Text style={{ fontSize: 18, fontFamily: 'monospace', marginBottom: 10 }}>
                  Emoção do dia: {emocao}
                </Text>
              </View>
            )}

            {nota && (
              <View>
                <Text style={{ fontSize: 18, fontFamily: 'monospace', marginBottom: 10 }}>Diário do Dia:</Text>
                <View style={styles.box}>
                  <ScrollView>
                    <Text style={{ fontSize: 16, fontFamily: 'monospace', marginBottom: 10 }}>{nota}</Text>
                  </ScrollView>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Menu flutuante com animação */}
          <View style={styles.fabContainer}>
            <Animated.View
              style={[styles.fabMenu, { opacity: animMenu, transform: [{ scale: animMenu }] }]}
            >
              <TouchableOpacity style={styles.bubble} onPress={() => setModalVisivel(true)}>
                <MaterialCommunityIcons name="book-open-variant" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.bubble} onPress={() => setEmojiModalVisivel(true)}>
                <Text style={{ fontSize: 20 }}>😊</Text>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
              style={styles.fab}
              onPress={() => setMostrarMenuFlutuante((prev) => !prev)}
            >
              <MaterialCommunityIcons name="plus" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Modal do Diário */}
          <Modal visible={modalVisivel} animationType="fade" transparent>
            <BlurView intensity={90} tint="light" style={StyleSheet.absoluteFill}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Escreva no Diário</Text>
                <TextInput
                  style={styles.modalInput}
                  multiline
                  placeholder="Conte como foi seu dia..."
                  value={nota}
                  onChangeText={setNota}
                />
                <TouchableOpacity style={styles.modalButton} onPress={salvarNota}>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisivel(false)} style={{ marginTop: 10 }}>
                  <Text style={{ color: '#2b8a3e', textAlign: 'center' }}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </Modal>

          {/* Modal de Emojis */}
          <Modal visible={emojiModalVisivel} transparent animationType="fade">
            <BlurView intensity={70} tint="light" style={StyleSheet.absoluteFill}>
              <View style={styles.emojiPicker}>
                <Text style={styles.modalTitle}>Como você se sente hoje?</Text>
                <View
                  style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}
                >
                  {['😄', '😐', '😢', '😠', '😴'].map((emoji) => (
                    <TouchableOpacity key={emoji} onPress={() => selecionarEmoji(emoji)}>
                      <Text style={{ fontSize: 30 }}>{emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity onPress={() => setEmojiModalVisivel(false)} style={{ marginTop: 20 }}>
                  <Text style={{ color: '#2b8a3e', textAlign: 'center' }}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}



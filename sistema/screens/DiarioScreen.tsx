import React, { useState, useRef, useEffect } from 'react';
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
import globalStyles from '../styles/globalStyles'; // ou o caminho correspondente


export default function DiarioScreen() {
  const hoje = moment().format('YYYY-MM-DD');
  const [dataSelecionada, setDataSelecionada] = useState(hoje);
  const [nota, setNota] = useState('');
  const [diariosSalvos, setDiariosSalvos] = useState<{ [data: string]: string }>({});
  const [mostrarMenuFlutuante, setMostrarMenuFlutuante] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [emojiModalVisivel, setEmojiModalVisivel] = useState(false);
  const [emocoesSalvas, setEmocoesSalvas] = useState<{ [data: string]: string }>({});

  const animMenu = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animMenu, {
      toValue: mostrarMenuFlutuante ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [mostrarMenuFlutuante]);

  const salvarNota = () => {
    if (nota.trim() === '') {
      Alert.alert('Campo vazio', 'Escreva algo antes de salvar.');
      return;
    }

    setDiariosSalvos({ ...diariosSalvos, [dataSelecionada]: nota });
    Alert.alert('Salvo!', 'Seu diário foi salvo com sucesso!');
    setNota('');
    setModalVisivel(false);
  };

  const selecionarEmoji = (emoji: string) => {
    setEmocoesSalvas({ ...emocoesSalvas, [dataSelecionada]: emoji });
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
                setNota(diariosSalvos[day.dateString] || '');
              }}
              markedDates={{
                [dataSelecionada]: {
                  selected: true,
                  marked: !!diariosSalvos[dataSelecionada],
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

            {emocoesSalvas[dataSelecionada] && (
              <View>
                <Text style={{ fontSize: 18, fontFamily: 'monospace', marginBottom: 10 }}>
                  Emoção do dia: {emocoesSalvas[dataSelecionada]}
                </Text>
              </View>
            )}

            {diariosSalvos[dataSelecionada] && (
              <View>
                <Text style={{ fontSize: 18, fontFamily: 'monospace', marginBottom: 10 }}>
                  Diário do Dia:
                </Text>
                <View style={styles.box}>
                  <ScrollView>
                    <Text style={{ fontSize: 16, fontFamily: 'monospace', marginBottom: 10 }}>
                      {diariosSalvos[dataSelecionada]}
                    </Text> 
                  </ScrollView>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Menu flutuante com animação */}
          <View style={styles.fabContainer}>
            <Animated.View style={[styles.fabMenu, { opacity: animMenu, transform: [{ scale: animMenu }] }]}>
              <TouchableOpacity style={styles.bubble} onPress={() => setModalVisivel(true)}>
                <MaterialCommunityIcons name="book-open-variant" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.bubble} onPress={() => setEmojiModalVisivel(true)}>
                <Text style={{ fontSize: 20 }}>😊</Text>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity style={styles.fab} onPress={() => setMostrarMenuFlutuante((prev) => !prev)}>
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
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
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

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3a3a3a',
    fontFamily: 'monospace',
    marginTop: 4,
  },
  calendar: {
    borderRadius: 8,
    padding: 5,
    backgroundColor: '#f0f0f0',
  },
  selectedDate: {
    marginVertical: 8,
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#333',
  },
  fabContainer: {
    flex: 1,
    position: 'absolute',
    right: 20,
    bottom: 30,
    alignItems: 'flex-end',
    paddingBottom: 90,
  },
  fab: {
    backgroundColor: '#2b8a3e',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabMenu: {
    marginBottom: 10,
  },
  bubble: {
    backgroundColor: '#2b8a3e',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalContent: {
    margin: 32,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalInput: {
    height: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    fontFamily: 'monospace',
  },
  modalButton: {
    backgroundColor: '#2b8a3e',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  emojiPicker: {
    backgroundColor: 'white',
    margin: 32,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: 310,                        
    maxHeight: 210,  
    backgroundColor: 'white', 
    borderRadius: 20,          
    padding: 20,             
    shadowColor: '#000',     
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25,     
    shadowRadius: 3.5,       
    elevation: 5,   
    overflow: 'hidden',    
    flex: 1,     
  },
});

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import styles from '../styles/globalStyles';
import viciosDisponiveis from '../data/vicios';
import VicioCard from '../components/VicioCard';

interface VicioSelecionado {
  id: string;
  nome: string;
  icon: any;
  cor: string;
  dataInicio: Date;
}

export default function HomeScreen() {
  const [viciosSelecionados, setViciosSelecionados] = useState<VicioSelecionado[]>([]);
  const [modalVisivel, setModalVisivel] = useState(false);

  const viciosRestantes = viciosDisponiveis.filter(
    v => !viciosSelecionados.find(sel => sel.id === v.id)
  );

  const adicionarVicio = (id: string) => {
    const vicioBase = viciosDisponiveis.find(v => v.id === id);
    if (!vicioBase) return;

    const novoVicio: VicioSelecionado = {
      ...vicioBase,
      dataInicio: new Date(),
    };

    setViciosSelecionados([...viciosSelecionados, novoVicio]);
    setModalVisivel(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Seus Vícios Monitorados</Text>

      {viciosSelecionados.length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Text style={styles.subtitulo}>Você ainda não está monitorando nenhum vício.</Text>
          <TouchableOpacity
            style={localStyles.botaoAdicionar}
            onPress={() => setModalVisivel(true)}
          >
            <Text style={localStyles.textoBotao}>Adicionar Vício</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView>
            {viciosSelecionados.map(vicio => (
              <VicioCard key={vicio.id} vicio={vicio} />
            ))}
          </ScrollView>

          <TouchableOpacity
            style={[localStyles.botaoAdicionar, { marginTop: 20 }]}
            onPress={() => setModalVisivel(true)}
          >
            <Text style={localStyles.textoBotao}>Adicionar Novo Vício</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Modal para selecionar novos vícios */}
      <Modal visible={modalVisivel} animationType="slide">
        <View style={styles.container}>
          <Text style={styles.titulo}>Escolha um Vício</Text>
          <ScrollView>
            {viciosRestantes.map(vicio => (
              <TouchableOpacity
                key={vicio.id}
                onPress={() => adicionarVicio(vicio.id)}
              >
                <VicioCard vicio={vicio} mostrarTempo={false} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={[localStyles.botaoAdicionar, { backgroundColor: '#ccc' }]}
            onPress={() => setModalVisivel(false)}
          >
            <Text style={{ color: '#333' }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const localStyles = StyleSheet.create({
  botaoAdicionar: {
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 20,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

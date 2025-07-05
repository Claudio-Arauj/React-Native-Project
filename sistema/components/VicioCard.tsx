import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import styles from '../styles/viciosStyles';

interface Props {
  vicio: {
    id: string;
    nome: string;
    icon: any;
    cor: string;
    dataInicio?: Date;
  };
  mostrarTempo?: boolean;
}

const formatarDuracao = (inicio: Date): string => {
  const agora = new Date();
  const diff = agora.getTime() - inicio.getTime();

  const segundosTotais = Math.floor(diff / 1000);
  const minutosTotais = Math.floor(segundosTotais / 60);
  const horasTotais = Math.floor(minutosTotais / 60);
  const dias = Math.floor(horasTotais / 24);

  const horas = horasTotais % 24;
  const minutos = minutosTotais % 60;
  const segundos = segundosTotais % 60;

  let partes = [];

  if (dias > 0) partes.push(`${dias}d`);
  if (horasTotais > 0) partes.push(`${horas}h`);
  if (minutosTotais > 0) partes.push(`${minutos}min`);
  partes.push(`${segundos}s`);

  return partes.join(' ');
};

export default function VicioCard({ vicio, mostrarTempo = true }: Props) {
  const [tempo, setTempo] = useState(
    vicio.dataInicio ? formatarDuracao(vicio.dataInicio) : ''
  );

  useEffect(() => {
    if (!mostrarTempo || !vicio.dataInicio) return;

    const intervalo = setInterval(() => {
      setTempo(formatarDuracao(vicio.dataInicio!));
    }, 1000);

    return () => clearInterval(intervalo);
  }, [vicio.dataInicio, mostrarTempo]);

  return (
    <View style={[styles.card, { borderLeftColor: vicio.cor }]}>
      <View style={styles.iconeContainer}>
        <FontAwesome5 name={vicio.icon} size={20} color={vicio.cor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.nome}>{vicio.nome}</Text>
        {mostrarTempo && tempo && (
          <Text style={styles.tempo}>{tempo} sem consumir</Text>
        )}
      </View>
    </View>
  );
}

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  avatarContainer: {
  height: 200,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 16,
  borderRadius: 20,
  overflow: 'hidden',
  marginHorizontal: 16,
  marginTop: 16,
  marginBottom: 16,
  backgroundColor: '#fff', // fallback se imagem falhar
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 5,
},
overlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.4)', // escurece a imagem
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 10,
},

logo: {
  width: 80,
  height: 80,
  marginBottom: 8,
},

emailContainer: {
  flexDirection: 'row',
  alignItems: 'center',
},

email: {
  fontSize: 16,
  color: '#fff',
  fontWeight: 'bold',
},
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#2b8a3e',
  },
  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2b8a3e',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2b8a3e',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    color: '#444',
    fontSize: 14,
  },
  value: {
    fontWeight: '600',
    color: '#000',
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  habitText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#2b2b2b',
  },
  




caixaMensagem: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#f3e8ff', // lilás clarinho
  padding: 12,
  marginHorizontal: 20,
  marginBottom: 16,
  borderRadius: 16,
  shadowColor: '#6a0dad',
  shadowOpacity: 0.15,
  shadowOffset: { width: 0, height: 3 },
  shadowRadius: 6,
  elevation: 4,
},

mensagemTexto: {
  flex: 1,
  fontSize: 16,
  fontStyle: 'italic',
  color: '#6a0dad',
  fontWeight: '600',
},

});
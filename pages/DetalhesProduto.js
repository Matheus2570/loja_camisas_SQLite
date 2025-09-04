// --------------------------------------------------
// Exibe os detalhes de um produto selecionado
// Inclui botões para editar e remover
// --------------------------------------------------

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
// Importa componentes do React Native:
// - View: container para organizar elementos
// - Text: exibe textos
// - Image: exibe imagens
// - StyleSheet: cria estilos
// - TouchableOpacity: botão clicável
// - Alert: exibe mensagens de alerta

import { deleteProduto } from '../App'; 
// Importa função para deletar produtos do banco

// ------------------ COMPONENTE ------------------
export default function DetalhesProduto({ route, navigation }) {
  // Componente recebe:
  // - route: contém parâmetros passados na navegação (produto selecionado)
  // - navigation: permite navegar entre telas

  const produto = route.params.produto; 
  // Produto selecionado passado como parâmetro

  // ------------------ FUNÇÃO PARA DELETAR ------------------
  const handleDelete = () => {
    Alert.alert(
      'Confirmação',
      `Deseja realmente deletar a camiseta "${produto.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            await deleteProduto(produto.id); 
            // Deleta o produto pelo id
            navigation.goBack(); 
            // Volta para a tela anterior após deletar
          },
        },
      ]
    );
  };

  // ------------------ FUNÇÃO PARA EDITAR ------------------
  const handleEdit = () => {
    navigation.navigate('InserirProduto', { produto }); 
    // Navega para tela InserirProduto enviando o produto como parâmetro
    // Assim a tela será carregada em modo edição
  };

  // ------------------ RETORNO DO COMPONENTE ------------------
  return (
    <View style={styles.container}>
      <Image source={{ uri: produto.imagem }} style={styles.image} />
      {/* Exibe a imagem do produto */}

      <Text style={styles.name}>{produto.nome}</Text>
      {/* Exibe o nome do produto */}

      <Text style={styles.text}>Cores: {produto.cores}</Text>
      <Text style={styles.text}>Tamanhos: {produto.tamanhos}</Text>
      <Text style={styles.text}>Descrição: {produto.descricao}</Text>
      {/* Exibe cores, tamanhos e descrição */}

      {/* ------------------ BOTÕES EDITAR E REMOVER ------------------ */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={handleEdit}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}>
          <Text style={styles.buttonText}>Remover</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ------------------ ESTILOS ------------------
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    alignItems: 'center' 
    // Container centraliza os elementos
  },
  image: { 
    width: 250, 
    height: 250, 
    borderRadius: 8, 
    marginBottom: 20 
    // Estilo da imagem do produto
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#d63384', // Cor rosa/vinho para destaque do nome
  },
  text: { 
    fontSize: 16, 
    marginBottom: 5, 
    textAlign: 'center' 
    // Texto centralizado para detalhes
  },
  buttonRow: {
    flexDirection: 'row', 
    // Organiza botões em linha
    justifyContent: 'space-between', 
    width: '100%',
    marginTop: 30,
  },
  button: {
    flex: 1, 
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5, 
    // Margem entre os botões
  },
  editButton: { backgroundColor: '#0d6efd' }, // Azul para editar
  deleteButton: { backgroundColor: '#dc3545' }, // Vermelho para remover
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

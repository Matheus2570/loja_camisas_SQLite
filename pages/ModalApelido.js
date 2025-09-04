// ------------------ IMPORTS ------------------
import React, { useState } from 'react'; 
// Importa React e o hook useState para gerenciar estados internos do componente

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  StyleSheet,
} from 'react-native';
// Importa componentes básicos do React Native:
// - View: container de elementos
// - Text: para exibir texto
// - TextInput: campo de input
// - TouchableOpacity: botão que reage ao toque
// - Modal: janela modal sobreposta
// - Alert: exibir alertas nativos
// - StyleSheet: criar estilos para os componentes

import AsyncStorage from '@react-native-async-storage/async-storage'; 
// Biblioteca para armazenar dados localmente (como o apelido do usuário)

// ------------------ COMPONENTE ------------------
export default function ModalApelido({ visible, onClose }) {
  // Componente recebe duas props:
  // - visible: booleano que define se o modal está visível
  // - onClose: função que será chamada quando o modal fechar e retornar o apelido

  const [nome, setNome] = useState(''); 
  // Estado para armazenar o nome digitado

  const [senha, setSenha] = useState(''); 
  // Estado para armazenar a senha digitada

  const [apelido, setApelido] = useState(''); 
  // Estado para armazenar o apelido digitado

  // ------------------ FUNÇÃO DE CONFIRMAÇÃO ------------------
  const handleConfirm = async () => {
    // Valida os campos: nome precisa ser "aluno", senha "123" e apelido não pode ser vazio
    if (nome !== 'Aluno' || senha !== '123' || apelido.trim() === '') {
      Alert.alert('Erro', 'Preencha corretamente todos os campos.');
      // Mostra alerta caso algum campo esteja incorreto
      return; // Sai da função se não estiver correto
    }

    // Salva o apelido no AsyncStorage (armazenamento local)
    await AsyncStorage.setItem('apelido', apelido);

    // Chama a função passada por props, enviando o apelido
    onClose(apelido);

    // Limpa os campos após salvar
    setNome('');
    setSenha('');
    setApelido('');
  };

  // ------------------ RETORNO DO COMPONENTE ------------------
  return (
    <Modal visible={visible} transparent animationType="slide">
      {/* Modal transparente com animação de slide */}
      <View style={styles.modal}>
        {/* Container centralizado */}
        <Text style={styles.title}>Bem-vindo!</Text>
        {/* Título do modal */}

        <TextInput
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
        />
        {/* Input para nome, atualiza o estado 'nome' ao digitar */}

        <TextInput
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          style={styles.input}
        />
        {/* Input para senha, texto oculto (secureTextEntry) */}

        <TextInput
          placeholder="Apelido"
          value={apelido}
          onChangeText={setApelido}
          style={styles.input}
        />
        {/* Input para apelido */}

        <TouchableOpacity style={styles.button} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>
        {/* Botão que chama handleConfirm ao ser pressionado */}
      </View>
    </Modal>
  );
}

// ------------------ ESTILOS ------------------
const styles = StyleSheet.create({
  modal: {
    flex: 1, // Ocupa toda a tela
    justifyContent: 'center', // Centraliza verticalmente
    alignItems: 'center', // Centraliza horizontalmente
    backgroundColor: 'white', // Fundo branco
    padding: 20, // Espaçamento interno
  },
  title: { 
    fontSize: 24, // Tamanho da fonte
    fontWeight: 'bold', // Negrito
    marginBottom: 20 // Espaço abaixo do título
  },
  input: {
    width: '100%', // Ocupa toda a largura do container
    height: 50, // Altura do campo
    borderColor: '#0d6efd', // Cor da borda
    borderWidth: 1, // Espessura da borda
    borderRadius: 8, // Bordas arredondadas
    marginBottom: 15, // Espaço abaixo de cada input
    paddingHorizontal: 15, // Espaço interno horizontal
  },
  button: {
    width: '100%', // Ocupa toda a largura
    height: 50, // Altura do botão
    backgroundColor: '#0d6efd', // Cor de fundo
    justifyContent: 'center', // Centraliza conteúdo verticalmente
    alignItems: 'center', // Centraliza conteúdo horizontalmente
    borderRadius: 8, // Bordas arredondadas
  },
  buttonText: { 
    color: '#fff', // Cor do texto
    fontSize: 18, // Tamanho da fonte
    fontWeight: 'bold' // Negrito
  },
});

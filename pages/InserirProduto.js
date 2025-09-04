// --------------------------------------------------
// Tela para inserir novos produtos ou editar existentes
// --------------------------------------------------

import React, { useState, useEffect } from 'react'; 
// Importa React e hooks:
// - useState: para gerenciar estados dos campos do formulário
// - useEffect: para executar ações ao iniciar o componente

import { View, TextInput, Button, StyleSheet, Alert } from 'react-native'; 
// Importa componentes do React Native:
// - View: container principal
// - TextInput: campos de input
// - Button: botão de ação
// - StyleSheet: estilos
// - Alert: exibe alertas nativos

import { insertProduto, updateProduto } from '../App'; 
// Importa funções de CRUD do App.js para inserir ou atualizar produtos

// ------------------ COMPONENTE ------------------
export default function InserirProduto({ route, navigation }) {
  // Componente recebe:
  // - route: contém os parâmetros passados na navegação (ex: produto para editar)
  // - navigation: permite navegar entre telas

  const produtoParaEditar = route.params?.produto; 
  // Se veio um produto nos parâmetros, significa que é uma edição

  // ------------------ ESTADOS ------------------
  const [id, setId] = useState(null); 
  // Id do produto (nulo se for novo)

  const [nome, setNome] = useState(''); 
  // Nome do produto

  const [imagem, setImagem] = useState(''); 
  // URL da imagem do produto

  const [cores, setCores] = useState(''); 
  // Cores do produto, separadas por vírgula

  const [tamanhos, setTamanhos] = useState(''); 
  // Tamanhos disponíveis (P,M,G,GG)

  const [descricao, setDescricao] = useState(''); 
  // Descrição do produto

  // ------------------ useEffect para edição ------------------
  useEffect(() => {
    if (produtoParaEditar) {
      // Se for edição, preenche os campos com os valores existentes
      setId(produtoParaEditar.id);
      setNome(produtoParaEditar.nome);
      setImagem(produtoParaEditar.imagem);
      setCores(produtoParaEditar.cores);
      setTamanhos(produtoParaEditar.tamanhos);
      setDescricao(produtoParaEditar.descricao);
    }
  }, []); 
  // Executa apenas na montagem do componente

  // ------------------ FUNÇÃO SALVAR ------------------
  async function salvar() {
    if (!nome) {
      Alert.alert('Erro', 'Informe o nome da camiseta');
      // Validação: o nome é obrigatório
      return;
    }

    const produto = { id, nome, imagem, cores, tamanhos, descricao }; 
    // Cria objeto com dados do produto

    if (id) {
      // Se tiver id, atualiza o produto existente
      await updateProduto(produto);
      Alert.alert('Sucesso', 'Camiseta atualizada!');
    } else {
      // Se não tiver id, insere novo produto
      await insertProduto(produto);
      Alert.alert('Sucesso', 'Camiseta inserida!');
    }

    navigation.goBack(); 
    // Volta para a tela anterior após salvar
  }

  // ------------------ RETORNO DO COMPONENTE ------------------
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nome"
        style={styles.input}
        value={nome}
        onChangeText={setNome} 
        // Atualiza estado nome ao digitar
      />
      <TextInput
        placeholder="URL da Imagem"
        style={styles.input}
        value={imagem}
        onChangeText={setImagem} 
        // Atualiza estado imagem
      />
      <TextInput
        placeholder="Cores (separadas por vírgula)"
        style={styles.input}
        value={cores}
        onChangeText={setCores} 
        // Atualiza estado cores
      />
      <TextInput
        placeholder="Tamanhos (P,M,G,GG)"
        style={styles.input}
        value={tamanhos}
        onChangeText={setTamanhos} 
        // Atualiza estado tamanhos
      />
      <TextInput
        placeholder="Descrição"
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao} 
        multiline 
        // Permite múltiplas linhas para descrição
      />
      <Button
        title="Salvar"
        onPress={salvar} 
        color={id ? '#0d6efd' : '#198754'} 
        // Azul se for edição, verde se for novo produto
      />
    </View>
  );
}

// ------------------ ESTILOS ------------------
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 }, 
  // Container ocupa toda a tela e tem padding interno

  input: {
    borderWidth: 1, // Borda visível
    borderColor: '#ccc', // Cor da borda
    padding: 10, // Espaço interno
    marginBottom: 10, // Espaço entre inputs
    borderRadius: 8, // Bordas arredondadas
  },
});

// --------------------------------------------------
// Busca produtos pelo nome
// --------------------------------------------------

import React, { useState } from "react"; 
// Importa React e o hook useState para gerenciar estados

import { View, TextInput, Button, FlatList, Text, StyleSheet } from "react-native"; 
// Importa componentes do React Native:
// - View: container principal
// - TextInput: campo para digitar o nome da camiseta
// - Button: botão de ação para buscar
// - FlatList: lista eficiente para exibir resultados
// - Text: exibe os nomes dos produtos
// - StyleSheet: criar estilos

import { getProdutos } from "../App"; 
// Importa a função que busca produtos no banco SQLite

// ------------------ COMPONENTE ------------------
export default function BuscarNome({ navigation }) {
  // Componente recebe navigation para navegar entre telas

  const [nome, setNome] = useState(""); 
  // Estado para armazenar o nome digitado no input

  const [resultado, setResultado] = useState([]); 
  // Estado para armazenar os resultados da busca

  // ------------------ FUNÇÃO BUSCAR ------------------
  async function buscar() {
    // Monta a query SQL usando LIKE para buscar parcialmente pelo nome
    const dados = await getProdutos(
      `SELECT * FROM camisetas WHERE nome LIKE '%${nome}%'`
    );
    setResultado(dados); 
    // Atualiza o estado com os resultados encontrados
  }

  // ------------------ RETORNO DO COMPONENTE ------------------
  return (
    <View style={styles.container}>
      {/* Input para digitar o nome da camiseta */}
      <TextInput
        placeholder="Digite o nome da camiseta"
        style={styles.input}
        value={nome}
        onChangeText={setNome} 
        // Atualiza o estado nome a cada digitação
      />
      
      {/* Botão para disparar a busca */}
      <Button
        title="Buscar"
        onPress={buscar}
        color="#0d6efd" 
        // Azul para o botão
      />

      {/* Lista de resultados */}
      <FlatList
        data={resultado} 
        // Dados da busca
        keyExtractor={(item) => item.id.toString()} 
        // Chave única para cada item
        renderItem={({ item }) => (
          <Text
            style={styles.item}
            onPress={() => navigation.navigate("DetalhesProduto", { produto: item })}
            // Ao clicar no item, navega para tela de detalhes passando o produto
          >
            {item.nome} 
            {/* Exibe o nome do produto */}
          </Text>
        )}
      />
    </View>
  );
}

// ------------------ ESTILOS ------------------
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20 
    // Container ocupa toda a tela com padding interno
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#ccc", 
    padding: 10, 
    marginBottom: 10, 
    borderRadius: 8 
    // Estilo do input com borda arredondada e espaçamento
  },
  item: { 
    padding: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: "#ddd", 
    fontSize: 16 
    // Estilo de cada item da lista com linha separadora
  },
});

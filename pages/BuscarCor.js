// --------------------------------------------------
// Busca produtos pela cor
// --------------------------------------------------

import React, { useState } from "react"; 
// Importa React e o hook useState para gerenciar estados

import { View, TextInput, Button, FlatList, Text, StyleSheet } from "react-native"; 
// Importa componentes do React Native:
// - View: container principal
// - TextInput: campo para digitar a cor
// - Button: botão de ação para buscar
// - FlatList: lista eficiente para exibir resultados
// - Text: exibe nomes e cores dos produtos
// - StyleSheet: cria estilos

import { getProdutos } from "../App"; 
// Importa função que busca produtos no banco SQLite

// ------------------ COMPONENTE ------------------
export default function BuscarCor({ navigation }) {
  // Componente recebe navigation para navegar entre telas

  const [cor, setCor] = useState(""); 
  // Estado para armazenar a cor digitada no input

  const [resultado, setResultado] = useState([]); 
  // Estado para armazenar os resultados da busca

  // ------------------ FUNÇÃO BUSCAR ------------------
  async function buscar() {
    // Monta a query SQL usando LIKE para buscar parcialmente pela cor
    const dados = await getProdutos(
      `SELECT * FROM camisetas WHERE cores LIKE '%${cor}%'`
    );
    setResultado(dados); 
    // Atualiza o estado com os resultados encontrados
  }

  // ------------------ RETORNO DO COMPONENTE ------------------
  return (
    <View style={styles.container}>
      {/* Input para digitar a cor */}
      <TextInput
        placeholder="Digite a cor"
        style={styles.input}
        value={cor}
        onChangeText={setCor} 
        // Atualiza o estado cor a cada digitação
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
            {item.nome} ({item.cores}) 
            {/* Exibe nome e cores do produto */}
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

// ------------------ IMPORTS ------------------
import React from 'react'; 
// Importa React

import { View, Text, TouchableOpacity, StyleSheet, Image

 } from 'react-native'; 
// Importa componentes do React Native:
// - View: container para organizar os elementos
// - Text: para exibir textos
// - TouchableOpacity: botão que reage ao toque
// - StyleSheet: para criar estilos

// ------------------ COMPONENTE ------------------
export default function Home({ navigation, apelido, abrirModal }) {
  // Componente recebe três props:
  // - navigation: permite navegar entre telas
  // - apelido: nome do usuário para exibir saudação
  // - abrirModal: função para abrir novamente o modal de apelido

  return (
    <View style={styles.container}>
      {/* Container principal com estilos */}

      <Text style={styles.greeting}>Olá, {apelido}!</Text>
      {/* Saudação personalizada usando o apelido do usuário */}
      <View style={{ alignItems: "center", marginTop: 32 }}>
<Image
source={{ uri: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRmbG2bIPLY_9lWe83brww7mmc0JN6-wkkt3rkW2_t2tXh-h8kj7m0EPEb-dPj_iJpZQW8xsdjfzGchTNzAqCgasf5bIJiljsto_NVDQHn-ng" }}
style={{ width: 150, height: 150, borderRadius: 75, marginBottom: 12 }}
/>
</View>

      <Text style={styles.title}>Menu Principal</Text>
      {/* Título da tela */}

      {/* ------------------ BOTÕES DE NAVEGAÇÃO ------------------ */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ListaProdutos')}>
        <Text style={styles.buttonText}>Ver Todas as Camisetas</Text>
      </TouchableOpacity>
      {/* Botão que navega para a tela ListaProdutos */}

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('InserirProduto')}>
        <Text style={styles.buttonText}>Inserir Camiseta</Text>
      </TouchableOpacity>
      {/* Botão que navega para a tela InserirProduto */}

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BuscarNome')}>
        <Text style={styles.buttonText}>Buscar por Nome</Text>
      </TouchableOpacity>
      {/* Botão que navega para a tela BuscarNome */}

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BuscarCor')}>
        <Text style={styles.buttonText}>Buscar por Cor</Text>
      </TouchableOpacity>
      {/* Botão que navega para a tela BuscarCor */}

      <TouchableOpacity style={styles.modalButton} onPress={abrirModal}>
        <Text style={styles.buttonText}>Voltar ao Modal</Text>
      </TouchableOpacity>
      {/* Botão que chama a função abrirModal para exibir o modal novamente */}
    </View>
  );
}

// ------------------ ESTILOS ------------------
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#f0f8ff', // Fundo azul clarinho
    alignItems: 'center' // Centraliza horizontalmente os elementos
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginVertical: 15 // Espaço acima e abaixo do título
  },
  greeting: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#0d6efd', // Cor azul para destaque
    marginBottom: 20 // Espaço abaixo da saudação
  },
  button: { 
    width: '100%', 
    height: 50, 
    backgroundColor: '#198754', // Cor verde
    justifyContent: 'center', // Centraliza verticalmente o texto
    alignItems: 'center', // Centraliza horizontalmente o texto
    borderRadius: 8, // Bordas arredondadas
    marginBottom: 10 // Espaço entre os botões
  },
  modalButton: { 
    width: '100%', 
    height: 50, 
    backgroundColor: '#0d6efd', // Cor azul (diferente do botão padrão)
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 8, 
    marginTop: 20 // Espaço acima do botão
  },
  buttonText: { 
    color: '#fff', // Texto branco
    fontSize: 18, 
    fontWeight: 'bold' // Negrito
  },
});

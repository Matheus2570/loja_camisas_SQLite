// ------------------ IMPORTS ------------------
import React from 'react'; 
// Importa a biblioteca principal do React

import { 
  View,            // Container para agrupar elementos
  Text,            // Exibição de textos
  TouchableOpacity,// Botão que responde ao toque
  StyleSheet,      // Criação de estilos
  Image,           // Exibição de imagens
  ScrollView       // Permite rolagem vertical na tela
} from 'react-native'; 

// ------------------ COMPONENTE ------------------
export default function Home({ navigation, apelido, abrirModal }) {
  // O componente Home recebe três props:
  // - navigation: permite trocar de tela
  // - apelido: string com nome/apelido do usuário
  // - abrirModal: função para reabrir o modal inicial

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer} 
      // Aplica estilos no conteúdo do ScrollView
      showsVerticalScrollIndicator={false}
      // Oculta a barrinha lateral de rolagem
    >
      <View style={styles.container}>
        {/* Container principal para organizar os elementos */} 

        <Text style={styles.greeting}>Olá, {apelido}!</Text>
        {/* Saudação personalizada com o apelido do usuário */}

        {/* Avatar centralizado */}
        <View style={{ alignItems: "center", marginTop: 32 }}>
          <Image
            source={{ uri: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRmbG2bIPLY_9lWe83brww7mmc0JN6-wkkt3rkW2_t2tXh-h8kj7m0EPEb-dPj_iJpZQW8xsdjfzGchTNzAqCgasf5bIJiljsto_NVDQHn-ng" }}
            style={{ 
              width: 150, 
              height: 150, 
              borderRadius: 75, // deixa a imagem redonda
              marginBottom: 12  // espaço abaixo da imagem
            }}
          />
        </View>

        <Text style={styles.title}>Menu Principal</Text>
        {/* Título da seção de botões */}

        {/* ------------------ BOTÕES DE NAVEGAÇÃO ------------------ */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('ListaProdutos')}
        >
          <Text style={styles.buttonText}>Ver Todas as Camisetas</Text>
        </TouchableOpacity>
        {/* Vai para a tela ListaProdutos */}

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('InserirProduto')}
        >
          <Text style={styles.buttonText}>Inserir Camiseta</Text>
        </TouchableOpacity>
        {/* Vai para a tela InserirProduto */}

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('BuscarNome')}
        >
          <Text style={styles.buttonText}>Buscar por Nome</Text>
        </TouchableOpacity>
        {/* Vai para a tela BuscarNome */}

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('BuscarCor')}
        >
          <Text style={styles.buttonText}>Buscar por Cor</Text>
        </TouchableOpacity>
        {/* Vai para a tela BuscarCor */}

        <TouchableOpacity 
          style={styles.modalButton} 
          onPress={abrirModal}
        >
          <Text style={styles.buttonText}>Voltar ao Modal</Text>
        </TouchableOpacity>
        {/* Botão para reabrir o modal de apelido */}
      </View>
    </ScrollView>
  );
}

// ------------------ ESTILOS ------------------
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,              // Faz o conteúdo expandir ocupando espaço total
    padding: 20,              // Espaçamento interno
    backgroundColor: '#f0f8ff', // Fundo azul clarinho
    alignItems: 'center'      // Centraliza elementos na horizontal
  },
  container: { 
    flex: 1, 
    alignItems: 'center',
    width: '100%'             // Ocupa toda a largura disponível da tela
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginVertical: 15        // Espaço acima e abaixo do título
  },
  greeting: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#0d6efd',         // Azul para destaque
    marginBottom: 20
  },
  button: { 
    alignSelf: 'stretch',     // Faz o botão ocupar toda a largura do container
    height: 50,               // Mantém altura fixa
    backgroundColor: '#198754', // Verde (padrão)
    justifyContent: 'center', // Centraliza verticalmente o texto
    alignItems: 'center',     // Centraliza horizontalmente o texto
    borderRadius: 8, 
    marginBottom: 10          // Espaço entre botões
  },
  modalButton: { 
    alignSelf: 'stretch',     // Mesmo comportamento: ocupa toda a largura
    height: 50,               
    backgroundColor: '#0d6efd', // Azul (diferente dos outros botões)
    justifyContent: 'center', 
    alignItems: 'center',
    borderRadius: 8, 
    marginTop: 20             // Espaço acima do botão "Voltar ao Modal"
  },
  buttonText: { 
    color: '#fff',            // Texto branco
    fontSize: 18, 
    fontWeight: 'bold'
  },
});

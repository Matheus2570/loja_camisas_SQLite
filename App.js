// --------------------------------------------------
// Arquivo principal do aplicativo
// Configura o React Navigation e centraliza o banco de dados SQLite
// --------------------------------------------------

import React, { useEffect, useState } from 'react'; 
// React: biblioteca principal
// useState: gerencia estados dentro do componente
// useEffect: executa efeitos colaterais após renderizações

import { View, Text } from 'react-native'; 
// Componentes básicos para exibir conteúdo na tela

import { NavigationContainer } from '@react-navigation/native'; 
// Container principal que habilita a navegação entre telas

import { createStackNavigator } from '@react-navigation/stack'; 
// Stack Navigator: navegação empilhada (uma tela sobre a outra)

import * as SQLite from 'expo-sqlite'; 
// Biblioteca do Expo para banco de dados SQLite

import AsyncStorage from '@react-native-async-storage/async-storage'; 
// AsyncStorage: armazena dados simples no dispositivo (como apelido do usuário)

// ---------------- TELAS ----------------
import ModalApelido from './pages/ModalApelido'; // Modal para o usuário inserir apelido
import Home from './pages/Home'; // Tela principal
import ListaProdutos from './pages/ListaProdutos'; // Tela para listar produtos
import InserirProduto from './pages/InserirProduto'; // Tela para inserir produto
import BuscarNome from './pages/BuscarNome'; // Tela para buscar por nome
import BuscarCor from './pages/BuscarCor'; // Tela para buscar por cor
import DetalhesProduto from './pages/DetalhesProduto'; // Tela de detalhes do produto

const Stack = createStackNavigator(); 
// Cria o stack navigator para navegação entre telas

let db; 
// Variável global que armazenará a conexão com o banco de dados

// ---------------- PRODUTOS INICIAIS ----------------
const produtosIniciais = [
  // Lista de produtos que serão inseridos automaticamente se o banco estiver vazio
  {
    nome: 'Estojo CaCapy',
    imagem: 'https://m.media-amazon.com/images/I/71KgMNrFLmL._UY1000_.jpg',
    cores: 'Vermelho, preto, roxo, azul',
    tamanhos: 'P,M,G',
    descricao: 'Estojo de capivara de diversos tamanhos sendo super útil para seu dia a dia acadêmico!',
  },
  {
    nome: 'Chaveiros Capizinha',
    imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrgTfsRY3ew-FQ32IWuJOO09jGg9qty_7kvA&s',
    cores: 'Azul Claro,Branco',
    tamanhos: 'P,M,G,GG',
    descricao: 'Chaveiros lindos e fofos.',
  },
  {
    nome: 'Canetas Capizinha',
    imagem: 'https://images.tcdn.com.br/img/img_prod/960901/180_kit_capivara_4_itens_1947_1_60a1d2021afd3a4a659771bc00476ad2.jpeg',
    cores: 'Op1, Op2, Op3',
    tamanhos: 'M,G,GG',
    descricao: 'Desenham super bem e são lindas.',
  },
  {
    nome: 'Xícara capilita.',
    imagem: 'https://gerbran.cdn.magazord.com.br/img/2025/04/produto/10809/32270.png?ims=600x600',
    cores: 'Vermelha,Azul',
    tamanhos: 'P,M,G',
    descricao: 'Cores vibrantes para o seu café.',
  },
];

// ---------------- BANCO DE DADOS ----------------
async function setupDatabase() {
  // Função que cria a tabela e insere produtos iniciais caso não existam
  try {
    db = await SQLite.openDatabaseAsync('loja_camisetas.db'); 
    // Abre ou cria o banco de dados

    await db.runAsync(
      `CREATE TABLE IF NOT EXISTS camisetas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        imagem TEXT,
        cores TEXT,
        tamanhos TEXT,
        descricao TEXT
      );`
    ); 
    // Cria a tabela camisetas caso não exista

    const result = await db.getFirstAsync('SELECT COUNT(*) as qtd FROM camisetas;'); 
    // Verifica se já existem produtos cadastrados

    if (result && result.qtd === 0) {
      // Se não houver produtos, insere os produtos iniciais
      for (const p of produtosIniciais) {
        await db.runAsync(
          'INSERT INTO camisetas (nome, imagem, cores, tamanhos, descricao) VALUES (?, ?, ?, ?, ?);',
          [p.nome, p.imagem, p.cores, p.tamanhos, p.descricao]
        );
      }
    }
  } catch (err) {
    console.error('Erro ao inicializar o banco de dados:', err);
    throw err; // Lança o erro para tratamento posterior
  }
}

// ---------------- FUNÇÕES DE CRUD ----------------
export async function getProdutos(query = 'SELECT * FROM camisetas') {
  // Função para buscar produtos no banco (pode receber query personalizada)
  try {
    const produtos = await db.getAllAsync(query); 
    return produtos; // Retorna lista de produtos
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
}

export async function insertProduto(produto) {
  // Função para inserir um novo produto
  try {
    const result = await db.runAsync(
      'INSERT INTO camisetas (nome, imagem, cores, tamanhos, descricao) VALUES (?, ?, ?, ?, ?);',
      [produto.nome, produto.imagem, produto.cores, produto.tamanhos, produto.descricao]
    );
    return result;
  } catch (error) {
    console.error('Erro ao inserir produto:', error);
    throw error;
  }
}

export async function updateProduto(produto) {
  // Função para atualizar um produto existente
  try {
    const result = await db.runAsync(
      'UPDATE camisetas SET nome=?, imagem=?, cores=?, tamanhos=?, descricao=? WHERE id=?;',
      [produto.nome, produto.imagem, produto.cores, produto.tamanhos, produto.descricao, produto.id]
    );
    return result;
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    throw error;
  }
}

export async function deleteProduto(id) {
  // Função para deletar um produto pelo ID
  try {
    const result = await db.runAsync(
      'DELETE FROM camisetas WHERE id=?;',
      [id]
    );
    return result;
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    throw error;
  }
}

// ---------------- APP PRINCIPAL ----------------
export default function App() {
  const [apelido, setApelido] = useState(''); 
  // Armazena o apelido do usuário

  const [modalVisible, setModalVisible] = useState(true); 
  // Controla se o modal de apelido está visível

  const [dbReady, setDbReady] = useState(false); 
  // Indica se o banco de dados foi inicializado

  useEffect(() => {
    // Efeito executado quando o app inicia
    async function initApp() {
      try {
        await setupDatabase(); // Inicializa o banco de dados
        setDbReady(true); // Banco pronto

        const storedApelido = await AsyncStorage.getItem('apelido'); 
        // Recupera apelido armazenado

        if (storedApelido) {
          setApelido(storedApelido); 
          setModalVisible(false); // Oculta modal se apelido já existir
        }
      } catch (error) {
        console.log('Erro ao inicializar app:', error);
      }
    }
    initApp();
  }, []);

  if (!dbReady) {
    // Enquanto banco não estiver pronto, mostra mensagem de carregamento
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Carregando banco de dados...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {modalVisible && (
        <ModalApelido
          visible={modalVisible} 
          onClose={(ap) => {
            setApelido(ap); 
            setModalVisible(false); 
          }}
        />
      )}

      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#0d6efd' }, // Cor do cabeçalho
          headerTintColor: '#fff', // Cor do texto do cabeçalho
          headerTitleStyle: { fontWeight: 'bold' }, // Texto em negrito
        }}
      >
        <Stack.Screen name="Home" options={{ title: 'Menu Principal' }}>
          {(props) => (
            <Home
              {...props} // Passa propriedades do stack
              apelido={apelido} // Passa apelido do usuário
              abrirModal={() => setModalVisible(true)} // Função para abrir modal
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="ListaProdutos"
          component={ListaProdutos}
          options={{ title: 'Lista de Camisetas' }}
        />
        <Stack.Screen
          name="InserirProduto"
          component={InserirProduto}
          options={{ title: 'Inserir Camiseta' }}
        />
        <Stack.Screen
          name="BuscarNome"
          component={BuscarNome}
          options={{ title: 'Buscar por Nome' }}
        />
        <Stack.Screen
          name="BuscarCor"
          component={BuscarCor}
          options={{ title: 'Buscar por Cor' }}
        />
        <Stack.Screen
          name="DetalhesProduto"
          component={DetalhesProduto}
          options={{ title: 'Detalhes da Camiseta' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

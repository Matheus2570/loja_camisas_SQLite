// --------------------------------------------------
// Arquivo principal do aplicativo
// Configura o React Navigation e centraliza o banco de dados SQLite
// --------------------------------------------------

import React, { useEffect, useState } from 'react'; 
// Importa React e os hooks useState e useEffect
// useState: para controlar estados locais (como apelido, modal, dbReady)
// useEffect: executa efeitos colaterais após renderização

import { View, Text } from 'react-native'; 
// Componentes básicos do React Native:
// View: container para agrupar elementos
// Text: exibe texto na tela

import { NavigationContainer } from '@react-navigation/native'; 
// Container que gerencia toda a navegação entre telas

import { createStackNavigator } from '@react-navigation/stack'; 
// Cria a pilha de navegação (stack navigation)

import * as SQLite from 'expo-sqlite'; 
// Biblioteca para usar banco SQLite no app

import AsyncStorage from '@react-native-async-storage/async-storage'; 
// Armazenamento local simples (chave-valor), usado aqui para guardar o apelido do usuário


// ---------------- TELAS ----------------
import ModalApelido from './pages/ModalApelido';
import Home from './pages/Home';
import ListaProdutos from './pages/ListaProdutos';
import InserirProduto from './pages/InserirProduto';
import BuscarNome from './pages/BuscarNome';
import BuscarCor from './pages/BuscarCor';
import DetalhesProduto from './pages/DetalhesProduto';
// Importa todas as telas do app para navegação


const Stack = createStackNavigator(); 
// Cria a instância da pilha de navegação

let db; 
// Variável global para armazenar a conexão com o banco SQLite


// ---------------- PRODUTOS INICIAIS ----------------
const produtosIniciais = [
  // Array de produtos padrões que serão inseridos no banco caso esteja vazio
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
  // Função que inicializa o banco SQLite
  try {
    db = await SQLite.openDatabaseAsync('loja_capivarasCorreto.db'); 
    // Abre (ou cria) o banco de dados chamado "loja_capivaras.db"

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
    // Cria a tabela "camisetas" caso ainda não exista

    // ---------------- INSERÇÃO CONDICIONAL ----------------
    const existentes = await db.getAllAsync('SELECT COUNT(*) as count FROM camisetas;');
    // Verifica se já existem produtos na tabela

    if (existentes[0].count === 0) {
      // Só insere os produtos iniciais se a tabela estiver vazia
      for (const p of produtosIniciais) {
        await db.runAsync(
          'INSERT INTO camisetas (nome, imagem, cores, tamanhos, descricao) VALUES (?, ?, ?, ?, ?);',
          [p.nome, p.imagem, p.cores, p.tamanhos, p.descricao]
        );
      }
    }

  } catch (err) {
    console.error('Erro ao inicializar o banco de dados:', err);
    throw err;
  }
}


// ---------------- FUNÇÕES DE CRUD ----------------
export async function getProdutos(query = 'SELECT * FROM camisetas') {
  // Função para buscar produtos no banco
  try {
    return await db.getAllAsync(query); 
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
}

export async function insertProduto(produto) {
  // Função para inserir novo produto
  try {
    return await db.runAsync(
      'INSERT INTO camisetas (nome, imagem, cores, tamanhos, descricao) VALUES (?, ?, ?, ?, ?);',
      [produto.nome, produto.imagem, produto.cores, produto.tamanhos, produto.descricao]
    );
  } catch (error) {
    console.error('Erro ao inserir produto:', error);
    throw error;
  }
}

export async function updateProduto(produto) {
  // Função para atualizar um produto existente
  try {
    return await db.runAsync(
      'UPDATE camisetas SET nome=?, imagem=?, cores=?, tamanhos=?, descricao=? WHERE id=?;',
      [produto.nome, produto.imagem, produto.cores, produto.tamanhos, produto.descricao, produto.id]
    );
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    throw error;
  }
}

export async function deleteProduto(id) {
  // Função para deletar um produto pelo ID
  try {
    return await db.runAsync('DELETE FROM camisetas WHERE id=?;', [id]);
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    throw error;
  }
}


// ---------------- APP PRINCIPAL ----------------
export default function App() {
  const [apelido, setApelido] = useState(''); 
  // Estado para armazenar o apelido do usuário

  const [modalVisible, setModalVisible] = useState(true); 
  // Estado para controlar se o modal de apelido está visível

  const [dbReady, setDbReady] = useState(false); 
  // Estado para indicar se o banco foi inicializado

  useEffect(() => {
    // Executa apenas uma vez quando o app é montado
    async function initApp() {
      try {
        await setupDatabase(); 
        // Inicializa o banco
        setDbReady(true); // Banco pronto

        const storedApelido = await AsyncStorage.getItem('apelido'); 
        // Recupera apelido salvo no AsyncStorage
        if (storedApelido) {
          setApelido(storedApelido); 
          setModalVisible(false); 
          // Se já existir apelido, não mostra o modal
        }
      } catch (error) {
        console.log('Erro ao inicializar app:', error);
      }
    }
    initApp();
  }, []); // Array vazio: roda apenas uma vez

  // ---------------- RENDERIZAÇÃO ----------------
  if (!dbReady) {
    // Enquanto o banco não estiver pronto, mostra mensagem de carregamento
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Carregando banco de dados...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {/* Modal para digitar apelido */}
      {modalVisible && (
        <ModalApelido
          visible={modalVisible} 
          onClose={(ap) => {
            setApelido(ap); 
            setModalVisible(false); 
          }}
        />
      )}

      {/* Stack de navegação */}
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#0d6efd' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {/* Tela Home */}
        <Stack.Screen name="Home" options={{ title: 'Menu Principal' }}>
          {(props) => (
            <Home
              {...props}
              apelido={apelido}
              abrirModal={() => setModalVisible(true)}
            />
          )}
        </Stack.Screen>

        {/* Outras telas */}
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

// --------------------------------------------------
// Arquivo principal do aplicativo
// Configura o React Navigation e centraliza o banco de dados SQLite
// --------------------------------------------------

import React, { useEffect, useState } from 'react'; 
// React é a base do app, useState controla estados locais e useEffect lida com efeitos colaterais

import { View, Text } from 'react-native'; 
// Componentes básicos da UI do React Native

import { NavigationContainer } from '@react-navigation/native'; 
// Container que vai gerenciar toda a navegação do app

import { createStackNavigator } from '@react-navigation/stack'; 
// Cria a pilha de telas (stack navigation)

import * as SQLite from 'expo-sqlite'; 
// Biblioteca para usar banco SQLite no app

import AsyncStorage from '@react-native-async-storage/async-storage'; 
// Armazenamento local simples (chave-valor), usado para guardar o apelido


// ---------------- TELAS ----------------
import ModalApelido from './pages/ModalApelido';
import Home from './pages/Home';
import ListaProdutos from './pages/ListaProdutos';
import InserirProduto from './pages/InserirProduto';
import BuscarNome from './pages/BuscarNome';
import BuscarCor from './pages/BuscarCor';
import DetalhesProduto from './pages/DetalhesProduto';
// Importação de todas as telas/páginas que o usuário pode navegar


const Stack = createStackNavigator(); 
// Cria a instância da pilha de navegação

let db; 
// Variável global para guardar a conexão com o banco


// ---------------- PRODUTOS INICIAIS ----------------
const produtosIniciais = [
  // Array de produtos padrão que já vêm no app quando ele inicia
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
  try {
    db = await SQLite.openDatabaseAsync('loja_capivaras.db'); 
    // Abre (ou cria) o banco SQLite chamado "loja_capivaras.db"

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


    // Insere os produtos iniciais
    for (const p of produtosIniciais) {
      await db.runAsync(
        'INSERT INTO camisetas (nome, imagem, cores, tamanhos, descricao) VALUES (?, ?, ?, ?, ?);',
        [p.nome, p.imagem, p.cores, p.tamanhos, p.descricao]
      );
    }
  } catch (err) {
    console.error('Erro ao inicializar o banco de dados:', err);
    throw err;
  }
}


// ---------------- FUNÇÕES DE CRUD ----------------
export async function getProdutos(query = 'SELECT * FROM camisetas') {
  // Busca todos os produtos (ou executa um SELECT customizado)
  try {
    return await db.getAllAsync(query); 
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
}

export async function insertProduto(produto) {
  // Insere um novo produto no banco
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
  // Atualiza os dados de um produto existente
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
  // Deleta um produto pelo ID
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
  // Armazena o apelido do usuário

  const [modalVisible, setModalVisible] = useState(true); 
  // Controla se o modal do apelido vai aparecer

  const [dbReady, setDbReady] = useState(false); 
  // Indica se o banco já foi inicializado

  useEffect(() => {
    // Roda apenas uma vez quando o app abre
    async function initApp() {
      try {
        await setupDatabase(); 
        // Cria/abre o banco e insere os produtos iniciais
        setDbReady(true);

        const storedApelido = await AsyncStorage.getItem('apelido'); 
        // Recupera o apelido salvo no armazenamento local
        if (storedApelido) {
          setApelido(storedApelido); 
          setModalVisible(false); 
          // Se já existir apelido salvo, não mostra o modal
        }
      } catch (error) {
        console.log('Erro ao inicializar app:', error);
      }
    }
    initApp();
  }, []);

  // Enquanto o banco não estiver pronto, mostra tela de loading
  if (!dbReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Carregando banco de dados...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {/* Se o modal estiver ativo, mostra a tela para digitar apelido */}
      {modalVisible && (
        <ModalApelido
          visible={modalVisible} 
          onClose={(ap) => {
            setApelido(ap); 
            setModalVisible(false); 
          }}
        />
      )}

      {/* Configuração da pilha de navegação */}
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#0d6efd' }, // Cor do cabeçalho
          headerTintColor: '#fff', // Cor do texto/botões no cabeçalho
          headerTitleStyle: { fontWeight: 'bold' }, // Negrito no título
        }}
      >
        {/* Tela principal (Home), passando o apelido como prop */}
        <Stack.Screen name="Home" options={{ title: 'Menu Principal' }}>
          {(props) => (
            <Home
              {...props}
              apelido={apelido}
              abrirModal={() => setModalVisible(true)}
            />
          )}
        </Stack.Screen>

        {/* Outras telas da aplicação */}
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

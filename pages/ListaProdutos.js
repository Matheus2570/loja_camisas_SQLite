// ------------------ IMPORTS ------------------
import React, { useState, useCallback } from "react"; 
// Importa React e hooks:
// - useState: para armazenar o estado dos produtos
// - useCallback: otimiza funções para não serem recriadas a cada renderização

import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native"; 
// Importa componentes do React Native:
// - View: container de elementos
// - Text: para exibir texto
// - FlatList: lista eficiente para muitos itens
// - TouchableOpacity: botão que reage ao toque
// - Image: exibe imagens
// - StyleSheet: cria estilos

import { useFocusEffect } from '@react-navigation/native'; 
// Hook que executa efeito sempre que a tela ganha foco (quando o usuário volta para ela)

import { getProdutos } from "../App"; 
// Importa a função que busca os produtos no banco SQLite

// ------------------ COMPONENTE ------------------
export default function ListaProdutos({ navigation }) {
    // Componente recebe a prop 'navigation' para navegar entre telas

    const [produtos, setProdutos] = useState([]); 
    // Estado que armazena os produtos carregados do banco

    // ------------------ CARREGAR PRODUTOS ------------------
    // Substitui o useEffect por useFocusEffect
    useFocusEffect(
        // useCallback evita que a função seja recriada em cada renderização
        useCallback(() => {
            async function carregarProdutos() {
                const dados = await getProdutos(); 
                // Chama função para buscar produtos no banco
                setProdutos(dados); 
                // Atualiza o estado com os produtos carregados
            }
            carregarProdutos();
        }, [])
    );

    // ------------------ RENDERIZAÇÃO DE CADA ITEM ------------------
    const renderItem = ({ item }) => (
        // Cada item é um card clicável
        <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate("DetalhesProduto", { produto: item })}
            // Ao clicar, navega para tela de detalhes passando o produto como parâmetro
        >
            <Image source={{ uri: item.imagem }} style={styles.image} />
            {/* Mostra imagem do produto */}
            <Text style={styles.name}>{item.nome}</Text>
            {/* Mostra nome do produto */}
            <Text style={styles.colors}>Cores: {item.cores}</Text>
            {/* Mostra cores disponíveis */}
        </TouchableOpacity>
    );

    // ------------------ RETORNO DO COMPONENTE ------------------
    return (
        <View style={styles.container}>
            {/* FlatList renderiza a lista de produtos */}
            <FlatList 
                data={produtos} 
                keyExtractor={(item) => item.id.toString()} 
                // Chave única de cada item
                renderItem={renderItem} 
                // Função que renderiza cada item
            />
        </View>
    );
}

// ------------------ ESTILOS ------------------
const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 }, 
    // Container ocupa toda a tela e tem padding interno

    card: { 
        backgroundColor: "#f8f9fa", 
        // Cor de fundo do card
        padding: 15, 
        // Espaço interno
        marginBottom: 10, 
        // Espaço entre cards
        borderRadius: 8, 
        // Bordas arredondadas
        elevation: 3 
        // Sombra (Android)
    },

    image: { 
        width: "100%", 
        height: 350, 
        borderRadius: 8, 
        marginBottom: 10 
        // Estilo da imagem
    },

    name: { 
        fontSize: 18, 
        fontWeight: "bold", 
        marginBottom: 5, 
        color: "#0d6efd" 
        // Estilo do nome do produto
    },

    colors: { 
        fontSize: 14, 
        color: "#333" 
        // Estilo do texto com cores disponíveis
    },
});

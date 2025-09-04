// ------------------ IMPORTS ------------------
import React, { useState, useEffect } from "react"; 
// Importa React e hooks:
// - useState: para armazenar o estado dos produtos
// - useEffect: executa efeitos colaterais após a renderização

import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native"; 
// Importa componentes do React Native:
// - View: container para agrupar elementos
// - Text: exibe texto
// - FlatList: lista eficiente para muitos itens
// - TouchableOpacity: botão que reage ao toque
// - Image: exibe imagens
// - StyleSheet: cria estilos

import { getProdutos } from "../App"; 
// Importa a função que busca produtos do banco SQLite

// ------------------ COMPONENTE ------------------
export default function ListaProdutos({ navigation }) {
    // Componente funcional que recebe a prop 'navigation' para navegação entre telas

    const [produtos, setProdutos] = useState([]); 
    // Estado que armazena os produtos carregados do banco

    // ------------------ CARREGAR PRODUTOS ------------------
    useEffect(() => {
        // useEffect executa ao montar o componente
        async function carregarProdutos() {
            try {
                const dados = await getProdutos(); 
                // Chama a função que busca produtos no banco
                setProdutos(dados); 
                // Atualiza o estado com os produtos carregados
            } catch (e) {
                console.error("Erro ao carregar produtos:", e);
                // Loga erro caso ocorra falha ao buscar produtos
            }
        }
        carregarProdutos();
    }, []); 
    // Array vazio [] garante que o efeito execute apenas uma vez ao montar o componente

    // ------------------ RENDERIZAÇÃO DE CADA ITEM ------------------
    const renderItem = ({ item }) => (
        // Função que define como cada item da lista será exibido
        <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate("DetalhesProduto", { produto: item })}
            // Ao clicar, navega para a tela de detalhes passando o produto como parâmetro
        >
            <Image source={{ uri: item.imagem }} style={styles.image} />
            {/* Exibe a imagem do produto */}
            <Text style={styles.name}>{item.nome}</Text>
            {/* Exibe o nome do produto */}
            <Text style={styles.colors}>Cores: {item.cores}</Text>
            {/* Exibe as cores disponíveis */}
        </TouchableOpacity>
    );

    // ------------------ RETORNO DO COMPONENTE ------------------
    return (
        <View style={styles.container}>
            {/* FlatList renderiza a lista de produtos */}
            <FlatList 
                data={produtos} 
                // Array de produtos a ser exibido
                keyExtractor={(item) => item.id.toString()} 
                // Chave única para cada item
                renderItem={renderItem} 
                // Função que renderiza cada item
                showsVerticalScrollIndicator={false}
                // Remove a barra de rolagem vertical
            />
        </View>
    );
}

// ------------------ ESTILOS ------------------
const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 10 
        // Container ocupa toda a tela com padding interno
    },

    card: { 
        backgroundColor: "#f8f9fa", 
        // Cor de fundo do card
        padding: 15, 
        // Espaço interno
        marginBottom: 10, 
        // Espaço entre os cards
        borderRadius: 8, 
        // Bordas arredondadas
        elevation: 3 
        // Sombra para Android
    },

    image: { 
        width: "100%", 
        height: 350, 
        borderRadius: 8, 
        marginBottom: 10 
        // Estilo da imagem do produto
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
        // Estilo do texto que mostra as cores
    },
});

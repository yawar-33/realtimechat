import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Image, ActivityIndicator } from 'react-native';
import { Database } from '../services/Database';
import { SocketService } from '../services/SocketService';
import { SHOPPING_ITEMS, shuffleArray } from '../constants/ShoppingData';
import { Send, LogOut } from 'lucide-react-native';

const ChatScreen = ({ navigation }) => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [page, setPage] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);
    const [shuffledStore, setShuffledStore] = useState([]);
    const socketRef = useRef(null);

    useEffect(() => {
        Database.init();
        loadInitialMessages();
        setShuffledStore(shuffleArray(SHOPPING_ITEMS));

        socketRef.current = SocketService.connect();
        SocketService.onMessage(async (msg) => {
            await Database.saveMessage(msg);
            setMessages(prev => [msg, ...prev]);
        });

        // Background cleanup
        const cleanup = setInterval(() => {
            Database.deleteExpiredMessages();
        }, 60000); // Check every minute

        return () => {
            clearInterval(cleanup);
            SocketService.disconnect();
        };
    }, []);

    const loadInitialMessages = async () => {
        const initial = await Database.getMessages(0, 20);
        setMessages(initial.reverse());
    };

    const loadMoreMessages = async () => {
        if (loadingMore) return;
        setLoadingMore(true);
        const nextPage = page + 1;
        const more = await Database.getMessages(nextPage, 20);
        if (more.length > 0) {
            setMessages(prev => [...prev, ...more.reverse()]);
            setPage(nextPage);
        }
        setLoadingMore(false);
    };

    const handleSend = async () => {
        if (!text.trim()) return;

        if (text.toLowerCase() === 'detener') {
            await handleDetener();
            return;
        }

        const msg = {
            id: Date.now().toString(),
            sender: 'Me', // Simplified for MVP
            text: text,
            timestamp: Date.now()
        };

        await Database.saveMessage(msg);
        setMessages(prev => [msg, ...prev]);
        SocketService.sendMessage(msg);
        setText('');
    };

    const handleDetener = async () => {
        await Database.clearAllMessages();
        setMessages([]);
        setPage(0);
        SocketService.disconnect();
        navigation.replace('Login');
    };

    const renderHeader = () => (
        <View style={styles.shopContainer}>
            <Text style={styles.shopTitle}>Featured Items</Text>
            <FlatList
                horizontal
                data={shuffledStore}
                keyExtractor={item => item.id}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={styles.shopItem}>
                        <Text style={styles.shopIcon}>{item.image}</Text>
                        <Text style={styles.shopItemName}>{item.name}</Text>
                        <Text style={styles.shopItemPrice}>{item.price}</Text>
                    </View>
                )}
            />
        </View>
    );

    const renderMessage = ({ item }) => (
        <View style={[styles.msgBubble, item.sender === 'Me' ? styles.msgMe : styles.msgOther]}>
            <Text style={styles.msgText}>{item.text}</Text>
            <Text style={styles.msgTime}>
                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Anonymous Chat</Text>
                <TouchableOpacity onPress={() => navigation.replace('Login')}>
                    <LogOut color="#94a3b8" size={24} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={messages}
                inverted
                keyExtractor={item => item.id}
                renderItem={renderMessage}
                ListHeaderComponent={<View style={{ height: 20 }} />}
                ListFooterComponent={
                    <View>
                        {loadingMore && <ActivityIndicator style={{ margin: 10 }} />}
                        {renderHeader()}
                    </View>
                }
                onEndReached={loadMoreMessages}
                onEndReachedThreshold={0.1}
                contentContainerStyle={styles.listContent}
            />

            <View style={styles.inputArea}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    placeholderTextColor="#666"
                    value={text}
                    onChangeText={setText}
                />
                <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                    <Send color="#fff" size={20} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f172a' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#1e293b'
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#f8fafc' },
    listContent: { paddingHorizontal: 16 },
    msgBubble: {
        padding: 12,
        borderRadius: 16,
        marginBottom: 12,
        maxWidth: '80%',
    },
    msgMe: { alignSelf: 'flex-end', backgroundColor: '#3b82f6' },
    msgOther: { alignSelf: 'flex-start', backgroundColor: '#1e293b' },
    msgText: { color: '#f8fafc', fontSize: 15 },
    msgTime: { color: '#cbd5e1', fontSize: 10, alignSelf: 'flex-end', marginTop: 4 },
    inputArea: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#1e293b',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#0f172a',
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingVertical: 10,
        color: '#f8fafc',
        marginRight: 12,
    },
    sendBtn: {
        backgroundColor: '#3b82f6',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    shopContainer: { paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
    shopTitle: { color: '#94a3b8', fontSize: 14, fontWeight: '600', marginBottom: 12, paddingHorizontal: 16 },
    shopItem: {
        backgroundColor: '#1e293b',
        padding: 12,
        borderRadius: 12,
        marginHorizontal: 8,
        width: 120,
        alignItems: 'center',
    },
    shopIcon: { fontSize: 24, marginBottom: 8 },
    shopItemName: { color: '#f8fafc', fontSize: 12, fontWeight: '500', textAlign: 'center' },
    shopItemPrice: { color: '#3b82f6', fontSize: 11, marginTop: 4 },
});

export default ChatScreen;

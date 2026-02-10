import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { AuthService } from '../services/AuthService';

const LoginScreen = ({ navigation }) => {
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const handleAuth = async () => {
        if (!mobileNumber || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (isLogin) {
            const success = await AuthService.login(mobileNumber, password);
            if (success) {
                navigation.replace('Chat');
            } else {
                Alert.alert('Error', 'Invalid credentials or user not found');
            }
        } else {
            await AuthService.signup(mobileNumber, password);
            Alert.alert('Success', 'Account created! Please login.');
            setIsLogin(true);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
                <View style={styles.header}>
                    <Text style={styles.title}>Antigravity Chat</Text>
                    <Text style={styles.subtitle}>Privacy-First. Real-Time.</Text>
                </View>

                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Mobile Number"
                        placeholderTextColor="#666"
                        value={mobileNumber}
                        onChangeText={setMobileNumber}
                        keyboardType="phone-pad"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#666"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.button} onPress={handleAuth}>
                        <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchBtn}>
                        <Text style={styles.switchText}>
                            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f172a' },
    inner: { flex: 1, justifyContent: 'center', padding: 24 },
    header: { marginBottom: 40, alignItems: 'center' },
    title: { fontSize: 32, fontWeight: 'bold', color: '#f8fafc', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#94a3b8' },
    form: { gap: 16 },
    input: {
        backgroundColor: '#1e293b',
        padding: 16,
        borderRadius: 12,
        color: '#f8fafc',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    button: {
        backgroundColor: '#3b82f6',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
    switchBtn: { marginTop: 16, alignItems: 'center' },
    switchText: { color: '#94a3b8', fontSize: 14 },
});

export default LoginScreen;

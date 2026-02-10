import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'react-native-crypto-js';

const AUTH_KEY = '@user_auth';

export const AuthService = {
    async signup(mobileNumber, password) {
        const hashedPassword = CryptoJS.SHA256(password).toString();
        const userData = { mobileNumber, hashedPassword };
        await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(userData));
        return true;
    },

    async login(mobileNumber, password) {
        const storedData = await AsyncStorage.getItem(AUTH_KEY);
        if (!storedData) return false;

        const { mobileNumber: storedNumber, hashedPassword } = JSON.parse(storedData);
        const currentHash = CryptoJS.SHA256(password).toString();

        return mobileNumber === storedNumber && currentHash === hashedPassword;
    },

    async isAuthenticated() {
        const storedData = await AsyncStorage.getItem(AUTH_KEY);
        return !!storedData;
    },

    async logout() {
        // We might not want to clear auth on 'detener', only chat data.
        // But for a full reset except credentials, we keep this.
        // The user said "Login credentials must remain stored" during destruction.
    }
};

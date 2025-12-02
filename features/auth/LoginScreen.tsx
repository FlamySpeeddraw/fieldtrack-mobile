import { Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from '../../constants/general.constants';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { login } from '../api/auth.api';

const LoginScreen = () => {
    const [mail, setMail] = useState<string>("");
    const [mdp, setMdp] = useState<string>("");
    const [error, setError] = useState<string>("");

    const router = useRouter();

    const handlePress = async () => {
        if (!mail || !mdp) {
            return setError("Il faut remplir tous les champs");
        }

        if (!mail.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            return setError("Il faut remplir tous les champs");
        }

        const response = await login(mail, mdp);
        if (!response.success) {
            return setError("Mail ou mot de passe invalide");
        }

        router.replace("/(protected)/interventionList");
    }

    return (
        <SafeAreaView style={ styles.container }>
            <Text>Connexion</Text>
            <TextInput value={mail} onChangeText={setMail} placeholder='Mail' autoCapitalize='none' keyboardType='email-address' />
            <TextInput value={mdp} onChangeText={setMdp} placeholder='Mot de passe' autoCapitalize='none' />
            <Text>{error}</Text>
            <Pressable onPress={() => handlePress()}>
                <Text>Se connecter</Text>
            </Pressable>
        </SafeAreaView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    }
});
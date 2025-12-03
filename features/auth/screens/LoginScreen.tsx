import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { login } from '../api/auth.api';
import { Lock, LogIn, Mail } from 'lucide-react-native';
import TextInputIcon from '../components/TextInputIcon';
import { styles } from '../styles/loginScreen.styles';

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
        <SafeAreaView style={styles.container}>
            <View style={styles.loginIcon}>
                <LogIn color={'white'} size={40} />
            </View>
            <Text style={styles.title}>Connexion à FieldTrack</Text>
            <Text style={styles.subtitle}>Connectez-vous à votre compte</Text>
            <View style={styles.formContainer}>
                <TextInputIcon
                    icon={<Mail color={'#8d8d8dff'} size={20} style={{ marginHorizontal: 10 }} />}
                    label='Mail'
                    value={mail}
                    onChangeText={setMail}
                    placeholder='user@mail.com'
                    autoCapitalize='none'
                    keyboardType='email-address'
                />
                <TextInputIcon
                    icon={<Lock color={'#8d8d8dff'} size={20} style={{ marginHorizontal: 10 }} />}
                    label='Mot de passe'
                    value={mdp}
                    onChangeText={setMdp}
                    placeholder='••••••••'
                    autoCapitalize='none'
                    secureTextEntry
                />
                <Text style={styles.error}>{error}</Text>
                <Pressable style={styles.button} onPress={() => handlePress()}>
                    <Text style={styles.buttonText}>Se connecter</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

export default LoginScreen;
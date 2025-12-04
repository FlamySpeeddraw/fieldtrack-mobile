import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
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
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const router = useRouter();

    const handlePress = async () => {
        if (isLoading) {
            return;
        }

        setIsLoading(true);
        if (!mail || !mdp) {
            setIsLoading(false);
            return setError("Il faut remplir tous les champs");
        }

        if (!mail.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            setIsLoading(false);
            return setError("Il faut remplir tous les champs");
        }

        const response = await login(mail, mdp);
        if (!response.success) {
            setIsLoading(false);
            return setError("Mail ou mot de passe invalide");
        }

        setIsLoading(false);
        router.replace("/(protected)/interventionList");
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
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
                            {isLoading ?
                                <ActivityIndicator color={"white"} />
                                :
                                <Text style={styles.buttonText}>Se connecter</Text>
                            }
                        </Pressable>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;
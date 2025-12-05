import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BackButton = () => {
    const router = useRouter();

    return (
        <TouchableOpacity onPress={() => router.back()} style={styles.container}>
            <Text style={styles.text}>{"<"}</Text>
        </TouchableOpacity>
    );
};

export default BackButton;

const styles = StyleSheet.create({
    container: {
        aspectRatio: 1/1,
        backgroundColor: '#007AFF',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
        marginBottom: 10
    },
    text: {
        color: 'white',
        fontSize: 25
    }
});
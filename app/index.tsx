import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Button title="Voir les interventions" onPress={() => router.push('/interventionList')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
});
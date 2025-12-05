import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Intervention } from '../types/api.types';
import { Router } from 'expo-router';
import { STATUS_ENUM, STATUS_STYLES } from '../constants/intervention.constants';

interface props {
    intervention: Intervention;
    router: Router;
}

const InterventionCard = ({ intervention, router }: props) => {
    return (
        <Pressable
            onPress={() => router.push(`/interventionDetails?intervention=${JSON.stringify(intervention)}`)}
            style={styles.card}
        >
            <View style={styles.header}>
                <Text style={styles.date}>{new Date(intervention.date_intervention).toLocaleString()}</Text>
                <Text style={[styles.status, STATUS_STYLES[intervention.status]]}>{STATUS_ENUM[intervention.status]}</Text>
            </View>
            <Text style={styles.description}>{intervention.titre}</Text>
            <Text style={styles.address}>{intervention.adresse}</Text>
        </Pressable>
    );
};

export default InterventionCard;

const styles = StyleSheet.create({
    card: {
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#f8fafc'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6
    },
    date: {
        fontSize: 14,
        color: '#374151'
    },
    status: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        fontSize: 12,
        overflow: 'hidden',
        color: 'white'
    },
    statusDone: {
        backgroundColor: '#10B981',
        color: '#ffffff'
    },
    statusInProgress: {
        backgroundColor: '#ef4444',
        color: '#ffffff'
    },
    statusPlanned: {
        backgroundColor: '#f59e0b',
        color: '#ffffff'
    },
    statusUnknown: {
        backgroundColor: '#e5e7eb',
        color: '#374151'
    },
    description: {
        fontSize: 15,
        color: '#111827',
        marginBottom: 6
    },
    address: {
        fontSize: 13,
        color: '#6b7280'
    }
});
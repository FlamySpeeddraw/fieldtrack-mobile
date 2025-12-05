import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { STATUS_ENUM, STATUS_STYLES } from '../constants/intervention.constants';

interface props {
    editMode: boolean;
    setIsEditingStatus: (value: boolean) => void;
    status: string;
}

const StatusDetails = ({ editMode, setIsEditingStatus, status }: props) => {
    return (
        <>
            <Text style={styles.label}>Statut</Text>
            <View style={styles.statusRow}>
                <View style={[styles.statusBadge, STATUS_STYLES[status.normalize("NFD").replaceAll(/\p{Diacritic}/gu, "").toLowerCase()] ]}>
                    <Text style={[styles.statusText, { color: 'white' }]}>{STATUS_ENUM[status]}</Text>
                </View>
                {editMode && (
                    <TouchableOpacity style={styles.editButton} onPress={() => setIsEditingStatus(true)}>
                        <Text style={styles.editButtonText}>Modifier</Text>
                    </TouchableOpacity>
                )}
            </View>
        </>
    );
};

export default StatusDetails;

const styles = StyleSheet.create({
    label: {
        marginTop: 10,
        fontWeight: '500',
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 6,
    },
    statusText: {
        fontSize: 16,
    },
    statusBadge: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 12,
        minWidth: 90,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editButton: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: '#007AFF',
        borderRadius: 6,
    },
    editButtonText: {
        color: '#fff',
        fontWeight: '500',
    }
});
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface props {
    status: string;
    active?: boolean;
    setFilter?: (value: string) => void
}

const StatusButton = ({ status, active, setFilter }: props) => {
    return (
        <TouchableOpacity
            style={[
                styles.statusFilterButton,
                active ? styles.statusFilterButtonActive : null,
            ]}
            onPress={() => setFilter ? setFilter(status.normalize("NFD").replaceAll(/\p{Diacritic}/gu, "").toLowerCase()) : ""}
        >
            <Text style={active ? styles.statusFilterTextActive : styles.statusFilterText}>{status}</Text>
        </TouchableOpacity>
    )
}

export default StatusButton

const styles = StyleSheet.create({
    statusFilterButton: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 16,
        backgroundColor: '#f1f5f9',
        marginRight: 8,
        marginBottom: 8,
    },
    statusFilterButtonActive: {
        backgroundColor: '#007AFF',
    },
    statusFilterText: {
        color: '#0f172a',
        fontSize: 13,
    },
    statusFilterTextActive: {
        color: '#fff',
        fontSize: 13,
    }
})
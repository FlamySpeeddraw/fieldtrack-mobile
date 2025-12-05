import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface props {
    editMode: boolean;
    setEditMode: (value: boolean) => void;
    setIsEditingStatus: (value: boolean) => void;
    reset: () => void;
}

const HeaderDetails = ({ editMode, setEditMode, setIsEditingStatus, reset }: props) => {
    return (
        <View style={styles.headerRow}>
            <Text style={styles.title}>Détails de l'intervention</Text>
            <TouchableOpacity
                style={[styles.editTopButton, editMode ? styles.editTopButtonActive : null]}
                onPress={() => {
                    if (editMode) {
                        reset();
                        setIsEditingStatus(false);
                    }
                    setEditMode(!editMode);
                }}
            >
                <Text style={styles.editTopButtonText}>{editMode ? 'Annuler' : 'Modifier'}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default HeaderDetails;

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    editTopButton: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: '#007AFF',
        borderRadius: 6,
    },
    editTopButtonActive: {
        backgroundColor: '#e33',
    },
    editTopButtonText: {
        color: '#fff',
        fontWeight: '600',
    }
});
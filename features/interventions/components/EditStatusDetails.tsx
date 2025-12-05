import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { STATUS, STATUS_STYLES } from '../constants/intervention.constants';

interface props {
    setStatus: (value: string) => void;
    setIsEditingStatus: (value: boolean) => void;
}

const EditStatusDetails = ({ setStatus, setIsEditingStatus }: props) => {
    return (
        <View style={styles.dropdown}>
            {[...STATUS].filter((entry) => entry !== "Tous").map((s) => (
                <TouchableOpacity
                    key={s}
                    style={[styles.dropdownItem, STATUS_STYLES[s.normalize("NFD").replaceAll(/\p{Diacritic}/gu, "").toLowerCase()]]}
                    onPress={() => {
                        setStatus(s.normalize("NFD").replaceAll(/\p{Diacritic}/gu, "").toLowerCase());
                        setIsEditingStatus(false);
                    }}
                >
                    <Text style={[styles.dropdownItemText, { color: 'white' }]}>{s}</Text>
                </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.dropdownCancel} onPress={() => setIsEditingStatus(false)}>
                <Text style={styles.dropdownCancelText}>Annuler</Text>
            </TouchableOpacity>
        </View>
    );
};

export default EditStatusDetails;

const styles = StyleSheet.create({
    dropdown: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        marginTop: 8,
        overflow: 'hidden',
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginVertical: 6,
        width: '80%',
        alignSelf: 'center'
    },
    dropdownItemText: {
        fontSize: 15,
        fontWeight: '600',
    },
    dropdownCancel: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#f8f8f8',
    },
    dropdownCancelText: {
        textAlign: 'center',
        color: '#333',
    }
});
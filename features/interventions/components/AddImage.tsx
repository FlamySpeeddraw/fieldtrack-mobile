import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface props {
    setPhoto: (value: string) => void;
    photo: string;
}

const AddImage = ({ setPhoto, photo }: props) => {
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            return alert("Permission refusée.\nImpossible d'accéder aux photos");
        }

        const result = await ImagePicker.launchImageLibraryAsync();

        if (result.canceled) {
            return;
        }

        if (result.assets.length === 0) {
            return alert("Une erreur est survenue");
        }

        let tempPhoto = photo + result.assets[0].uri + "\n";
        setPhoto(tempPhoto);
    }

    return (
        <View style={{ marginTop: 8, marginBottom: 8 }}>
            <TouchableOpacity style={[styles.saveButton]} onPress={pickImage}>
                <Text style={styles.saveButtonText}>Ajouter une image</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AddImage;

const styles = StyleSheet.create({
    saveButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#007AFF',
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '600',
    }
});
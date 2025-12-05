import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { File } from 'expo-file-system';

interface props {
    photo: string;
    setPhoto: (value: string) => void;
    editMode: boolean;
    setSelectedImageUri: (value: string) => void;
    selectedImageUri: string;
}

const CarousselImage = ({ photo, editMode, selectedImageUri, setSelectedImageUri, setPhoto }: props) => {
    const photosArray = photo.length === 0 ? [] : photo.split("\n").filter((entry) => entry !== "");
console.log(photo)
    if (photosArray.length < 1) {
        return (
            <Text style={styles.empty}>Aucune photo</Text>
        );
    }

    const handleRemoveImage = (uri: string) => {
        if (selectedImageUri === uri) {
            setSelectedImageUri("");
        }
        
        const photoCopy = photo.replace(uri + "\n", "");
        setPhoto(photoCopy);
    }

    return (
        <FlatList
            data={photosArray}
            horizontal
            style={{ marginTop: 8, flexGrow: 0 }}
            renderItem={({ item }) => (
                <View style={{ marginRight: 8 }}>
                    <TouchableOpacity onPress={() => setSelectedImageUri(item)}>
                        <Image source={{ uri: item }} style={{ width: 100, height: 70, borderRadius: 6 }} />
                    </TouchableOpacity>
                    {editMode && (
                        <TouchableOpacity onPress={() => handleRemoveImage(item)} style={{ position: 'absolute', top: 2, right: 2, backgroundColor: '#ef4444', borderRadius: 12, width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#fff', fontWeight: '700' }}>×</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )} />
    );
};

export default CarousselImage;

const styles = StyleSheet.create({
    empty: {
        color: '#6b7280'
    }
});
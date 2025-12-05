import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface props {
    handleSave: () => void;
    saving: boolean;
}

const SaveButton = ({ handleSave, saving }: props) => {
    return (
        <View style={{ marginBottom: '50%' }}>
            <TouchableOpacity
                activeOpacity={0.8}
                style={[
                    styles.saveButton,
                    saving ? styles.saveButtonDisabled : null,
                ]}
                onPress={handleSave}
                disabled={saving}
            >
                {saving ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.saveButtonText}>Enregistrer</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

export default SaveButton;

const styles = StyleSheet.create({
    saveButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#007AFF',
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonDisabled: {
        backgroundColor: '#cfcfcf',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    saveButtonTextDisabled: {
        color: '#6b6b6b',
    }
});
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
  Keyboard,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { sampleData } from '../../../lib/data/interventions';

export default function InterventionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const item = sampleData.find((i) => i.id === id);
  const [comment, setComment] = useState('');
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [status, setStatus] = useState<string>(item?.status ?? '');
  const statuses: string[] = ["Terminé", "En cours", "Planifié"];
  const [editMode, setEditMode] = useState(false);

  function statusStyleLocal(s: string) {
    const key = s.toLowerCase();
    if (key.includes('term')) return { backgroundColor: '#10B981' };
    if (key.includes('cours') || key.includes('progress') || key.includes('in_progress')) return { backgroundColor: '#ef4444' };
    if (key.includes('plan')) return { backgroundColor: '#f59e0b' };
    return { backgroundColor: '#e5e7eb' };
  }

  function statusTextColor(s: string) {
    const key = s.toLowerCase();
    if (key.includes('term')) return '#ffffff';
    if (key.includes('cours') || key.includes('progress') || key.includes('in_progress')) return '#ffffff';
    if (key.includes('plan')) return '#ffffff';
    return '#111827';
  }

  if (!item) {
    return (
      <View style={styles.center}>
        <Text>Intervention introuvable</Text>
        <Button title="Retour" onPress={() => router.back()} />
      </View>
    );
  }

  const imageUri = item.imageUrl ?? 'https://via.placeholder.com/600x400.png?text=No+Image';

  
  // Configure bottom margin here. Can be a number (pixels) or a percentage string like '20%'.
  const BOTTOM_MARGIN: number | string = '10%';


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={[styles.container, { paddingBottom: '10%', marginTop: 24 }]}
          keyboardShouldPersistTaps="handled"
        >
      <View style={styles.headerRow}>
        <Text style={styles.title}>Détails de l'intervention</Text>
        <TouchableOpacity
          style={[styles.editTopButton, editMode ? styles.editTopButtonActive : null]}
          onPress={() => {
            if (editMode) setIsEditingStatus(false);
            setEditMode(!editMode);
          }}
        >
          <Text style={styles.editTopButtonText}>{editMode ? 'Annuler' : 'Modifier'}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.label}>Date</Text>
      <Text>{new Date(item.date).toLocaleString()}</Text>

      <Text style={styles.label}>Statut</Text>
      <View style={styles.statusRow}>
        <View style={[styles.statusBadge, statusStyleLocal(status)]}>
          <Text style={[styles.statusText, { color: statusTextColor(status) }]}>{status}</Text>
        </View>
        {editMode && (
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditingStatus(true)}>
            <Text style={styles.editButtonText}>Modifier</Text>
          </TouchableOpacity>
        )}
      </View>

      {isEditingStatus && (
        <View style={styles.dropdown}>
          {statuses.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.dropdownItem, statusStyleLocal(s)]}
              onPress={() => {
                setStatus(s);
                setIsEditingStatus(false);
              }}
            >
              <Text style={[styles.dropdownItemText, { color: statusTextColor(s) }]}>{s}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.dropdownCancel} onPress={() => setIsEditingStatus(false)}>
            <Text style={styles.dropdownCancelText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.label}>Description</Text>
      <Text>{item.description}</Text>

      <Text style={styles.label}>Adresse</Text>
      <Text>{item.address}</Text>

      <Text style={styles.label}>Image</Text>
      <Image source={{ uri: imageUri }} style={styles.image} />

      <Text style={styles.label}>Commentaire</Text>
      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder={editMode ? "Ajouter un commentaire..." : "Cliquer sur Modifier pour éditer"}
        style={[styles.input, !editMode ? styles.inputDisabled : null]}
        multiline
        editable={editMode}
      />

      {editMode && (
        <View style={{ marginBottom: '50%' }}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.saveButton,
            ]}
            onPress={() => {
              Alert.alert('Succès', 'Modification enregistrée' + (comment ? ': ' + comment : ''), [{ text: 'OK' }]);
              setEditMode(false);
              setIsEditingStatus(false);
            }}
          >
            <Text style={styles.saveButtonText}>Enregistrer</Text>
          </TouchableOpacity>
        </View>
      )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  label: {
    marginTop: 10,
    fontWeight: '500',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  },
  inputDisabled: {
    backgroundColor: '#f2f2f2',
  },
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
  },
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
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 8,
    marginBottom: 12,
    backgroundColor: '#eee',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
});

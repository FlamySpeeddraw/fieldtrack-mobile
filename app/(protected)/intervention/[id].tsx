import React, { useState } from 'react';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { saveImageForIntervention, getImagesForIntervention, removeImageForIntervention } from '../../../lib/localImages';
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
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { API_BASE } from '../../../lib/config';

export default function InterventionDetail() {
  const params = useLocalSearchParams<{
    id?: string;
    date?: string;
    status?: string;
    description?: string;
    address?: string;
    imageUrl?: string;
    commentaire?: string;
  }>();
  const router = useRouter();

  const item = params && params.id ? {
    id: String(params.id),
    date: params.date ?? '',
    status: params.status ?? '',
    description: params.description ?? '',
    address: params.address ?? '',
    imageUrl: params.imageUrl,
    commentaire: params.commentaire ?? '',
  } : undefined;
  const [comment, setComment] = useState(item?.commentaire ?? '');
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [status, setStatus] = useState<string>(item?.status ?? '');
  const statuses: string[] = ["Terminé", "En cours", "Planifié"];
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pickedUris, setPickedUris] = useState<string[]>([]);
  const [localImageUris, setLocalImageUris] = useState<string[]>([]);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    async function loadLocal() {
      if (!item) return;
      try {
        const uris = await getImagesForIntervention(item.id);
        if (mounted && uris) setLocalImageUris(uris);
      } catch (e) {}
    }
    loadLocal();
    return () => { mounted = false };
  }, [item]);

  React.useEffect(() => {
    if (selectedImageUri) return; 
    const pick = pickedUris.length > 0 ? pickedUris[pickedUris.length - 1] : (localImageUris.length > 0 ? localImageUris[0] : (item?.imageUrl ?? null));
    setSelectedImageUri(pick);
  }, [pickedUris, localImageUris, item]);

  // Sauvegarde: envoie status/commentaire à l'API et copie les images locales
  async function handleSave() {
    if (!item) return;
    setSaving(true);
    try {
      if (pickedUris.length > 0) {
        try {
          for (const p of pickedUris) {
            const saved = await saveImageForIntervention(item.id, p);
            setLocalImageUris((s) => [...s, saved]);
          }
          setPickedUris([]);
        } catch (e) {
          console.warn('Failed to save local image(s)', e);
        }
      }

      const body = {
        status,
        commentaire: comment,
      };
      await axios.put(`${API_BASE}/interventions/${item.id}`, body, {
        headers: { 'Content-Type': 'application/json' },
      });
      Alert.alert('Succès', 'Modification enregistrée', [{ text: 'OK' }]);
      setEditMode(false);
      setIsEditingStatus(false);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Erreur lors de la sauvegarde';
      Alert.alert('Erreur', msg);
    } finally {
      setSaving(false);
    }
  }

  // Ouvre la galerie pour choisir une image (ajoute l'URI à `pickedUris`)
  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Impossible d\'accéder aux photos');
      return;
    }
    const mediaTypesOption = (ImagePicker as any).MediaType ? [(ImagePicker as any).MediaType.Images] : undefined;

    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: mediaTypesOption as any, quality: 0.7, selectionLimit: 0 });
    let uri: string | undefined;
    if (typeof (res as any).canceled === 'boolean') {
      const r = res as any;
      if (!r.canceled && Array.isArray(r.assets) && r.assets.length > 0) uri = r.assets[0].uri;
    } else if (typeof (res as any).cancelled === 'boolean') {
      const r = res as any;
      if (!r.cancelled) uri = r.uri;
    } else if ((res as any).uri) {
      uri = (res as any).uri;
    }
    if (uri) setPickedUris((s) => [...s, uri]);
  }

  // Supprime une image locale associée à cette intervention
  async function handleRemoveImage(uri: string) {
    if (!item) return;
    try {
      await removeImageForIntervention(item.id, uri);
      setLocalImageUris((s) => s.filter((u) => u !== uri));
    } catch (e) {
      console.warn('Failed to remove image', e);
    }
  }

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
        {/* Message affiché si les paramètres sont absents */}
        <Text>Intervention introuvable</Text>
        <Button title="Retour" onPress={() => router.back()} />
      </View>
    );
  }

  const imageUri = selectedImageUri ?? (item?.imageUrl ?? 'https://via.placeholder.com/600x400.png?text=No+Image');

  
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
      {/* En-tête: titre + bouton Modifier */}
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
      {/* Date de l'intervention */}
      <Text style={styles.label}>Date</Text>
      <Text>{new Date(item.date).toLocaleString()}</Text>

      {/* Statut actuel + bouton pour modifier (en mode édition) */}
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

      {/* Sélecteur de statut (affiché si on clique sur Modifier) */}
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

      {/* Description libre */}
      <Text style={styles.label}>Description</Text>
      <Text>{item.description}</Text>

      {/* Adresse / lieu */}
      <Text style={styles.label}>Adresse</Text>
      <Text>{item.address}</Text>

      {/* Image principale (aperçu) */}
      <Text style={styles.label}>Image</Text>
      <Image source={{ uri: imageUri }} style={styles.image} />

      {/* Galerie horizontale: miniatures des images locales et sélectionnées */}
      <ScrollView horizontal style={{ marginTop: 8 }}>
        {(Array.isArray(localImageUris) ? localImageUris : []).map((u) => (
          <View key={u} style={{ marginRight: 8 }}>
              <TouchableOpacity onPress={() => setSelectedImageUri(u)}>
            <Image source={{ uri: u }} style={{ width: 100, height: 70, borderRadius: 6 }} />
              </TouchableOpacity>
            {editMode && (
              <TouchableOpacity onPress={() => handleRemoveImage(u)} style={{ position: 'absolute', top: 2, right: 2, backgroundColor: '#ef4444', borderRadius: 12, width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        {(Array.isArray(pickedUris) ? pickedUris : []).map((u) => (
          <View key={u} style={{ marginRight: 8 }}>
              <TouchableOpacity onPress={() => setSelectedImageUri(u)}>
            <Image source={{ uri: u }} style={{ width: 100, height: 70, borderRadius: 6, opacity: 0.8 }} />
              </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Bouton d'ajout d'image (visible en mode édition) */}
      {editMode && (
        <View style={{ marginTop: 8, marginBottom: 8 }}>
          <TouchableOpacity style={[styles.saveButton]} onPress={pickImage}>
            <Text style={styles.saveButtonText}>{pickedUris.length || localImageUris.length ? "Ajouter" : "Ajouter une image"}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Zone de commentaire (modifiable en mode édition) */}
      <Text style={styles.label}>Commentaire</Text>
      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder={editMode ? "Ajouter un commentaire..." : "Cliquer sur Modifier pour éditer"}
        style={[styles.input, !editMode ? styles.inputDisabled : null]}
        multiline
        editable={editMode}
      />

      {/* Zone de sauvegarde (bouton Enregistrer) */}
      {editMode && (
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

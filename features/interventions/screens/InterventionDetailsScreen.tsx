import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles/InterventionDetailsScreen.styles';
import HeaderDetails from '../components/HeaderDetails';
import { useState } from 'react';
import { Intervention } from '../types/api.types';
import StatusDetails from '../components/StatusDetails';
import EditStatusDetails from '../components/EditStatusDetails';
import SaveButton from '../components/SaveButton';
import { putIntervention } from '../api/intervention.api';
import TextDisplayDetails from '../components/TextDisplayDetails';
import AddImage from '../components/AddImage';
import CarousselImage from '../components/CarousselImage';
import BackButton from '@/components/BackButton';

const InterventionDetailsScreen = () => {
    const [intervention, setIntervention] = useState<Intervention>(JSON.parse(useLocalSearchParams().intervention as string));
    const [editMode, setEditMode] = useState<boolean>(false);
    const [isEditingStatus, setIsEditingStatus] = useState<boolean>(false);
    const [status, setStatus] = useState<string>(intervention.status);
    const [commentaire, setCommentaire] = useState<string>(intervention.commentaire ?? "");
    const [photo, setPhoto] = useState<string>(intervention.photo ?? "");
    const [saving, setSaving] = useState<boolean>(false);
    const [selectedImageUri, setSelectedImageUri] = useState<string>(photo.split("\n")[0]);
    const router = useRouter();

    const reset = () => {
        setStatus(intervention.status);
        setCommentaire(intervention.commentaire ?? "");
        setPhoto(intervention.photo ?? "");
    }

    const handleSave = async () => {
        if (status === intervention.status && commentaire === (intervention.commentaire ?? "") && photo === (intervention.photo ?? "")) {
            setEditMode(false);
            setIsEditingStatus(false);
            return;
        }

        setSaving(true);
        const tempIntervention = { ...intervention };
        tempIntervention.status = status;
        tempIntervention.commentaire = commentaire;
        tempIntervention.photo = photo;

        const response = await putIntervention(tempIntervention, router);
        if (response.success) {
            setIntervention(tempIntervention);
        }

        setSaving(false);
        setEditMode(false);
        setIsEditingStatus(false);
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, width: '80%' }} showsVerticalScrollIndicator={false}>
                    <BackButton />
                    <HeaderDetails
                        editMode={editMode}
                        setEditMode={setEditMode}
                        setIsEditingStatus={setIsEditingStatus}
                        reset={reset}
                    />
                    <TextDisplayDetails label='Titre' data={intervention.titre} />
                    <TextDisplayDetails label='Date' data={new Date(intervention.date_intervention).toLocaleString()} />
                    <StatusDetails editMode={editMode} setIsEditingStatus={setIsEditingStatus} status={status} />
                    {isEditingStatus && <EditStatusDetails setStatus={setStatus} setIsEditingStatus={setIsEditingStatus} />}
                    <TextDisplayDetails label='Description' data={intervention.description ?? ""} />
                    <TextDisplayDetails label='Adresse' data={intervention.adresse ?? ""} />
                    <Text style={styles.label}>Photos</Text>
                    {selectedImageUri !== "" && <Image source={{ uri: selectedImageUri }} style={styles.image} />}
                    <CarousselImage selectedImageUri={selectedImageUri} setPhoto={setPhoto} setSelectedImageUri={setSelectedImageUri} photo={photo} editMode={editMode} />
                    {editMode && <AddImage setPhoto={setPhoto} photo={photo} />}
                    <Text style={styles.label}>Commentaire</Text>
                    <TextInput
                        value={commentaire}
                        onChangeText={setCommentaire}
                        placeholder={editMode ? "Ajouter un commentaire..." : "Appuyer sur 'Modifier' pour ajouter"}
                        style={[styles.input, !editMode ? styles.inputDisabled : null]}
                        multiline
                        editable={editMode}
                    />
                    {editMode && <SaveButton saving={saving} handleSave={handleSave} />}
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default InterventionDetailsScreen;
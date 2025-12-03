import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import axios from 'axios';
import { getAllImageMappings } from '../../lib/localImages';

import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { API_URL } from '@/constants/general.constants';

export type Intervention = {
	id: string;
	date: string;
	status: string;
	description: string;
	address: string;
	imageUrl?: string;
	images?: string[];
	commentaire?: string;
};

// Convertit une date ISO en chaîne lisible pour l'affichage
function formatDate(iso: string) {
	try {
		return new Date(iso).toLocaleString();
	} catch { 
		return iso;
	}
}

// Retourne un style CSS simple selon le statut (pour badge)
function statusStyle(status: string) {
	const s = status.toLowerCase();
	if (s.includes('term')) return styles.statusDone; 
	if (s.includes('cours') || s.includes('progress') || s.includes('in_progress')) return styles.statusInProgress;
	if (s.includes('plan')) return styles.statusPlanned; 
	return styles.statusUnknown;
}

// Mock de l'utilisateur courant (remplacer par l'ID réel depuis l'auth)
const CURRENT_USER_ID = '8';

// Écran principal listant les interventions.
// - Récupère les données depuis l'API
// - Fusionne les images locales (si l'utilisateur en a ajoutées)
// - Permet filtrer, rechercher, et naviguer vers le détail
export default function InterventionList() {
	const router = useRouter();
	const [query, setQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('Tous');

	const [interventionsState, setInterventionsState] = useState<Intervention[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const STATUSES = ['Tous', 'Terminé', 'En cours', 'Planifié'];
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);
	const [showStartPicker, setShowStartPicker] = useState(false);
	const [showEndPicker, setShowEndPicker] = useState(false);

	const filtered = interventionsState.filter((i) => {
		const matchesQuery = query
			? i.description.toLowerCase().includes(query.toLowerCase())
			: true;
		const matchesStatus = statusFilter && statusFilter !== 'Tous'
			? i.status === statusFilter
			: true;

		const itemDate = new Date(i.date);
		const start = startDate
			? new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0)
			: null;
		const end = endDate
			? new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 999)
			: null;
		let matchesDate = true;
		if (start) matchesDate = matchesDate && itemDate >= start;
		if (end) matchesDate = matchesDate && itemDate <= end;

		return matchesQuery && matchesStatus && matchesDate;
	});

	// Charge la liste depuis l'API et merge les mappings d'images locales
	const load = async (showLoading = true) => {
		let mounted = true;
		try {
			if (showLoading) setLoading(true);
			setError(null);
			// Utilise la route spécifique à l'utilisateur
			const res = await axios.get(`${API_URL}/interventions/user/${CURRENT_USER_ID}`);
			const items = res.data && res.data.data ? res.data.data : res.data;
			const mapped: Intervention[] = items.map((it: any) => ({
				id: String(it.id),
				date: it.date_intervention || it.date || it.createdAt || '',
				status: it.status || '',
				description: it.description || '',
				address: it.adresse || it.address || '',
				imageUrl: it.photo || it.imageUrl || undefined,
				images: it.images || (it.photo ? [it.photo] : []) ,
				commentaire: it.commentaire || it.comment || null,
			}));
			try {
				const mappings = await getAllImageMappings();
				const merged = mapped.map((m) => ({ ...m, images: mappings[m.id] ?? m.images ?? (m.imageUrl ? [m.imageUrl] : []) }));
				if (mounted) setInterventionsState(merged);
			} catch (e) {
				if (mounted) setInterventionsState(mapped);
			}
		} catch (err: any) {
			setError(err.message || 'Erreur de connexion');
		} finally {
			if (showLoading) setLoading(false);
		}
	};

	useEffect(() => {
		load();
	}, []);

	// Rafraîchit la liste lorsque l'écran redevient actif (retour depuis l'écran détail)
	const isFocused = useIsFocused();
	useEffect(() => {
		if (isFocused) {
			load(false);
		}
	}, [isFocused]);

	const [refreshing, setRefreshing] = useState(false);
	const onRefresh = async () => {
		setRefreshing(true);
		await load(false);
		setRefreshing(false);
	};

	// Rend une ligne/carte d'intervention cliquable et navigue vers l'écran détail
	const renderItem = ({ item }: { item: Intervention }) => (
		<TouchableOpacity onPress={() => router.push({ pathname: `/intervention/[id]`, params: {
			id: item.id,
			date: item.date,
			status: item.status,
			description: item.description,
			address: item.address,
			imageUrl: item.imageUrl,
			commentaire: item.commentaire ?? '',
		} })}>
			<View style={styles.card}>
				<View style={styles.header}>
					<Text style={styles.date}>{formatDate(item.date)}</Text>
					<Text style={[styles.status, statusStyle(item.status)]}>{item.status}</Text>
				</View>
				<Text style={styles.description}>{item.description}</Text>
				<Text style={styles.address}>{item.address}</Text>
			</View>
		</TouchableOpacity>
	);

	if (loading) {
		return (
			<View style={styles.container}>
				<Text style={styles.pageTitle}>Chargement...</Text>
			</View>
		);
	}
	if (error) {
		return (
			<View style={styles.container}>
				<Text style={[styles.pageTitle, { color: '#ef4444' }]}>{error}</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{/* Titre de la page */}
			<Text style={styles.pageTitle}>Interventions</Text>
			{/* Boutons de filtre par statut */}
			<View style={styles.statusFilterContainer}>
					{STATUSES.map((s) => (
						<TouchableOpacity
							key={s}
							style={[
								styles.statusFilterButton,
								statusFilter === s ? styles.statusFilterButtonActive : null,
							]}
							onPress={() => setStatusFilter(s)}
						>
							<Text style={statusFilter === s ? styles.statusFilterTextActive : styles.statusFilterText}>{s}</Text>
						</TouchableOpacity>
					))}
				</View>

				{/* Sélecteurs de date (début / fin) */}
				<View style={styles.dateRow}>
					<View style={styles.dateButtonWrapper}>
						<TouchableOpacity style={styles.dateButton} onPress={() => setShowStartPicker(true)}>
							<Text style={styles.dateButtonText}>{startDate ? startDate.toISOString().slice(0,10) : 'Début'}</Text>
						</TouchableOpacity>
						{startDate && (
							<TouchableOpacity style={styles.clearSingleDateBtn} onPress={() => setStartDate(null)}>
								<Text style={styles.clearSingleDateText}>×</Text>
							</TouchableOpacity>
						)}
					</View>
					<View style={[styles.dateButtonWrapper, { marginLeft: 8 }]}> 
						<TouchableOpacity style={styles.dateButton} onPress={() => setShowEndPicker(true)}>
							<Text style={styles.dateButtonText}>{endDate ? endDate.toISOString().slice(0,10) : 'Fin'}</Text>
						</TouchableOpacity>
						{endDate && (
							<TouchableOpacity style={styles.clearSingleDateBtn} onPress={() => setEndDate(null)}>
								<Text style={styles.clearSingleDateText}>×</Text>
							</TouchableOpacity>
						)}
					</View>
				</View>

				{/* Sélecteur natif pour la date de début (s'affiche conditionnellement) */}
				{showStartPicker && (
					<DateTimePicker
						value={startDate ?? new Date()}
						mode="date"
						display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
						onChange={(event, selectedDate) => {
							setShowStartPicker(false);
							if (selectedDate) setStartDate(selectedDate);
						}}
					/>
				)}
				{/* Sélecteur natif pour la date de fin (s'affiche conditionnellement) */}
				{showEndPicker && (
					<DateTimePicker
						value={endDate ?? new Date()}
						mode="date"
						display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
						onChange={(event, selectedDate) => {
							setShowEndPicker(false);
							if (selectedDate) setEndDate(selectedDate);
						}}
					/>
				)}


			{/* Champ de recherche par description */}
			<TextInput
					value={query}
					onChangeText={setQuery}
					placeholder="Rechercher par description..."
					style={styles.searchInput}
					clearButtonMode="while-editing"
				/>
			{/* Liste scrollable des interventions */}
			<FlatList
					data={filtered}
					keyExtractor={(i) => i.id}
					renderItem={renderItem}
					ItemSeparatorComponent={() => <View style={styles.separator} />}
					ListEmptyComponent={() => <Text style={styles.empty}>Aucune intervention</Text>}
					refreshing={refreshing}
					onRefresh={onRefresh}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 12,
		marginBottom: 48,
		padding: 12,
		backgroundColor: '#fff',
	},
	card: {
		padding: 12,
		borderRadius: 8,
		backgroundColor: '#f8fafc',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 6,
	},
	date: {
		fontSize: 14,
		color: '#374151',
	},
	status: {
		paddingVertical: 4,
		paddingHorizontal: 8,
		borderRadius: 12,
		fontSize: 12,
		overflow: 'hidden',
		color: '#111827',
	},
	statusDone: {
		backgroundColor: '#10B981',
		color: '#ffffff',
	},
	statusInProgress: {
		backgroundColor: '#ef4444',
		color: '#ffffff',
	},
	statusPlanned: {
		backgroundColor: '#f59e0b',
		color: '#ffffff',
	},
	statusUnknown: {
		backgroundColor: '#e5e7eb',
		color: '#374151',
	},
	description: {
		fontSize: 15,
		color: '#111827',
		marginBottom: 6,
	},
	address: {
		fontSize: 13,
		color: '#6b7280',
	},
	pageTitle: {
		fontSize: 20,
		fontWeight: '700',
		marginTop: 12,
		marginBottom: 10,
		color: '#111827',
	},
	searchInput: {
		borderWidth: 1,
		borderColor: '#e5e7eb',
		paddingHorizontal: 10,
		paddingVertical: 8,
		borderRadius: 8,
		marginBottom: 10,
		backgroundColor: '#fff',
	},
	dateRow: {
		flexDirection: 'row',
		marginBottom: 10,
		alignItems: 'center',
	},
	dateInput: {
		flex: 1,
		paddingVertical: 8,
		paddingHorizontal: 10,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#e5e7eb',
		backgroundColor: '#fff',
	},
	dateButton: {
		flex: 1,
		paddingVertical: 10,
		paddingHorizontal: 12,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#e5e7eb',
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	dateButtonText: {
		color: '#0f172a',
	},
	dateButtonWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	clearSingleDateBtn: {
		marginLeft: 8,
		width: 32,
		height: 32,
		borderRadius: 16,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#ef4444',
	},
	clearSingleDateText: {
		color: '#fff',
		fontWeight: '700',
		lineHeight: 16,
	},
	statusFilterContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginBottom: 10,
	},
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
	},
	separator: {
		height: 10,
	},
	empty: {
		textAlign: 'center',
		color: '#6b7280',
		marginTop: 24,
	},
});

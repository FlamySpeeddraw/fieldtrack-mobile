
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useRouter } from 'expo-router';
import { sampleData, Intervention } from '../../lib/data/interventions';

type Props = {
	interventions?: Intervention[];
};

function formatDate(iso: string) {
	try {
		return new Date(iso).toLocaleString();
	} catch { 
		return iso;
	}
}

function statusStyle(status: string) {
	const s = status.toLowerCase();
	if (s.includes('term')) return styles.statusDone; // Terminé -> green
	if (s.includes('cours') || s.includes('progress') || s.includes('in_progress')) return styles.statusInProgress; // En cours -> red
	if (s.includes('plan')) return styles.statusPlanned; // Planifié -> orange
	return styles.statusUnknown;
}

export default function InterventionList({ interventions = sampleData }: Props) {
	const router = useRouter();
	const [query, setQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('Tous');

	const STATUSES = ['Tous', 'Terminé', 'En cours', 'Planifié'];
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);
	const [showStartPicker, setShowStartPicker] = useState(false);
	const [showEndPicker, setShowEndPicker] = useState(false);

	const filtered = interventions.filter((i) => {
		const matchesQuery = query
			? i.description.toLowerCase().includes(query.toLowerCase())
			: true;
		const matchesStatus = statusFilter && statusFilter !== 'Tous'
			? i.status === statusFilter
			: true;

		// date filtering: parse YYYY-MM-DD or ISO-like strings
		const itemDate = new Date(i.date);
		// normalize start to 00:00 and end to 23:59:59 for inclusive day filtering
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

	const renderItem = ({ item }: { item: Intervention }) => (
		<TouchableOpacity onPress={() => router.push(`/intervention/${item.id}`)}>
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

	return (
		<View style={styles.container}>
				
				<Text style={styles.pageTitle}>Interventions</Text>
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



				<TextInput
					value={query}
					onChangeText={setQuery}
					placeholder="Rechercher par description..."
					style={styles.searchInput}
					clearButtonMode="while-editing"
				/>
				<FlatList
				data={filtered}
				keyExtractor={(i) => i.id}
				renderItem={renderItem}
				ItemSeparatorComponent={() => <View style={styles.separator} />}
				ListEmptyComponent={() => <Text style={styles.empty}>Aucune intervention</Text>}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 12,
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

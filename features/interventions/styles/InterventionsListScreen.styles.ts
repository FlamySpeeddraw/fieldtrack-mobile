import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1
    },
    pageTitle: {
        fontSize: 20,
        fontWeight: '700'
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#fff',
        width: '80%'
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
    separator: {
        height: 10,
    },
    empty: {
        textAlign: 'center',
        color: '#6b7280',
        marginTop: 24,
    }
});
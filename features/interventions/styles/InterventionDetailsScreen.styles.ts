import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        marginTop: 10,
        fontWeight: '500',
    },
    inputDisabled: {
        backgroundColor: '#f2f2f2',
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
    image: {
        aspectRatio: 1/1,
        borderRadius: 15,
        height: 200,
        marginTop: 8,
        marginBottom: 12
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        borderRadius: 6,
        minHeight: 80,
        textAlignVertical: 'top',
        marginBottom: 48,
    },
    commentItem: {
        backgroundColor: '#f3f4f6',
        padding: 8,
        borderRadius: 6,
        marginTop: 6,
    },
});
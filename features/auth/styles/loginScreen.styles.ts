import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1
    },
    loginIcon: {
        backgroundColor: "#2563EB",
        aspectRatio: 1 / 1,
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginTop: 15
    },
    title: {
        fontSize: 35,
        fontWeight: 800,
        textAlign: 'center',
        marginTop: 15
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        letterSpacing: -0.4,
        color: '#8d8d8dff'
    },
    formContainer: {
        width: '80%',
        flex: 1
    },
    error: {
        color: 'red',
        fontWeight: 600,
        alignSelf: 'center',
        marginTop: 30,
        fontStyle: 'italic'
    },
    button: {
        backgroundColor: "#2563EB",
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        marginTop: 30
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 18,
        fontWeight: 500
    }
});
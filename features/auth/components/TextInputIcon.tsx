import { ReactElement } from 'react';
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from 'react-native';

interface props {
    value: string;
    onChangeText: (value: string) => void;
    label: string;
    placeholder: string;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    keyboardType?: KeyboardTypeOptions;
    secureTextEntry?: boolean;
    icon: ReactElement;
}

const TextInputIcon = ({ value, onChangeText, label, placeholder, autoCapitalize, keyboardType, secureTextEntry, icon }: props) => {
    return (
        <View>
            <Text style={styles.topTextInput}>{label}</Text>
            <View style={styles.inputContainer}>
                {icon}
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    autoCapitalize={autoCapitalize}
                    keyboardType={keyboardType}
                    placeholderTextColor={'#8d8d8dff'}
                    style={styles.input}
                    secureTextEntry={secureTextEntry}
                />
            </View>
        </View>
    );
};

export default TextInputIcon;

const styles = StyleSheet.create({
    topTextInput: {
        marginTop: 30,
        alignSelf: 'flex-start',
        color: '#8d8d8dff'
    },
    inputContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 6,
        marginTop: 8,
        borderColor: '#8d8d8dff',
        padding: 5,
        alignItems: 'center'
    },
    input: {
        flex: 1
    }
});
import { StyleSheet, Text } from 'react-native';
import { styles } from '../styles/InterventionDetailsScreen.styles';

interface props {
    label: string;
    data: string;
}

const TextDisplayDetails = ({ label, data }: props) => {
    return (
        <>
            <Text style={styles.label}>{label}</Text>
            <Text>{data}</Text>
        </>
    );
};

export default TextDisplayDetails;
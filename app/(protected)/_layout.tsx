import { Stack } from 'expo-router';

const ProtectedLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='interventionList' />
            <Stack.Screen name='interventionDetails' />
        </Stack>
  );
};

export default ProtectedLayout;
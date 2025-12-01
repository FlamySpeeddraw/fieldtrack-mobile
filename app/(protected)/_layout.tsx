import { Stack } from 'expo-router';

const ProtectedLayout = () => {
    return (
        <Stack>
            <Stack.Screen name='interventionList' options={{ headerShown: false }} />
        </Stack>
  );
};

export default ProtectedLayout;
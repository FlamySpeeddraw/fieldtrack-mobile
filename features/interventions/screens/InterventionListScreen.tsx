import { useEffect, useState } from "react";
import { getListInterventions } from "../api/intervention.api";
import { useRouter } from "expo-router";
import { Intervention } from "../types/api.types";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles/InterventionsListScreen.styles";
import { FlatList, Text, TextInput, View } from "react-native";
import * as SecureStore from 'expo-secure-store';
import InterventionCard from "../components/InterventionCard";
import StatusButton from "../components/StatusButton";
import Fuse from "fuse.js";
import { STATUS } from "../constants/intervention.constants";

const InterventionListScreen = () => {
    const router = useRouter();

    const [interventions, setInterventions] = useState<Intervention[]>([]);
    const [filteredInterventions, setFilteredInterventions] = useState<Intervention[]>([]);
    const [query, setQuery] = useState<string>("");
    const [isLoading, setIsloading] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>("tous");

    useEffect(() => {
        let interventionCopy = [...interventions];
        if (filter !== "tous") {
            interventionCopy = interventionCopy.filter((entry) => entry.status === filter);
        }

        if (query) {
            const fuse = new Fuse(interventionCopy, { keys: ['status', 'titre', 'adresse'] });
            const fuseResult = fuse.search(query);
            interventionCopy = fuseResult.map((entry) => entry.item);
        }

        setFilteredInterventions(interventionCopy);
    }, [interventions, filter, query]);

    useEffect(() => {
        const fetchIntervention = async () => {
            const userId = SecureStore.getItem("userId");
            if (!userId) {
                alert("Une erreur est survenue");
                return router.replace("/");
            }

            const res = await getListInterventions(userId, router);

            if (res.success) {
                setInterventions(res.data ?? []);
            }
        }

        fetchIntervention();
    }, []);

    const onRefresh = async () => {
        setIsloading(true);
        const userId = SecureStore.getItem("userId");
        if (!userId) {
            alert("Une erreur est survenue");
            return router.replace("/");
        }

        const res = await getListInterventions(userId, router);

        if (res.success) {
            setInterventions(res.data ?? []);
        }
        setIsloading(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.pageTitle}>Interventions</Text>
            <View style={styles.statusFilterContainer}>
                {STATUS.map((s) => (
                    <StatusButton key={s} active={s.normalize("NFD").replaceAll(/\p{Diacritic}/gu, "").toLowerCase() === filter} status={s} setFilter={setFilter} />
                ))}
            </View>
            <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Rechercher..."
                style={styles.searchInput}
                clearButtonMode="while-editing"
            />
            <FlatList
                data={filteredInterventions}
                renderItem={({ item }) => <InterventionCard intervention={item} router={router} />}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListEmptyComponent={() => <Text style={styles.empty}>Aucune intervention</Text>}
                refreshing={isLoading}
                onRefresh={onRefresh}
                style={{ width: '80%' }}
            />
        </SafeAreaView>
    );
};

export default InterventionListScreen;
import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Clé de stockage pour AsyncStorage
const STORAGE_KEY = 'LOCAL_INTERVENTION_IMAGES_V1';

// Mapping stocké: id d'intervention -> tableau d'URI locales des images
type Mapping = { [id: string]: string[] };

/*
  Ce module gère les images attachées localement aux interventions.
  - Les images sont copiées dans le répertoire privé de l'application
    (`FileSystem.documentDirectory + 'images/'`) et leur chemin local est
    enregistré dans AsyncStorage sous forme d'un mapping id -> [uris].
  - L'API distante n'est pas utilisée pour stocker les images, elles restent
    uniquement sur l'appareil.
  - Fonctions exposées:
    - getAllImageMappings(): récupère tout le mapping (objet)
    - getImagesForIntervention(id): récupère le tableau d'images pour une intervention
    - saveImageForIntervention(id, uri): copie une image locale dans le dossier app
      et ajoute son chemin au mapping (retourne le chemin local copié)
    - removeImageForIntervention(id, uri): supprime une image locale et l'entrée du mapping
    - removeAllImagesForIntervention(id): supprime toutes les images liées à une intervention
*/

export async function getAllImageMappings(): Promise<Mapping> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Mapping;
  } catch (e) {
    console.warn('Failed to read image mappings', e);
    return {};
  }
}

// Retourne un tableau d'URIs (peut être vide) pour l'id donné
export async function getImagesForIntervention(id: string): Promise<string[]> {
  const map = await getAllImageMappings();
  return map[id] ?? [];
}

// Écrit le mapping complet en AsyncStorage
async function saveMappings(map: Mapping) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

/*
  Copie le fichier source `uri` dans le dossier interne de l'app et
  ajoute le chemin copié au tableau d'images pour `id`.
  Retourne le chemin local (dest) créé.
*/
export async function saveImageForIntervention(id: string, uri: string): Promise<string> {
  try {
    const imagesDir = `${FileSystem.documentDirectory}images/`;
    const dirInfo = await FileSystem.getInfoAsync(imagesDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(imagesDir, { intermediates: true });
    }

    const ext = uri.split('.').pop()?.split('?')[0] || 'jpg';
    const dest = `${imagesDir}${id}_${Date.now()}.${ext}`;
    await FileSystem.copyAsync({ from: uri, to: dest });

    const map = await getAllImageMappings();
    // Défensive: s'assurer que la valeur existante est bien un tableau.
    let arr: string[] | undefined = map[id] as any;
    if (!Array.isArray(arr)) {
      if (arr && typeof arr === 'string') {
        // cas ancien où on stockait une seule URI comme string -> convertir
        arr = [arr];
      } else {
        arr = [];
      }
    }
    arr.push(dest);
    map[id] = arr;
    await saveMappings(map);
    return dest;
  } catch (e) {
    console.error('Failed to save image for intervention', e);
    throw e;
  }
}

/*
  Supprime une image spécifique du mapping et du fichier stocké.
  Si le tableau devient vide, la clé est retirée du mapping.
*/
export async function removeImageForIntervention(id: string, uri: string): Promise<void> {
  const map = await getAllImageMappings();
  let arr: string[] | undefined = map[id] as any;
  if (!Array.isArray(arr)) {
    if (arr && typeof arr === 'string') arr = [arr]; else arr = [];
  }
  const idx = arr.indexOf(uri);
  if (idx !== -1) {
    try { await FileSystem.deleteAsync(arr[idx], { idempotent: true }); } catch {}
    arr.splice(idx, 1);
    if (arr.length === 0) delete map[id]; else map[id] = arr;
    await saveMappings(map);
  }
}

// Supprime toutes les images liées à une intervention (fichiers + mapping)
export async function removeAllImagesForIntervention(id: string): Promise<void> {
  const map = await getAllImageMappings();
  let arr: string[] | undefined = map[id] as any;
  if (!Array.isArray(arr)) {
    if (arr && typeof arr === 'string') arr = [arr]; else arr = [];
  }
  for (const u of arr) {
    try { await FileSystem.deleteAsync(u, { idempotent: true }); } catch {}
  }
  delete map[id];
  await saveMappings(map);
}

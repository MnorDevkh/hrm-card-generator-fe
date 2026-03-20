import { ref, onMounted } from 'vue';
import { getCatalogOptions } from '../service/catalog.service.js';

/**
 * Loads catalog rows for Ant Design Select ({ value, label }).
 * @param {string[]} categories - keys: faculty | department | study_shift
 */
export function useCatalogSelectOptions(categories) {
  const optionsByCategory = ref({});
  const loading = ref(false);

  async function load() {
    loading.value = true;
    try {
      const data = await getCatalogOptions(categories);
      optionsByCategory.value = data && typeof data === 'object' ? data : {};
    } catch {
      optionsByCategory.value = {};
    } finally {
      loading.value = false;
    }
  }

  onMounted(load);

  return { optionsByCategory, loading, reload: load };
}

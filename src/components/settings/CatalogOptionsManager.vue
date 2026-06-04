<template>
  <ConfigProvider :theme="{ token: { fontFamily: 'inherit' } }">
    <div class="p-4 sm:p-6 lg:p-8 space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 class="text-xl font-bold text-gray-900">{{ t('settings.title') }}</h1>
        <div class="flex flex-wrap gap-2">
          <Button @click="runSeed" :loading="seeding">{{ t('settings.seedDefaults') }}</Button>
          <Button type="primary" @click="openCreate">
            <template #icon>
              <PlusOutlined />
            </template>
            {{ t('settings.addOption') }}
          </Button>
        </div>
      </div>
      <p class="text-sm text-gray-500">
        {{ t('settings.description') }}
      </p>

      <Tabs v-model:activeKey="activeCategory" @change="onTabChange">
        <Tabs.TabPane v-for="s in catalogTabs" :key="s.key" :tab="s.title" />
      </Tabs>

      <Card :bordered="false" class="shadow-sm">
        <Table :columns="columns" :data-source="items" :loading="loading" row-key="id" :pagination="false">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'actions'">
              <Space>
                <Button type="link" size="small" @click="openEdit(record)">{{ t('common.edit') }}</Button>
                <Button type="link" danger size="small" @click="confirmDelete(record)">{{ t('common.delete') }}</Button>
              </Space>
            </template>
          </template>
        </Table>
      </Card>

      <Modal
        v-model:open="modalOpen"
        :title="editingId ? t('settings.editOption') : t('settings.newOption')"
        :confirm-loading="saving"
        :ok-text="t('common.save')"
        @ok="save"
        destroy-on-close
      >
        <Form layout="vertical" class="mt-2">
          <FormItem :label="t('settings.valueLabel')" required>
            <Input v-model:value="form.value" :placeholder="t('settings.valuePlaceholder')" />
          </FormItem>
          <FormItem :label="t('settings.displayLabel')" required>
            <Input v-model:value="form.label" />
          </FormItem>
          <FormItem :label="t('settings.sortOrder')">
            <InputNumber v-model:value="form.sort_order" class="w-full" :min="0" />
          </FormItem>
        </Form>
      </Modal>
    </div>
  </ConfigProvider>
</template>

<script setup>
import { ref, computed, onMounted, createVNode } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  ConfigProvider,
  Tabs,
  Table,
  Button,
  Card,
  Modal,
  Form,
  FormItem,
  Input,
  InputNumber,
  Space,
  message as antMessage,
} from 'ant-design-vue';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { CATALOG_SECTIONS, CATALOG_FACULTY } from '@/constants/catalogCategories';
import {
  listCatalogItems,
  createCatalogItem,
  updateCatalogItem,
  deleteCatalogItem,
  seedCatalogDefaults,
} from '@/service/catalog.service';

const { t } = useI18n();

const TAB_I18N_KEYS = {
  faculty: 'settings.tabs.faculty',
  department: 'settings.tabs.department',
  study_shift: 'settings.tabs.studyShift',
};

const catalogTabs = computed(() =>
  CATALOG_SECTIONS.map((s) => ({
    key: s.key,
    title: t(TAB_I18N_KEYS[s.key]),
  }))
);

const activeCategory = ref(CATALOG_FACULTY);
const items = ref([]);
const loading = ref(false);
const seeding = ref(false);
const modalOpen = ref(false);
const saving = ref(false);
const editingId = ref(null);

const form = ref({
  value: '',
  label: '',
  sort_order: 0,
});

const columns = computed(() => [
  { title: t('settings.columns.value'), dataIndex: 'value', key: 'value' },
  { title: t('settings.columns.label'), dataIndex: 'label', key: 'label' },
  { title: t('settings.columns.sort'), dataIndex: 'sort_order', key: 'sort_order', width: 90 },
  { title: t('common.actions'), key: 'actions', width: 160 },
]);

async function loadItems() {
  loading.value = true;
  try {
    items.value = await listCatalogItems(activeCategory.value);
  } catch {
    antMessage.error(t('settings.loadFailed'));
    items.value = [];
  } finally {
    loading.value = false;
  }
}

function onTabChange() {
  loadItems();
}

function openCreate() {
  editingId.value = null;
  form.value = { value: '', label: '', sort_order: 0 };
  modalOpen.value = true;
}

function openEdit(row) {
  editingId.value = row.id;
  form.value = {
    value: row.value,
    label: row.label,
    sort_order: row.sort_order ?? 0,
  };
  modalOpen.value = true;
}

async function save() {
  const v = (form.value.value || '').trim();
  const l = (form.value.label || '').trim();
  if (!v || !l) {
    antMessage.warning(t('settings.required'));
    return;
  }
  saving.value = true;
  try {
    if (editingId.value) {
      await updateCatalogItem(editingId.value, {
        value: v,
        label: l,
        sort_order: form.value.sort_order ?? 0,
      });
      antMessage.success(t('settings.updated'));
    } else {
      await createCatalogItem({
        category: activeCategory.value,
        value: v,
        label: l,
        sort_order: form.value.sort_order ?? 0,
      });
      antMessage.success(t('settings.created'));
    }
    modalOpen.value = false;
    await loadItems();
  } catch {
    antMessage.error(t('settings.saveFailed'));
  } finally {
    saving.value = false;
  }
}

function confirmDelete(row) {
  Modal.confirm({
    title: t('settings.deleteConfirm', { label: row.label }),
    icon: createVNode(ExclamationCircleOutlined),
    okType: 'danger',
    async onOk() {
      try {
        await deleteCatalogItem(row.id);
        antMessage.success(t('settings.deleted'));
        await loadItems();
      } catch {
        antMessage.error(t('settings.deleteFailed'));
      }
    },
  });
}

async function runSeed() {
  seeding.value = true;
  try {
    const res = await seedCatalogDefaults();
    const counts = res?.inserted_per_category || {};
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    antMessage.success(
      total
        ? t('settings.seedInserted', { counts: JSON.stringify(counts) })
        : t('settings.seedHasData')
    );
    await loadItems();
  } catch {
    antMessage.error(t('settings.seedFailed'));
  } finally {
    seeding.value = false;
  }
}

onMounted(loadItems);
</script>

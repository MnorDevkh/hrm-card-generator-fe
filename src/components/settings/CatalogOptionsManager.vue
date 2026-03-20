<template>
  <ConfigProvider :theme="{ token: { fontFamily: 'inherit' } }">
    <div class="p-4 sm:p-6 lg:p-8 space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 class="text-xl font-bold text-gray-900">List filter catalog</h1>
        <div class="flex flex-wrap gap-2">
          <Button @click="runSeed" :loading="seeding">Seed defaults</Button>
          <Button type="primary" @click="openCreate">
            <template #icon>
              <PlusOutlined />
            </template>
            Add option
          </Button>
        </div>
      </div>
      <p class="text-sm text-gray-500">
        Values must match what is stored on records (used by list API filters). Labels are shown in dropdowns.
      </p>

      <Tabs v-model:activeKey="activeCategory" @change="onTabChange">
        <Tabs.TabPane v-for="s in CATALOG_SECTIONS" :key="s.key" :tab="s.title" />
      </Tabs>

      <Card :bordered="false" class="shadow-sm">
        <Table :columns="columns" :data-source="items" :loading="loading" row-key="id" :pagination="false">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'actions'">
              <Space>
                <Button type="link" size="small" @click="openEdit(record)">Edit</Button>
                <Button type="link" danger size="small" @click="confirmDelete(record)">Delete</Button>
              </Space>
            </template>
          </template>
        </Table>
      </Card>

      <Modal
        v-model:open="modalOpen"
        :title="editingId ? 'Edit option' : 'New option'"
        :confirm-loading="saving"
        ok-text="Save"
        @ok="save"
        destroy-on-close
      >
        <Form layout="vertical" class="mt-2">
          <FormItem label="Value (stored / filter key)" required>
            <Input v-model:value="form.value" placeholder="e.g. faculty code" />
          </FormItem>
          <FormItem label="Label (display)" required>
            <Input v-model:value="form.label" />
          </FormItem>
          <FormItem label="Sort order">
            <InputNumber v-model:value="form.sort_order" class="w-full" :min="0" />
          </FormItem>
        </Form>
      </Modal>
    </div>
  </ConfigProvider>
</template>

<script setup>
import { ref, onMounted, createVNode } from 'vue';
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

const columns = [
  { title: 'Value', dataIndex: 'value', key: 'value' },
  { title: 'Label', dataIndex: 'label', key: 'label' },
  { title: 'Sort', dataIndex: 'sort_order', key: 'sort_order', width: 90 },
  { title: 'Actions', key: 'actions', width: 160 },
];

async function loadItems() {
  loading.value = true;
  try {
    items.value = await listCatalogItems(activeCategory.value);
  } catch {
    antMessage.error('Failed to load catalog items');
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
    antMessage.warning('Value and label are required');
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
      antMessage.success('Updated');
    } else {
      await createCatalogItem({
        category: activeCategory.value,
        value: v,
        label: l,
        sort_order: form.value.sort_order ?? 0,
      });
      antMessage.success('Created');
    }
    modalOpen.value = false;
    await loadItems();
  } catch {
    antMessage.error('Save failed');
  } finally {
    saving.value = false;
  }
}

function confirmDelete(row) {
  Modal.confirm({
    title: `Delete "${row.label}"?`,
    icon: createVNode(ExclamationCircleOutlined),
    okType: 'danger',
    async onOk() {
      try {
        await deleteCatalogItem(row.id);
        antMessage.success('Deleted');
        await loadItems();
      } catch {
        antMessage.error('Delete failed');
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
    antMessage.success(total ? `Inserted defaults where empty: ${JSON.stringify(counts)}` : 'Categories already had data');
    await loadItems();
  } catch {
    antMessage.error('Seed failed (admin only)');
  } finally {
    seeding.value = false;
  }
}

onMounted(loadItems);
</script>

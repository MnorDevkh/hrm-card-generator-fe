<template>
  <ConfigProvider :theme="{ token: { fontFamily: 'inherit' } }">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <label>{{ t('receipt.serial') }}</label>
        <Input
          v-model:value="form.serial_no"
          readonly
          disabled
          :placeholder="t('receipt.serialAutoHint')"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('receipt.khmerName') }}</label>
        <Input v-model:value="form.name_khmer" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('receipt.latinName') }}</label>
        <Input v-model:value="form.name_latin" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('receipt.fields.gender') }}</label>
        <Select v-model:value="form.gender" allow-clear class="w-full" :placeholder="t('common.selectGender')">
          <SelectOption value="Male">{{ t('common.male') }}</SelectOption>
          <SelectOption value="Female">{{ t('common.female') }}</SelectOption>
        </Select>
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('receipt.fields.birthDate') }}</label>
        <DatePicker
          v-model:value="form.birth_date"
          value-format="YYYY-MM-DD"
          format="DD-MM-YYYY"
          :placeholder="t('receipt.fields.birthDatePlaceholder')"
          class="w-full"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('receipt.phone') }}</label>
        <Input v-model:value="form.phone" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('receipt.fields.faculty') }}</label>
        <Input v-model:value="form.faculty" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('receipt.fields.batch') }}</label>
        <Input v-model:value="form.batch" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('receipt.fields.degreeLevel') }}</label>
        <Input v-model:value="form.degree_level" />
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t('receipt.amount') }}</label>
        <Input v-model:value="form.amount" />
      </div>
      <div class="flex flex-col gap-2 md:col-span-2">
        <label>{{ t('receipt.purpose') }}</label>
        <Input v-model:value="form.purpose" />
      </div>
      <div class="flex flex-col gap-2 md:col-span-2">
        <label>{{ t('receipt.fields.additionalNote') }}</label>
        <Textarea v-model:value="form.additional_note" :rows="3" />
      </div>
    </div>

    <div class="flex justify-end gap-2 mt-6 pt-4 border-t">
      <Button @click="$emit('cancel')">
        <template #icon><CloseOutlined /></template>
        {{ t('common.cancel') }}
      </Button>
      <Button type="primary" @click="save">
        <template #icon><CheckOutlined /></template>
        {{ t('common.save') }}
      </Button>
    </div>
  </ConfigProvider>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Input, Textarea, Select, SelectOption, DatePicker, Button, ConfigProvider } from 'ant-design-vue';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons-vue';
import { getNextReceiptSerial } from '@/service/receipt.service';
import { normalizeSerial } from './receiptSerial';

const { t } = useI18n();

const props = defineProps({
  row: {
    type: Object,
    default: () => ({}),
  },
  usedSerials: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['save', 'cancel']);

const emptyForm = () => ({
  id: null,
  serial_no: '',
  name_khmer: '',
  name_latin: '',
  gender: '',
  birth_date: null,
  phone: '',
  faculty: '',
  batch: '',
  degree_level: '',
  amount: '',
  purpose: '',
  additional_note: '',
});

const form = ref(emptyForm());

function normalizeDateToYMD(value) {
  if (!value || typeof value !== 'string') return value || null;
  const s = value.trim().split(' ')[0].replace(/\//g, '-');
  const m = s.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (m) {
    const dd = m[1].padStart(2, '0');
    const mm = m[2].padStart(2, '0');
    return `${m[3]}-${mm}-${dd}`;
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  return value;
}

async function loadNextSerial() {
  const isAdd = !props.row?.id;
  if (!isAdd) return;

  try {
    const res = await getNextReceiptSerial({ reservedSerials: props.usedSerials });
    form.value.serial_no = res?.serial_no || '';
  } catch {
    form.value.serial_no = '';
  }
}

async function initForm() {
  form.value = {
    ...emptyForm(),
    ...JSON.parse(JSON.stringify(props.row || {})),
  };
  form.value.birth_date = normalizeDateToYMD(form.value.birth_date);
  await loadNextSerial();
}

watch(() => props.row, initForm, { deep: true });
watch(() => props.usedSerials, loadNextSerial, { deep: true });

onMounted(() => {
  initForm();
});

function save() {
  const isAdd = !props.row?.id;
  emit('save', {
    ...form.value,
    serial_no: isAdd ? '' : normalizeSerial(form.value.serial_no),
    birth_date: form.value.birth_date || '',
  });
}
</script>

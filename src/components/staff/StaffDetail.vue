<template>
  <div class="space-y-6">
    <!-- Header with Photo -->
    <div class="flex flex-col md:flex-row gap-6 items-start">
      <div class="w-32 h-32 md:w-48 md:h-48 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
        <img v-if="staff.identity?.photo" :src="getPhotoUrl(staff.identity.photo)" alt="Profile" class="w-full h-full object-cover" />
        <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
          <i class="pi pi-user text-6xl"></i>
        </div>
      </div>
      
      <div class="flex-grow">
        <h1 class="text-2xl font-bold text-gray-900">{{ staff.identity?.en_name }} / {{ staff.identity?.kh_name }}</h1>
        <p class="text-gray-500">{{ staff.employment?.position }} - {{ staff.employment?.department }}</p>
        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div><span class="font-semibold text-gray-600">Employee ID:</span> {{ staff.identity?.employee_id }}</div>
          <div><span class="font-semibold text-gray-600">Gender:</span> {{ staff.identity?.gender }}</div>
          <div><span class="font-semibold text-gray-600">DOB:</span> {{ staff.identity?.date_of_birth }}</div>
          <div><span class="font-semibold text-gray-600">Phone:</span> {{ staff.contact?.phone }}</div>
           <div><span class="font-semibold text-gray-600">Email:</span> {{ staff.contact?.email }}</div>
          <div><span class="font-semibold text-gray-600">Status:</span> 
            <span :class="{
              'text-green-600': staff.employment?.status === 'Active',
              'text-red-600': staff.employment?.status === 'Resigned',
              'text-yellow-600': staff.employment?.status === 'Leave'
            }">{{ staff.employment?.status }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Sections -->
    <div class="grid grid-cols-1 gap-6">
      
      <!-- Identity & Contact -->
      <div class="border rounded-lg p-4 bg-gray-50">
        <h3 class="font-bold text-lg mb-3 border-b pb-2">Identity & Contact</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span class="font-semibold">Nationality:</span> {{ staff.identity?.nationality }}</div>
          <div><span class="font-semibold">Marital Status:</span> {{ staff.identity?.marital_status }}</div>
          <div><span class="font-semibold">Address:</span> {{ staff.contact?.address }}</div>
          <div><span class="font-semibold">Emergency Contact:</span> {{ staff.contact?.emergency_contact }}</div>
        </div>
      </div>

       <!-- Employment -->
      <div class="border rounded-lg p-4 bg-gray-50">
        <h3 class="font-bold text-lg mb-3 border-b pb-2">Employment</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span class="font-semibold">Type:</span> {{ staff.employment?.employee_type }}</div>
          <div><span class="font-semibold">Employment Type:</span> {{ staff.employment?.employment_type }}</div>
          <div><span class="font-semibold">Date of Hire:</span> {{ staff.employment?.date_of_hire }}</div>
          <div><span class="font-semibold">Work Shift:</span> {{ staff.employment?.work_shift }}</div>
          <div><span class="font-semibold">Supervisor:</span> {{ staff.employment?.supervisor }}</div>
          <div><span class="font-semibold">Subject:</span> {{ staff.employment?.subject }}</div>
        </div>
      </div>

       <!-- Salary (Likely sensitive, maybe hide? showing for now) -->
      <div class="border rounded-lg p-4 bg-gray-50">
        <h3 class="font-bold text-lg mb-3 border-b pb-2">Salary & Legal</h3>
         <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span class="font-semibold">Basic Salary:</span> {{ staff.salary?.basic_salary }}</div>
          <div><span class="font-semibold">Allowance:</span> {{ staff.salary?.allowance }}</div>
           <div><span class="font-semibold">Payment Method:</span> {{ staff.salary?.payment_method }}</div>
          <div><span class="font-semibold">Bank Account:</span> {{ staff.salary?.bank_account }}</div>
          <div><span class="font-semibold">ID Card:</span> {{ staff.legal?.id_card }}</div>
          <div><span class="font-semibold">Contract No:</span> {{ staff.legal?.contract_no }}</div>
          <div><span class="font-semibold">Contract Date:</span> {{ staff.legal?.contract_start }} - {{ staff.legal?.contract_end }}</div>
        </div>
      </div>

      <!-- Education & Skills -->
      <div class="border rounded-lg p-4 bg-gray-50">
        <h3 class="font-bold text-lg mb-3 border-b pb-2">Education & Skills</h3>
         <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span class="font-semibold">Level:</span> {{ staff.education?.education_level }}</div>
          <div><span class="font-semibold">Major:</span> {{ staff.education?.major }}</div>
          <div class="col-span-1 md:col-span-2"><span class="font-semibold">Experience:</span> {{ staff.education?.teaching_experience }}</div>
           <div class="col-span-1 md:col-span-2"><span class="font-semibold">Skills:</span> {{ staff.education?.skills }}</div>
            <div class="col-span-1 md:col-span-2"><span class="font-semibold">Training:</span> {{ staff.education?.training }}</div>
        </div>
      </div>

       <!-- HR -->
      <div class="border rounded-lg p-4 bg-gray-50">
        <h3 class="font-bold text-lg mb-3 border-b pb-2">HR Management</h3>
         <div class="grid grid-cols-1 gap-4 text-sm">
          <div><span class="font-semibold">Performance:</span> {{ staff.hr?.performance }}</div>
          <div><span class="font-semibold">Note:</span> {{ staff.hr?.note }}</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { environment } from '../../environments/environment';

const props = defineProps({
  staff: {
    type: Object,
    required: true
  }
});

const getPhotoUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${environment.apiBaseUrl}media/image/${path}`;
};
</script>

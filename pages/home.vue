<script setup lang="ts">
import type { SessionUser } from '~/types/auth'

useSeoMeta({
  title: 'Logistics Operations Hub'
})

// Fetch current session from /api/session
const { data, error } = await useFetch<{ user: SessionUser }>('/api/session', {
  key: 'session-home'
})

// Redirect to login if unauthenticated or session invalid
if (error.value || !data.value) {
  await navigateTo('/login', { external: true })
}

const user = computed(() => data.value?.user)
const isAdmin = computed(() => user.value?.role === 'admin')
const loggingOut = ref(false)

async function logout() {
  loggingOut.value = true
  try {
    await $fetch('/api/logout', { method: 'POST' })
  } finally {
    await navigateTo('/login', { external: true })
  }
}

// ─────────────────────────────────────────────
// ADMIN DATA & METRICS
// ─────────────────────────────────────────────
const adminKpiCards = [
  {
    title: 'Fleet in Transit',
    value: '38 Units',
    subtitle: '6 scheduled for afternoon intake',
    trend: '+4 vs yesterday',
    icon: 'i-heroicons-truck'
  },
  {
    title: 'Warehouse Capacity',
    value: '74%',
    subtitle: 'Central Hub & Distribution Center 1',
    trend: 'Optimal threshold',
    icon: 'i-heroicons-building-office-2'
  },
  {
    title: 'Active Dispatches',
    value: '19 Dispatches',
    subtitle: 'All manifests verified and on schedule',
    trend: 'Normal flow',
    icon: 'i-heroicons-clipboard-document-check'
  }
]

const recentAuditLogs = [
  {
    id: 'LOG-7401',
    event: 'Manifest MNF-4029 generated for Distribution Center 1',
    actor: 'Automated Dispatch Service',
    time: '12m ago',
    level: 'info',
    badge: 'Dispatch'
  },
  {
    id: 'LOG-7400',
    event: 'Unit TRX-104 pre-trip safety checklist verified by Gate Scanner',
    actor: 'Security Terminal 1',
    time: '28m ago',
    level: 'success',
    badge: 'Safety'
  },
  {
    id: 'LOG-7399',
    event: 'Bay 04 telemetry calibrated and intake cleared',
    actor: 'Central Staging Controller',
    time: '45m ago',
    level: 'info',
    badge: 'Telemetry'
  },
  {
    id: 'LOG-7398',
    event: 'Corridor Alpha transit clearance issued for Seaport Terminal convoy',
    actor: 'Route Operations Desk',
    time: '1h ago',
    level: 'success',
    badge: 'Clearance'
  }
]

// ─────────────────────────────────────────────
// EMPLOYEE DATA & WORKFLOW
// ─────────────────────────────────────────────
const staffShift = {
  shiftCode: 'Shift A',
  hub: 'Central Staging Hub',
  schedule: '07:00 – 15:30',
  assignedUnit: 'TRX-104 (Heavy Transport)',
  stagingBay: 'Bay 04 · Ready for Departure',
  supervisor: 'Operations Desk 1'
}

const assignedRoute = {
  runId: 'Run #402',
  title: 'Central Warehouse → Seaport Terminal',
  origin: 'Central Warehouse (Staging Bay 04)',
  destination: 'Seaport Terminal (Container Pier Gate 2)',
  cargo: '24x High-Cube Pallet Units (Sealed)',
  departureTime: '08:30',
  targetArrival: '11:45',
  corridor: 'Corridor Alpha (Direct Transit)'
}

const dailyChecklist = ref([
  {
    id: 1,
    title: 'Vehicle Pre-Trip Inspection & Fluid Levels',
    description: 'Braking pressure, tire treads, and engine fluid level check',
    completed: true,
    tag: 'Safety'
  },
  {
    id: 2,
    title: 'Cargo Seal & Security Lock Verification',
    description: 'Verify tamper-evident container seal numbers match electronic manifest',
    completed: true,
    tag: 'Security'
  },
  {
    id: 3,
    title: 'Departure Gate Clearance & Electronic Manifest Sync',
    description: 'Scan digital RFID pass at outbound perimeter gate',
    completed: false,
    tag: 'Clearance'
  },
  {
    id: 4,
    title: 'Post-Transit Delivery Sign-off & Telemetry Sync',
    description: 'Complete recipient digital bill of lading confirmation upon arrival',
    completed: false,
    tag: 'Sign-off'
  }
])

const completedChecklistCount = computed(
  () => dailyChecklist.value.filter(task => task.completed).length
)
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
    <!-- ───────────────────────────────────────────── -->
    <!-- 1. TOP NAVIGATION BAR (SHARED ACROSS ALL ROLES) -->
    <!-- ───────────────────────────────────────────── -->
    <header class="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-3.5">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <!-- Minimal Brand Icon + Text -->
        <div class="flex items-center gap-3">
          <div class="h-9 w-9 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-950 flex items-center justify-center font-bold shadow-sm">
            <UIcon name="i-heroicons-squares-2x2" class="h-5 w-5" />
          </div>
          <div>
            <h1 class="text-sm sm:text-base font-semibold tracking-tight text-slate-900 dark:text-white">
              Logistics Operations Hub
            </h1>
          </div>
        </div>

        <!-- Clean User Profile Section -->
        <div v-if="user" class="flex items-center gap-3">
          <div class="flex items-center gap-2.5">
            <UAvatar
              :text="user.username ? user.username.charAt(0).toUpperCase() : 'U'"
              size="sm"
              class="ring-1 ring-slate-200 dark:ring-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
            />
            <div class="hidden sm:flex flex-col">
              <span class="text-xs font-semibold text-slate-900 dark:text-slate-100 capitalize leading-none">
                {{ user.username }}
              </span>
            </div>
            <UBadge
              :color="isAdmin ? 'emerald' : 'blue'"
              variant="subtle"
              size="xs"
              class="font-medium capitalize"
            >
              {{ user.role }}
            </UBadge>
          </div>

          <div class="h-4 w-px bg-slate-200 dark:bg-slate-800" />

          <!-- Ghost Sign out button -->
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-arrow-right-on-rectangle"
            size="xs"
            :loading="loggingOut"
            class="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium"
            @click="logout"
          >
            Sign out
          </UButton>
        </div>
      </div>
    </header>

    <!-- ───────────────────────────────────────────── -->
    <!-- 2. BODY CONTENT (ROLE-BASED VIEW)             -->
    <!-- ───────────────────────────────────────────── -->
    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- ============================================== -->
      <!-- A. IF ADMIN: OPERATIONS EXECUTIVE OVERVIEW     -->
      <!-- ============================================== -->
      <div v-if="isAdmin" class="space-y-6">
        <!-- Section Title -->
        <div>
          <h2 class="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Operations Executive Overview
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Global fleet status, facility capacities, and administrative telemetry controls.
          </p>
        </div>

        <!-- 3 Clean KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UCard
            v-for="kpi in adminKpiCards"
            :key="kpi.title"
            :ui="{
              background: 'bg-white dark:bg-slate-900',
              ring: 'ring-1 ring-slate-200 dark:ring-slate-800',
              rounded: 'rounded-xl',
              body: { padding: 'p-5' }
            }"
          >
            <div class="flex items-start justify-between">
              <div class="space-y-1">
                <p class="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {{ kpi.title }}
                </p>
                <div class="flex items-baseline gap-2">
                  <span class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {{ kpi.value }}
                  </span>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 pt-1">
                  {{ kpi.subtitle }}
                </p>
                <div class="pt-2">
                  <UBadge color="gray" variant="subtle" size="xs" class="font-normal text-[11px]">
                    {{ kpi.trend }}
                  </UBadge>
                </div>
              </div>

              <div class="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <UIcon :name="kpi.icon" class="w-5 h-5" />
              </div>
            </div>
          </UCard>
        </div>

        <!-- Dedicated Module Card: Fleet & Route Administration -->
        <UCard
          :ui="{
            background: 'bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800',
            ring: 'ring-1 ring-slate-700/60 dark:ring-slate-700/60',
            rounded: 'rounded-xl',
            body: { padding: 'p-6 sm:p-7' }
          }"
        >
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <UBadge color="emerald" variant="subtle" size="xs" class="font-medium">
                  Administrative Privilege
                </UBadge>
              </div>
              <h3 class="text-lg font-bold text-white tracking-tight">
                Fleet & Route Administration
              </h3>
              <p class="text-xs text-slate-300 max-w-xl leading-relaxed">
                Full administrative controls, dispatch telemetry, and manifest data.
              </p>
            </div>

            <div class="shrink-0">
              <UButton
                to="/admin"
                color="white"
                variant="solid"
                icon="i-heroicons-arrow-right"
                trailing
                size="md"
                class="font-semibold text-slate-950 shadow-md hover:bg-slate-100"
              >
                Open Admin Dashboard
              </UButton>
            </div>
          </div>
        </UCard>

        <!-- Recent Audit Logs / System Event List Preview -->
        <UCard
          :ui="{
            background: 'bg-white dark:bg-slate-900',
            ring: 'ring-1 ring-slate-200 dark:ring-slate-800',
            rounded: 'rounded-xl',
            header: { padding: 'px-5 py-4' },
            body: { padding: 'p-0' }
          }"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-queue-list" class="w-4 h-4 text-slate-500" />
                <h3 class="text-sm font-semibold text-slate-900 dark:text-white">
                  Recent System Events & Audit Trail
                </h3>
              </div>
              <span class="text-xs text-slate-500 dark:text-slate-400">
                Live Telemetry Feed
              </span>
            </div>
          </template>

          <div class="divide-y divide-slate-100 dark:divide-slate-800">
            <div
              v-for="log in recentAuditLogs"
              :key="log.id"
              class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div class="flex items-start sm:items-center gap-3">
                <span class="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                  {{ log.id }}
                </span>
                <span class="text-xs font-medium text-slate-800 dark:text-slate-200">
                  {{ log.event }}
                </span>
              </div>

              <div class="flex items-center gap-2.5 shrink-0 self-end sm:self-auto text-xs">
                <span class="text-slate-400 dark:text-slate-500 text-[11px]">
                  {{ log.actor }} · {{ log.time }}
                </span>
                <UBadge
                  color="gray"
                  variant="subtle"
                  size="xs"
                  class="font-medium text-[10px]"
                >
                  {{ log.badge }}
                </UBadge>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- ============================================== -->
      <!-- B. IF EMPLOYEE: STAFF DAILY WORKSPACE          -->
      <!-- ============================================== -->
      <div v-else class="space-y-6">
        <!-- Section Title -->
        <div>
          <h2 class="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Staff Daily Workspace
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Active shift overview, pre-trip safety checklist, and assigned route details.
          </p>
        </div>

        <!-- 3 Work Cards / Layout Tailored to Operational Staff -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- 1. Daily Operational Checklist (2 cols) -->
          <div class="lg:col-span-2 space-y-6">
            <UCard
              :ui="{
                background: 'bg-white dark:bg-slate-900',
                ring: 'ring-1 ring-slate-200 dark:ring-slate-800',
                rounded: 'rounded-xl',
                header: { padding: 'px-5 py-4' },
                body: { padding: 'p-0' }
              }"
            >
              <template #header>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <UIcon name="i-heroicons-clipboard-document-check" class="w-4 h-4 text-slate-500" />
                    <h3 class="text-sm font-semibold text-slate-900 dark:text-white">
                      Daily Pre-Trip & Operational Checklist
                    </h3>
                  </div>
                  <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {{ completedChecklistCount }}/{{ dailyChecklist.length }} Completed
                  </span>
                </div>
              </template>

              <div class="divide-y divide-slate-100 dark:divide-slate-800">
                <div
                  v-for="task in dailyChecklist"
                  :key="task.id"
                  class="flex items-start justify-between px-5 py-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div class="flex items-start gap-3">
                    <UCheckbox
                      v-model="task.completed"
                      color="primary"
                      class="mt-0.5"
                    />
                    <div class="space-y-0.5">
                      <p
                        class="text-xs font-medium cursor-pointer select-none"
                        :class="task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'"
                        @click="task.completed = !task.completed"
                      >
                        {{ task.title }}
                      </p>
                      <p class="text-[11px] text-slate-400 dark:text-slate-500">
                        {{ task.description }}
                      </p>
                    </div>
                  </div>

                  <UBadge
                    :color="task.completed ? 'emerald' : 'gray'"
                    variant="subtle"
                    size="xs"
                    class="font-medium shrink-0 ml-3"
                  >
                    {{ task.tag }}
                  </UBadge>
                </div>
              </div>
            </UCard>

            <!-- 2. Assigned Route Details Card -->
            <UCard
              :ui="{
                background: 'bg-white dark:bg-slate-900',
                ring: 'ring-1 ring-slate-200 dark:ring-slate-800',
                rounded: 'rounded-xl',
                header: { padding: 'px-5 py-4' },
                body: { padding: 'p-5' }
              }"
            >
              <template #header>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <UIcon name="i-heroicons-map-pin" class="w-4 h-4 text-slate-500" />
                    <h3 class="text-sm font-semibold text-slate-900 dark:text-white">
                      Assigned Route Manifest
                    </h3>
                  </div>
                  <UBadge color="blue" variant="subtle" size="xs" class="font-medium">
                    {{ assignedRoute.runId }}
                  </UBadge>
                </div>
              </template>

              <div class="space-y-4">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {{ assignedRoute.title }}
                  </span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span class="text-slate-400 dark:text-slate-500 text-[11px] block">Origin</span>
                    <span class="font-medium text-slate-800 dark:text-slate-200 mt-0.5 block">
                      {{ assignedRoute.origin }}
                    </span>
                    <span class="text-slate-400 dark:text-slate-500 text-[11px] mt-1 block">
                      Dep: {{ assignedRoute.departureTime }}
                    </span>
                  </div>

                  <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span class="text-slate-400 dark:text-slate-500 text-[11px] block">Destination</span>
                    <span class="font-medium text-slate-800 dark:text-slate-200 mt-0.5 block">
                      {{ assignedRoute.destination }}
                    </span>
                    <span class="text-slate-400 dark:text-slate-500 text-[11px] mt-1 block">
                      ETA: {{ assignedRoute.targetArrival }}
                    </span>
                  </div>
                </div>

                <div class="flex flex-col sm:flex-row sm:items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800 gap-2">
                  <div>
                    <span class="text-slate-400 dark:text-slate-500">Cargo Payload: </span>
                    <span class="font-medium text-slate-700 dark:text-slate-300">{{ assignedRoute.cargo }}</span>
                  </div>
                  <div>
                    <span class="text-slate-400 dark:text-slate-500">Corridor: </span>
                    <span class="font-medium text-slate-700 dark:text-slate-300">{{ assignedRoute.corridor }}</span>
                  </div>
                </div>
              </div>
            </UCard>
          </div>

          <!-- 3. Active Shift Status (1 col) -->
          <div class="space-y-6">
            <UCard
              :ui="{
                background: 'bg-white dark:bg-slate-900',
                ring: 'ring-1 ring-slate-200 dark:ring-slate-800',
                rounded: 'rounded-xl',
                header: { padding: 'px-5 py-4' },
                body: { padding: 'p-5' }
              }"
            >
              <template #header>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <UIcon name="i-heroicons-identification" class="w-4 h-4 text-slate-500" />
                    <h3 class="text-sm font-semibold text-slate-900 dark:text-white">
                      Active Shift Status
                    </h3>
                  </div>
                  <UBadge color="emerald" variant="subtle" size="xs" class="font-medium">
                    Active
                  </UBadge>
                </div>
              </template>

              <div class="space-y-3.5 text-xs">
                <div>
                  <span class="text-slate-400 dark:text-slate-500 block font-medium">Shift Assignment</span>
                  <span class="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                    {{ staffShift.shiftCode }} · {{ staffShift.hub }}
                  </span>
                </div>

                <div class="pt-2.5 border-t border-slate-100 dark:border-slate-800">
                  <span class="text-slate-400 dark:text-slate-500 block font-medium">Scheduled Hours</span>
                  <span class="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                    {{ staffShift.schedule }}
                  </span>
                </div>

                <div class="pt-2.5 border-t border-slate-100 dark:border-slate-800">
                  <span class="text-slate-400 dark:text-slate-500 block font-medium">Assigned Vehicle</span>
                  <span class="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                    {{ staffShift.assignedUnit }}
                  </span>
                </div>

                <div class="pt-2.5 border-t border-slate-100 dark:border-slate-800">
                  <span class="text-slate-400 dark:text-slate-500 block font-medium">Staging Position</span>
                  <span class="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                    {{ staffShift.stagingBay }}
                  </span>
                </div>

                <div class="pt-2.5 border-t border-slate-100 dark:border-slate-800">
                  <span class="text-slate-400 dark:text-slate-500 block font-medium">Duty Desk</span>
                  <span class="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                    {{ staffShift.supervisor }}
                  </span>
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

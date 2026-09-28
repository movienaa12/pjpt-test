<script setup lang="ts">
import { useSeoMeta } from 'nuxt/app'

useSeoMeta({
  title: 'Logistics Operations · Admin'
})

// 3 Clean KPI metrics
const metrics = [
  {
    title: 'Active Fleet',
    value: '34 Units',
    subtitle: 'Transit to Seaport Terminal'
  },
  {
    title: 'Warehouse Capacity',
    value: '86%',
    subtitle: 'Central Warehouse'
  },
  {
    title: 'Dispatches Today',
    value: '18 Shipments',
    subtitle: 'Distribution Center 1'
  }
]

// 5 Clean mock rows
const manifests = [
  {
    id: 'MNF-2026-0891',
    route: 'Central Warehouse → Seaport Terminal',
    payload: '6x Car Carrier (CBU Export)',
    status: 'On Delivery'
  },
  {
    id: 'MNF-2026-0892',
    route: 'Distribution Center 1 → Seaport Terminal',
    payload: '40ft High-Cube CKD Stamping',
    status: 'Arrived at Port'
  },
  {
    id: 'MNF-2026-0893',
    route: 'Distribution Center 1 → Central Staging Bay',
    payload: 'Chassis & Sub-Assembly Frames',
    status: 'In Transit'
  },
  {
    id: 'MNF-2026-0894',
    route: 'Central Warehouse → Regional Assembly Hub',
    payload: 'Powertrain Modules (JIT)',
    status: 'Completed'
  },
  {
    id: 'MNF-2026-0895',
    route: 'Container Freight Station → Distribution Center 1',
    payload: 'Engine Parts & Transmission Packs',
    status: 'In Transit'
  }
]

const columns = [
  { key: 'id', label: 'Manifest ID' },
  { key: 'route', label: 'Route' },
  { key: 'payload', label: 'Payload' },
  { key: 'status', label: 'Status' }
]

function getStatusColor(status: string) {
  switch (status) {
    case 'On Delivery':
      return 'blue'
    case 'In Transit':
      return 'amber'
    case 'Arrived at Port':
      return 'purple'
    case 'Completed':
      return 'emerald'
    default:
      return 'gray'
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div class="flex items-center gap-3">
          <h1 class="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Logistics Operations
          </h1>
          <UBadge color="gray" variant="subtle" size="xs" class="font-medium">
            Admin
          </UBadge>
        </div>

        <UButton
          to="/home"
          color="gray"
          variant="ghost"
          icon="i-heroicons-arrow-left"
          class="font-medium hover:bg-slate-100 dark:hover:bg-slate-900"
        >
          Back to home
        </UButton>
      </div>

      <!-- Metrics: Single row, 3 clean KPI cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UCard
          v-for="metric in metrics"
          :key="metric.title"
          :ui="{
            background: 'bg-white dark:bg-slate-900',
            ring: 'ring-1 ring-slate-200 dark:ring-slate-800',
            rounded: 'rounded-xl',
            body: { padding: 'p-5' }
          }"
        >
          <div class="space-y-1">
            <p class="text-xs font-medium text-slate-500 dark:text-slate-400">
              {{ metric.title }}
            </p>
            <p class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {{ metric.value }}
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400 pt-1">
              {{ metric.subtitle }}
            </p>
          </div>
        </UCard>
      </div>

      <!-- Minimal Manifest Table -->
      <UCard
        :ui="{
          background: 'bg-white dark:bg-slate-900',
          ring: 'ring-1 ring-slate-200 dark:ring-slate-800',
          rounded: 'rounded-xl',
          header: { padding: 'px-5 py-4' },
          body: { padding: 'p-0 sm:p-0' }
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-semibold text-slate-900 dark:text-white">
              Recent Manifests
            </h2>
            <span class="text-xs text-slate-500 dark:text-slate-400">
              {{ manifests.length }} active routes
            </span>
          </div>
        </template>

        <UTable
          :columns="columns"
          :rows="manifests"
          :ui="{
            wrapper: 'relative overflow-x-auto',
            divide: 'divide-y divide-slate-200 dark:divide-slate-800',
            thead: 'bg-slate-50/60 dark:bg-slate-900/60',
            th: {
              padding: 'px-5 py-3',
              color: 'text-slate-500 dark:text-slate-400',
              font: 'font-medium text-xs uppercase tracking-wider'
            },
            td: {
              padding: 'px-5 py-3.5',
              color: 'text-slate-700 dark:text-slate-300',
              base: 'text-sm'
            }
          }"
        >
          <!-- Manifest ID -->
          <template #id-data="{ row }">
            <span class="font-medium text-slate-900 dark:text-white font-mono text-xs">
              {{ row.id }}
            </span>
          </template>

          <!-- Route -->
          <template #route-data="{ row }">
            <span class="font-medium text-slate-800 dark:text-slate-200">
              {{ row.route }}
            </span>
          </template>

          <!-- Payload -->
          <template #payload-data="{ row }">
            <span class="text-slate-500 dark:text-slate-400 text-xs">
              {{ row.payload }}
            </span>
          </template>

          <!-- Status -->
          <template #status-data="{ row }">
            <UBadge
              :color="getStatusColor(row.status)"
              variant="subtle"
              size="xs"
              class="font-medium"
            >
              {{ row.status }}
            </UBadge>
          </template>
        </UTable>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: (value: boolean) => {
    colorMode.preference = value ? 'dark' : 'light'
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
    <div class="absolute right-4 top-4">
      <ClientOnly>
        <UButton
          :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
          color="gray"
          variant="ghost"
          aria-label="Toggle color mode"
          @click="isDark = !isDark"
        />
        <template #fallback>
          <div class="h-8 w-8" />
        </template>
      </ClientOnly>
    </div>

    <NuxtPage />
  </div>
</template>

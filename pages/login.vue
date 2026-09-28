<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

useSeoMeta({ title: 'Sign in' })

const schema = object({
  username: string()
    .min(4, 'Must be at least 4 characters')
    .required('Required'),
  password: string()
    .min(4, 'Must be at least 4 characters')
    .required('Required')
})

type Schema = InferType<typeof schema>

const state = reactive<Schema>({
  username: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')

function getErrorMessage(error: unknown): string {
  const fetchError = error as { data?: { message?: string } }
  return fetchError.data?.message ?? 'Something went wrong. Please try again.'
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  errorMessage.value = ''

  try {
    await $fetch('/api/login', { method: 'POST', body: event.data })
    // Full page navigation so the server middleware evaluates /home with the new session.
    await navigateTo('/home', { external: true })
  } catch (error) {
    errorMessage.value = getErrorMessage(error)
    loading.value = false
  }
}
</script>

<template>
  <main class="flex min-h-screen items-center justify-center px-4 py-12">
    <div class="w-full max-w-sm">
      <div class="mb-6">
        <h1 class="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Use your account to continue to the dashboard.
        </p>
      </div>

      <UCard>
        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
          <UAlert
            v-if="errorMessage"
            color="red"
            variant="subtle"
            icon="i-heroicons-exclamation-triangle"
            title="Could not sign in"
            :description="errorMessage"
          />

          <UFormGroup label="Username" name="username">
            <UInput
              v-model="state.username"
              autocomplete="username"
              placeholder="admin"
              autofocus
            />
          </UFormGroup>

          <UFormGroup label="Password" name="password">
            <UInput
              v-model="state.password"
              type="password"
              autocomplete="current-password"
              placeholder="••••••••"
            />
          </UFormGroup>

          <UButton type="submit" block :loading="loading">
            Sign in
          </UButton>
        </UForm>
      </UCard>

      <p class="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
        Demo accounts: <code>admin / admin</code> and <code>employee / employee</code>
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
const props = defineProps<{
  visible: boolean
  reminderDateLabel: string
}>()

const emit = defineEmits<{
  close: []
  google: []
  ics: []
}>()
</script>

<template>
  <Transition name="fade-up">
    <div
      v-if="props.visible"
      class="fixed inset-0 z-50 flex items-end bg-black/25 p-3 sm:items-center sm:justify-center sm:p-6"
    >
      <div class="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:p-5">
        <p class="text-sm text-stone-500">
          Напоминание
        </p>
        <h3 class="mt-1 text-xl font-semibold text-stone-900">
          Запланировать встречу в «Маленькой Италии»?
        </h3>
        <p class="mt-2 text-sm text-stone-600">
          Добавим событие на {{ props.reminderDateLabel }} (20:00).
        </p>

        <div class="mt-4 flex flex-col gap-2">
          <UiRomanticButton @click="emit('google')">
            Добавить в Google Календарь
          </UiRomanticButton>
          <UiRomanticButton
            variant="secondary"
            @click="emit('ics')"
          >
            Скачать напоминание (.ics)
          </UiRomanticButton>
          <button
            type="button"
            class="rounded-xl px-4 py-2 text-sm text-stone-500 transition hover:bg-stone-100"
            @click="emit('close')"
          >
            Позже
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity 0.24s ease, transform 0.24s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>

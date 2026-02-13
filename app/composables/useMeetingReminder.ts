export function useMeetingReminder() {
  const isAppleDevice = ref(false)
  const showReminderModal = ref(false)
  const appBaseURL = useRuntimeConfig().app.baseURL

  function getNextMeetingStart() {
    const now = new Date()
    const currentYear = now.getFullYear()
    const thisYearMeeting = new Date(currentYear, 1, 14, 18, 0, 0, 0)
    return now.getTime() <= thisYearMeeting.getTime()
      ? thisYearMeeting
      : new Date(currentYear + 1, 1, 14, 18, 0, 0, 0)
  }

  const meetingStart = computed(() => getNextMeetingStart())
  const reminderDateLabel = computed(() => new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  }).format(meetingStart.value))

  function joinBaseAndPath(baseURL: string, path: string) {
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path

    if (!baseURL || baseURL === '/') {
      return `/${normalizedPath}`
    }

    const normalizedBase = baseURL.endsWith('/') ? baseURL : `${baseURL}/`
    return `${normalizedBase}${normalizedPath}`
  }

  function detectMobile() {
    if (!import.meta.client) {
      return
    }

    const ua = navigator.userAgent
    const isTouchMac = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
    isAppleDevice.value = /iPhone|iPad|iPod/i.test(ua) || isTouchMac
  }

  function triggerOnUnlock() {
    if (isAppleDevice.value) {
      showReminderModal.value = true
    }
  }

  function closeReminder() {
    showReminderModal.value = false
  }

  function openAppleCalendar() {
    if (!import.meta.client) {
      return
    }

    const icsPath = joinBaseAndPath(appBaseURL, '/reminders/meeting.ics')
    const httpUrl = new URL(icsPath, window.location.origin).toString()
    const webcalUrl = httpUrl.replace(/^https?/, 'webcal')

    window.location.href = webcalUrl
    setTimeout(() => {
      window.location.href = httpUrl
    }, 500)

    closeReminder()
  }

  return {
    showReminderModal,
    isAppleDevice,
    reminderDateLabel,
    detectMobile,
    triggerOnUnlock,
    closeReminder,
    openAppleCalendar
  }
}

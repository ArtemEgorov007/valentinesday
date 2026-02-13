export function useMeetingReminder(destinationAddress: string) {
  const isAppleDevice = ref(false)
  const showReminderModal = ref(false)

  const meetingTitle = 'Встреча в ресторане «Маленькая Италия»'
  const meetingAddress = '10 Italianskaya Street, St. Petersburg, Russia, 191011'
  const meetingDescription = `Напоминание о встрече в 18:00. Локация: ${destinationAddress}`

  function getMeetingWindow() {
    const now = new Date()
    const currentYear = now.getFullYear()
    const thisYearMeeting = new Date(currentYear, 1, 14, 18, 0, 0, 0)
    const start = now.getTime() <= thisYearMeeting.getTime()
      ? thisYearMeeting
      : new Date(currentYear + 1, 1, 14, 18, 0, 0, 0)

    const end = new Date(start)
    end.setHours(19, 0, 0, 0)

    return { start, end }
  }

  const meetingWindow = computed(() => getMeetingWindow())
  const reminderDateLabel = computed(() => new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  }).format(meetingWindow.value.start))

  function formatIcsDateUtc(date: Date) {
    return date.toISOString().replace(/[-:]/g, '').replace('.000', '')
  }

  function escapeIcs(value: string) {
    return value
      .replace(/\\/g, '\\\\')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;')
      .replace(/\n/g, '\\n')
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

  function buildIcsContent() {
    const uid = `little-italy-${meetingWindow.value.start.getTime()}@valentineday`

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Valentine Quest//RU',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${formatIcsDateUtc(new Date())}`,
      `DTSTART:${formatIcsDateUtc(meetingWindow.value.start)}`,
      `DTEND:${formatIcsDateUtc(meetingWindow.value.end)}`,
      `SUMMARY:${escapeIcs(meetingTitle)}`,
      `DESCRIPTION:${escapeIcs(meetingDescription)}`,
      `LOCATION:${escapeIcs(meetingAddress)}`,
      'BEGIN:VALARM',
      'TRIGGER:-PT30M',
      'ACTION:DISPLAY',
      'DESCRIPTION:Напоминание о встрече',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n')
  }

  function openAppleCalendar() {
    if (!import.meta.client) {
      return
    }

    const content = buildIcsContent()
    const dataUrl = `data:text/calendar;charset=utf-8,${encodeURIComponent(content)}`
    window.location.href = dataUrl
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

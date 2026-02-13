export function useMeetingReminder(destinationAddress: string) {
  const isMobileDevice = ref(false)
  const showReminderModal = ref(false)

  const meetingTitle = 'Встреча в ресторане «Маленькая Италия»'
  const meetingAddress = '10 Italianskaya Street, St. Petersburg, Russia, 191011'
  const meetingDescription = `Ужин в 20:00. Локация: ${destinationAddress}`

  function getMeetingWindow() {
    const now = new Date()
    const currentYear = now.getFullYear()
    const thisYearMeeting = new Date(currentYear, 1, 14, 20, 0, 0, 0)
    const start = now.getTime() <= thisYearMeeting.getTime()
      ? thisYearMeeting
      : new Date(currentYear + 1, 1, 14, 20, 0, 0, 0)

    const end = new Date(start)
    end.setHours(22, 0, 0, 0)

    return { start, end }
  }

  const meetingWindow = computed(() => getMeetingWindow())
  const reminderDateLabel = computed(() => new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  }).format(meetingWindow.value.start))

  function formatGoogleDate(date: Date) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    const h = String(date.getHours()).padStart(2, '0')
    const min = String(date.getMinutes()).padStart(2, '0')
    const s = String(date.getSeconds()).padStart(2, '0')
    return `${y}${m}${d}T${h}${min}${s}`
  }

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

  const googleCalendarUrl = computed(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const dates = `${formatGoogleDate(meetingWindow.value.start)}/${formatGoogleDate(meetingWindow.value.end)}`
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: meetingTitle,
      dates,
      details: meetingDescription,
      location: meetingAddress,
      ctz: timezone
    })
    return `https://calendar.google.com/calendar/render?${params.toString()}`
  })

  function detectMobile() {
    if (!import.meta.client) {
      return
    }

    const ua = navigator.userAgent
    isMobileDevice.value = window.matchMedia('(max-width: 768px)').matches
      || /Android|iPhone|iPad|iPod|Mobile/i.test(ua)
  }

  function triggerOnUnlock() {
    if (isMobileDevice.value) {
      showReminderModal.value = true
    }
  }

  function closeReminder() {
    showReminderModal.value = false
  }

  function openGoogleCalendar() {
    if (!import.meta.client) {
      return
    }

    window.open(googleCalendarUrl.value, '_blank', 'noopener,noreferrer')
  }

  function downloadIcsReminder() {
    if (!import.meta.client) {
      return
    }

    const uid = `little-italy-${meetingWindow.value.start.getTime()}@valentineday`
    const content = [
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
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n')

    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'vstrecha-malenkaya-italiya.ics'
    link.click()
    URL.revokeObjectURL(url)
  }

  return {
    showReminderModal,
    reminderDateLabel,
    detectMobile,
    triggerOnUnlock,
    closeReminder,
    openGoogleCalendar,
    downloadIcsReminder
  }
}

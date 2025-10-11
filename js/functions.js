/**
 * Функция проверяет, помещается ли встреча в рамки рабочего дня
 * @param {string} startWorkDay - начало рабочего дня в формате 'часы:минуты'
 * @param {string} endWorkDay - конец рабочего дня в формате 'часы:минуты'
 * @param {string} startMeeting - начало встречи в формате 'часы:минуты'
 * @param {number} meetingDuration - продолжительность встречи в минутах
 * @returns {boolean} - true, если встреча помещается в рабочий день, false - если нет
 */
function isMeetingWithinWorkingHours(startWorkDay, endWorkDay, startMeeting, meetingDuration) {
  /**
   * Конвертирует время из формата 'часы:минуты' в общее количество минут с начала дня
   * @param {string} time - время в формате 'часы:минуты'
   * @returns {number} - количество минут с начала дня
   */
  function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Конвертируем все времена в минуты
  const startWorkMinutes = timeToMinutes(startWorkDay);
  const endWorkMinutes = timeToMinutes(endWorkDay);
  const startMeetingMinutes = timeToMinutes(startMeeting);
  const endMeetingMinutes = startMeetingMinutes + meetingDuration;

  // Проверяем, что встреча начинается не раньше начала рабочего дня
  // и заканчивается не позже конца рабочего дня
  return startMeetingMinutes >= startWorkMinutes && endMeetingMinutes <= endWorkMinutes;
}

// Примеры использования для проверки:
// isMeetingWithinWorkingHours('08:00', '17:30', '14:00', 90); // true
// isMeetingWithinWorkingHours('8:0', '10:0', '8:0', 120);     // true
// isMeetingWithinWorkingHours('08:00', '14:30', '14:00', 90); // false
// isMeetingWithinWorkingHours('14:00', '17:30', '08:0', 90);  // false
// isMeetingWithinWorkingHours('8:00', '17:30', '08:00', 900); // false

export { isMeetingWithinWorkingHours };

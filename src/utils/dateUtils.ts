import { Language, Plan, TimeCountdown } from '../types/plan';
import { translations } from '../translations';

/**
 * Parses plan date ('YYYY-MM-DD') and time ('HH:MM') into a Date object
 */
export function getPlanDateTime(dateStr: string, timeStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  return new Date(year, month - 1, day, hours || 0, minutes || 0, 0, 0);
}

/**
 * Calculates remaining countdown time from `now` to target date/time
 */
export function calculateCountdown(
  dateStr: string,
  timeStr: string,
  now: number,
  lang: Language = 'ru'
): TimeCountdown {
  const targetDate = getPlanDateTime(dateStr, timeStr);
  const totalMs = targetDate.getTime() - now;
  const isOverdue = totalMs < 0;
  const absMs = Math.abs(totalMs);

  const totalSeconds = Math.floor(absMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const t = translations[lang];

  let formattedText = '';
  if (isOverdue) {
    formattedText = t.nearest.overdue;
  } else if (days > 0) {
    if (hours > 0) {
      if (lang === 'ru') {
        formattedText = `${t.countdownUnits.daysPlural(days)} ${t.countdownUnits.hoursPlural(hours)}`;
      } else if (lang === 'ko') {
        formattedText = `${days}일 ${hours}시간`;
      } else {
        formattedText = `${days} ${days === 1 ? 'day' : 'days'} ${hours} ${hours === 1 ? 'hour' : 'hours'}`;
      }
    } else {
      if (lang === 'ru') {
        formattedText = t.countdownUnits.daysPlural(days);
      } else if (lang === 'ko') {
        formattedText = `${days}일`;
      } else {
        formattedText = `${days} ${days === 1 ? 'day' : 'days'}`;
      }
    }
  } else if (hours > 0) {
    if (lang === 'ru') {
      formattedText = `${hours} ч. ${minutes} мин.`;
    } else if (lang === 'ko') {
      formattedText = `${hours}시간 ${minutes}분`;
    } else {
      formattedText = `${hours}h ${minutes}m`;
    }
  } else if (minutes > 0) {
    if (lang === 'ru') {
      formattedText = `${minutes} мин. ${seconds} сек.`;
    } else if (lang === 'ko') {
      formattedText = `${minutes}분 ${seconds}초`;
    } else {
      formattedText = `${minutes}m ${seconds}s`;
    }
  } else {
    if (lang === 'ru') {
      formattedText = `${seconds} сек.`;
    } else if (lang === 'ko') {
      formattedText = `${seconds}초`;
    } else {
      formattedText = `${seconds}s`;
    }
  }

  return {
    totalMs,
    isOverdue,
    days,
    hours,
    minutes,
    seconds,
    formattedText,
  };
}

/**
 * Formats date and time nicely with respect to locale
 */
export function formatPlanDate(dateStr: string, timeStr: string, lang: Language): string {
  try {
    const date = getPlanDateTime(dateStr, timeStr);
    const locale = lang === 'ru' ? 'ru-RU' : lang === 'ko' ? 'ko-KR' : 'en-US';

    const monthDay = new Intl.DateTimeFormat(locale, {
      month: 'long',
      day: 'numeric',
    }).format(date);

    // Formatted time: HH:mm in 24h or locale standard
    const formattedTime = timeStr || '00:00';

    if (lang === 'ru') {
      return `${monthDay}, ${formattedTime}`;
    } else if (lang === 'ko') {
      return `${monthDay} ${formattedTime}`;
    } else {
      // 12-hour or standard en format
      const timeFormatted = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(date);
      return `${monthDay}, ${timeFormatted}`;
    }
  } catch {
    return `${dateStr} ${timeStr}`;
  }
}

/**
 * Returns formatted string "YYYY-MM-DD" from Date
 */
export function formatDateISO(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Generates initial demo plans with realistic dates relative to current time
 */
export function createDemoPlans(): Plan[] {
  const now = new Date();

  // 1. Homework in ~3 days 7 hours (due Oct 2 equivalent)
  const d1 = new Date(now.getTime() + (3 * 24 + 7) * 3600 * 1000);
  // 2. Presentation in ~5 days 3 hours (due Oct 6 equivalent)
  const d2 = new Date(now.getTime() + (5 * 24 + 3) * 3600 * 1000);
  // 3. Exam in ~14 days (due Oct 15 equivalent)
  const d3 = new Date(now.getTime() + 14 * 24 * 3600 * 1000);

  return [
    {
      id: 'demo-1',
      title: '📚 Сделать домашнее задание',
      date: formatDateISO(d1),
      time: `${String(d1.getHours()).padStart(2, '0')}:00`,
      note: 'Параграф 14-16, решить задачи 3, 5 и 8. Подготовить черновик эссе.',
      category: 'study',
      completed: false,
      createdAt: Date.now() - 3600000,
    },
    {
      id: 'demo-2',
      title: '📌 Подготовить презентацию',
      date: formatDateISO(d2),
      time: `${String(d2.getHours()).padStart(2, '0')}:00`,
      note: 'Собрать 10 слайдов по проекту, добавить графики и проверить тайминг речи.',
      category: 'project',
      completed: false,
      createdAt: Date.now() - 7200000,
    },
    {
      id: 'demo-3',
      title: '🎓 Подготовиться к экзамену',
      date: formatDateISO(d3),
      time: '10:00',
      note: 'Повторить формулы, билеты с 1 по 25, выписать основные термины в конспект.',
      category: 'exam',
      completed: false,
      createdAt: Date.now() - 10800000,
    },
  ];
}

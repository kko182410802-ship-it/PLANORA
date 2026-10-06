import { Language, PlanCategory } from '../types/plan';

export interface Translations {
  appName: string;
  tagline: string;
  nav: {
    home: string;
    myPlans: string;
    addPlan: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    addBtn: string;
    viewPlansBtn: string;
    statsTotal: string;
    statsToday: string;
    statsCompleted: string;
  };
  nearest: {
    sectionTitle: string;
    badge: string;
    timeLeft: string;
    overdue: string;
    completed: string;
    nowHappening: string;
    allDoneTitle: string;
    allDoneSubtitle: string;
    addFirstPlan: string;
    markDone: string;
    edit: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  countdownUnits: {
    daysShort: string;
    hoursShort: string;
    minutesShort: string;
    secondsShort: string;
    daysPlural: (n: number) => string;
    hoursPlural: (n: number) => string;
  };
  plansSection: {
    title: string;
    subtitle: string;
    filterAll: string;
    filterUpcoming: string;
    filterOverdue: string;
    filterCompleted: string;
    searchPlaceholder: string;
    sortBy: string;
    sortNearest: string;
    sortFurthest: string;
    sortTitle: string;
    nearestBadge: string;
    overdueBadge: string;
    completedBadge: string;
    editBtn: string;
    deleteBtn: string;
    toggleComplete: string;
    toggleIncomplete: string;
    noteLabel: string;
  };
  emptyState: {
    title: string;
    subtitle: string;
    button: string;
    filterEmptyTitle: string;
    filterEmptySubtitle: string;
    clearSearch: string;
  };
  modal: {
    addTitle: string;
    editTitle: string;
    titleLabel: string;
    titlePlaceholder: string;
    dateLabel: string;
    timeLabel: string;
    categoryLabel: string;
    noteLabel: string;
    notePlaceholder: string;
    quickPresets: string;
    today: string;
    tomorrow: string;
    in3Days: string;
    inWeek: string;
    saveBtn: string;
    cancelBtn: string;
    errTitle: string;
    errDate: string;
    errTime: string;
  };
  deleteModal: {
    title: string;
    message: string;
    confirmBtn: string;
    cancelBtn: string;
  };
  categories: Record<PlanCategory, string>;
  toasts: {
    added: string;
    updated: string;
    deleted: string;
    completed: string;
    uncompleted: string;
    demoRestored: string;
  };
  footer: {
    description: string;
    restoreDemo: string;
    builtFor: string;
    allRightsReserved: string;
  };
}

export const translations: Record<Language, Translations> = {
  ru: {
    appName: 'Plan Reminder',
    tagline: 'Не забывай о важном.',
    nav: {
      home: 'Главная',
      myPlans: 'Мои планы',
      addPlan: 'Добавить план',
    },
    hero: {
      badge: 'Простой студенческий планировщик',
      title: 'Твои планы — всегда под рукой',
      subtitle: 'Добавляй важные дела и следи за тем, сколько времени осталось до них.',
      addBtn: '+ Добавить план',
      viewPlansBtn: 'Мои планы',
      statsTotal: 'Всего планов',
      statsToday: 'На сегодня',
      statsCompleted: 'Выполнено',
    },
    nearest: {
      sectionTitle: 'Ближайший план',
      badge: 'Самое срочное',
      timeLeft: 'Осталось',
      overdue: 'Просрочено',
      completed: 'Выполнено',
      nowHappening: 'Прямо сейчас',
      allDoneTitle: 'Все ближайшие планы выполнены! ✨',
      allDoneSubtitle: 'Отличная учеба! Добавь новое задание или отдохни.',
      addFirstPlan: 'Создать новый план',
      markDone: 'Завершить',
      edit: 'Редактировать',
      days: 'дней',
      hours: 'часов',
      minutes: 'минут',
      seconds: 'секунд',
    },
    countdownUnits: {
      daysShort: 'дн.',
      hoursShort: 'ч.',
      minutesShort: 'мин.',
      secondsShort: 'сек.',
      daysPlural: (n: number) => {
        const mod10 = n % 10;
        const mod100 = n % 100;
        if (mod10 === 1 && mod100 !== 11) return `${n} день`;
        if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${n} дня`;
        return `${n} дней`;
      },
      hoursPlural: (n: number) => {
        const mod10 = n % 10;
        const mod100 = n % 100;
        if (mod10 === 1 && mod100 !== 11) return `${n} час`;
        if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${n} часа`;
        return `${n} часов`;
      },
    },
    plansSection: {
      title: 'Мои планы',
      subtitle: 'Список всех домашних заданий, экзаменов и личных дел',
      filterAll: 'Все планы',
      filterUpcoming: 'Предстоящие',
      filterOverdue: 'Просроченные',
      filterCompleted: 'Выполненные',
      searchPlaceholder: 'Поиск по названию или заметке...',
      sortBy: 'Сортировка',
      sortNearest: 'Сначала ближайшие',
      sortFurthest: 'Сначала дальние',
      sortTitle: 'По названию',
      nearestBadge: 'Ближайшее',
      overdueBadge: 'Просрочено',
      completedBadge: 'Выполнено',
      editBtn: 'Редактировать',
      deleteBtn: 'Удалить',
      toggleComplete: 'Отметить выполненным',
      toggleIncomplete: 'Вернуть в активные',
      noteLabel: 'Заметка',
    },
    emptyState: {
      title: 'Пока планов нет',
      subtitle: 'Добавь своё первое дело, чтобы ничего не забыть.',
      button: '+ Добавить план',
      filterEmptyTitle: 'В этой категории ничего нет',
      filterEmptySubtitle: 'Попробуй переключить фильтр или изменить строку поиска',
      clearSearch: 'Сбросить поиск',
    },
    modal: {
      addTitle: 'Добавить план',
      editTitle: 'Редактировать план',
      titleLabel: 'Название плана',
      titlePlaceholder: 'Например: подготовить презентацию',
      dateLabel: 'Дата',
      timeLabel: 'Время',
      categoryLabel: 'Категория',
      noteLabel: 'Заметка (необязательно)',
      notePlaceholder: 'Дополнительная информация',
      quickPresets: 'Быстрый выбор',
      today: 'Сегодня',
      tomorrow: 'Завтра',
      in3Days: '+3 дня',
      inWeek: '+1 неделя',
      saveBtn: 'Сохранить план',
      cancelBtn: 'Отмена',
      errTitle: 'Укажите название плана',
      errDate: 'Выберите дату',
      errTime: 'Выберите время',
    },
    deleteModal: {
      title: 'Удалить план?',
      message: 'Вы уверены, что хотите удалить этот план? Это действие нельзя отменить.',
      confirmBtn: 'Удалить',
      cancelBtn: 'Отмена',
    },
    categories: {
      study: '📚 Домашка и учёба',
      exam: '🎓 Экзамен / Зачёт',
      project: '💻 Проект',
      meeting: '👥 Встреча',
      personal: '✨ Личное',
      other: '📌 Другое',
    },
    toasts: {
      added: 'План успешно добавлен ✨',
      updated: 'План сохранён 👍',
      deleted: 'План удалён 🗑️',
      completed: 'Отличная работа! План выполнен 🎉',
      uncompleted: 'План возвращён в активные',
      demoRestored: 'Демо-планы восстановлены',
    },
    footer: {
      description: 'Plan Reminder — современный минималистичный планировщик для школьников и студентов.',
      restoreDemo: 'Восстановить примеры планов',
      builtFor: 'Помогает успевать вовремя и беречь нервы',
      allRightsReserved: 'Все данные сохраняются локально в твоём браузере.',
    },
  },

  en: {
    appName: 'Plan Reminder',
    tagline: "Don't forget what matters.",
    nav: {
      home: 'Home',
      myPlans: 'My plans',
      addPlan: 'Add plan',
    },
    hero: {
      badge: 'Simple student planner',
      title: 'Your plans, always at hand',
      subtitle: 'Add important tasks and track how much time is left before them.',
      addBtn: '+ Add plan',
      viewPlansBtn: 'My plans',
      statsTotal: 'Total plans',
      statsToday: 'Due today',
      statsCompleted: 'Completed',
    },
    nearest: {
      sectionTitle: 'Nearest Plan',
      badge: 'Most Urgent',
      timeLeft: 'Time left',
      overdue: 'Overdue',
      completed: 'Completed',
      nowHappening: 'Happening now',
      allDoneTitle: 'All upcoming plans completed! ✨',
      allDoneSubtitle: 'Great progress! Add a new task or take a well-deserved break.',
      addFirstPlan: 'Create new plan',
      markDone: 'Mark Done',
      edit: 'Edit',
      days: 'days',
      hours: 'hours',
      minutes: 'minutes',
      seconds: 'seconds',
    },
    countdownUnits: {
      daysShort: 'd',
      hoursShort: 'h',
      minutesShort: 'm',
      secondsShort: 's',
      daysPlural: (n: number) => (n === 1 ? '1 day' : `${n} days`),
      hoursPlural: (n: number) => (n === 1 ? '1 hour' : `${n} hours`),
    },
    plansSection: {
      title: 'My plans',
      subtitle: 'All your homework, exams, projects, and personal tasks in one place',
      filterAll: 'All plans',
      filterUpcoming: 'Upcoming',
      filterOverdue: 'Overdue',
      filterCompleted: 'Completed',
      searchPlaceholder: 'Search by title or note...',
      sortBy: 'Sort by',
      sortNearest: 'Earliest first',
      sortFurthest: 'Latest first',
      sortTitle: 'Alphabetical',
      nearestBadge: 'Next Up',
      overdueBadge: 'Overdue',
      completedBadge: 'Completed',
      editBtn: 'Edit',
      deleteBtn: 'Delete',
      toggleComplete: 'Mark as completed',
      toggleIncomplete: 'Mark as active',
      noteLabel: 'Note',
    },
    emptyState: {
      title: 'No plans yet',
      subtitle: 'Add your first plan so you don’t forget anything.',
      button: '+ Add plan',
      filterEmptyTitle: 'No plans in this view',
      filterEmptySubtitle: 'Try switching the filter tab or clearing the search query',
      clearSearch: 'Clear search',
    },
    modal: {
      addTitle: 'Add Plan',
      editTitle: 'Edit Plan',
      titleLabel: 'Plan title',
      titlePlaceholder: 'e.g., Prepare presentation',
      dateLabel: 'Date',
      timeLabel: 'Time',
      categoryLabel: 'Category',
      noteLabel: 'Note (optional)',
      notePlaceholder: 'Additional information',
      quickPresets: 'Quick pick',
      today: 'Today',
      tomorrow: 'Tomorrow',
      in3Days: '+3 days',
      inWeek: '+1 week',
      saveBtn: 'Save plan',
      cancelBtn: 'Cancel',
      errTitle: 'Please enter a plan title',
      errDate: 'Please choose a date',
      errTime: 'Please choose a time',
    },
    deleteModal: {
      title: 'Delete plan?',
      message: 'Are you sure you want to delete this plan? This action cannot be undone.',
      confirmBtn: 'Delete',
      cancelBtn: 'Cancel',
    },
    categories: {
      study: '📚 Homework & Study',
      exam: '🎓 Exam & Test',
      project: '💻 Project',
      meeting: '👥 Meeting',
      personal: '✨ Personal',
      other: '📌 Other',
    },
    toasts: {
      added: 'Plan added successfully ✨',
      updated: 'Plan saved 👍',
      deleted: 'Plan deleted 🗑️',
      completed: 'Great job! Plan completed 🎉',
      uncompleted: 'Plan marked as active',
      demoRestored: 'Sample plans restored',
    },
    footer: {
      description: 'Plan Reminder — clean, minimal task tracker and countdown for students.',
      restoreDemo: 'Restore sample plans',
      builtFor: 'Stay ahead of deadlines with peace of mind',
      allRightsReserved: 'All data is stored locally in your browser.',
    },
  },

  ko: {
    appName: 'Plan Reminder',
    tagline: '중요한 일을 잊지 마세요.',
    nav: {
      home: '홈',
      myPlans: '내 계획',
      addPlan: '계획 추가',
    },
    hero: {
      badge: '학생을 위한 간편 플래너',
      title: '계획을 한눈에 확인하세요',
      subtitle: '중요한 일정을 추가하고 남은 시간을 실시간으로 확인하세요.',
      addBtn: '+ 계획 추가',
      viewPlansBtn: '내 계획',
      statsTotal: '전체 계획',
      statsToday: '오늘 마감',
      statsCompleted: '완료됨',
    },
    nearest: {
      sectionTitle: '가장 가까운 일정',
      badge: '가장 임박한 일정',
      timeLeft: '남은 시간',
      overdue: '기한 지남',
      completed: '완료됨',
      nowHappening: '진행 중',
      allDoneTitle: '모든 예정된 계획을 마쳤습니다! ✨',
      allDoneSubtitle: '멋진 성과예요! 새 계획을 추가하거나 편안한 휴식을 즐기세요.',
      addFirstPlan: '새 계획 추가',
      markDone: '완료하기',
      edit: '수정',
      days: '일',
      hours: '시간',
      minutes: '분',
      seconds: '초',
    },
    countdownUnits: {
      daysShort: '일',
      hoursShort: '시간',
      minutesShort: '분',
      secondsShort: '초',
      daysPlural: (n: number) => `${n}일`,
      hoursPlural: (n: number) => `${n}시간`,
    },
    plansSection: {
      title: '내 계획',
      subtitle: '과제, 시험, 프로젝트 및 개인 일정을 체계적으로 관리하세요',
      filterAll: '전체 계획',
      filterUpcoming: '예정됨',
      filterOverdue: '기한 지남',
      filterCompleted: '완료됨',
      searchPlaceholder: '제목이나 메모 검색...',
      sortBy: '정렬',
      sortNearest: '가까운 순',
      sortFurthest: '먼 순',
      sortTitle: '이름순',
      nearestBadge: '다음 일정',
      overdueBadge: '기한 지남',
      completedBadge: '완료됨',
      editBtn: '수정',
      deleteBtn: '삭제',
      toggleComplete: '완료로 표시',
      toggleIncomplete: '다시 진행하기',
      noteLabel: '메모',
    },
    emptyState: {
      title: '아직 계획이 없어요',
      subtitle: '첫 번째 계획을 추가하고 중요한 일을 잊지 마세요.',
      button: '+ 계획 추가',
      filterEmptyTitle: '해당하는 계획이 없습니다',
      filterEmptySubtitle: '필터 탭을 바꾸거나 검색어를 지워보세요',
      clearSearch: '검색 초기화',
    },
    modal: {
      addTitle: '계획 추가',
      editTitle: '계획 수정',
      titleLabel: '계획 제목',
      titlePlaceholder: '예: 발표 자료 준비하기',
      dateLabel: '날짜',
      timeLabel: '시간',
      categoryLabel: '카테고리',
      noteLabel: '메모 (선택사항)',
      notePlaceholder: '추가 세부정보',
      quickPresets: '빠른 선택',
      today: '오늘',
      tomorrow: '내일',
      in3Days: '3일 후',
      inWeek: '1주일 후',
      saveBtn: '계획 저장',
      cancelBtn: '취소',
      errTitle: '계획 제목을 입력해 주세요',
      errDate: '날짜를 선택해 주세요',
      errTime: '시간을 선택해 주세요',
    },
    deleteModal: {
      title: '계획을 삭제할까요?',
      message: '이 계획을 정말 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.',
      confirmBtn: '삭제',
      cancelBtn: '취소',
    },
    categories: {
      study: '📚 과제 및 학업',
      exam: '🎓 시험 및 평가',
      project: '💻 프로젝트',
      meeting: '👥 모임 및 약속',
      personal: '✨ 개인 일정',
      other: '📌 기타',
    },
    toasts: {
      added: '계획이 성공적으로 추가되었습니다 ✨',
      updated: '계획이 저장되었습니다 👍',
      deleted: '계획이 삭제되었습니다 🗑️',
      completed: '수고하셨습니다! 계획 완료 🎉',
      uncompleted: '계획이 다시 활성화되었습니다',
      demoRestored: '예시 계획이 복원되었습니다',
    },
    footer: {
      description: 'Plan Reminder — 학생들을 위한 미니멀하고 직관적인 일정 플래너.',
      restoreDemo: '예시 데이터 복원',
      builtFor: '마감 기한을 놓치지 않도록 도와줍니다',
      allRightsReserved: '모든 데이터는 브라우저 로컬 저장소에 안전하게 보관됩니다.',
    },
  },
};

export const uk = {
  // App
  appName: "PillCare",
  appTagline: "Ніколи не пропусти прийом ліків",

  // Navigation
  nav: {
    dashboard: "Головна",
    medications: "Ліки",
    calendar: "Календар",
    history: "Журнал",
    settings: "Налаштування",
  },

  // Landing
  landing: {
    hero: {
      badge: "Безкоштовний додаток",
      title: "Ніколи не пропусти прийом ліків",
      subtitle: "PillCare — твій особистий помічник для прийому ліків. Просто, зручно, надійно.",
      cta: "Почати безкоштовно",
      ctaSecondary: "Дізнатись більше",
    },
    features: {
      title: "Все що потрібно",
      subtitle: "Простий і зрозумілий додаток для всієї родини",
      items: [
        {
          title: "Нагадування",
          description: "Отримуй push-повідомлення вчасно, навіть коли телефон заблокований",
        },
        {
          title: "Розклад",
          description: "Налаштуй будь-який режим прийому: щодня, кілька разів на день або по днях тижня",
        },
        {
          title: "Відстеження",
          description: "Веди журнал прийомів і дивись статистику своєї послідовності",
        },
        {
          title: "Офлайн",
          description: "Додаток працює без інтернету — твій розклад завжди під рукою",
        },
      ],
    },
    benefits: {
      title: "Чому PillCare?",
      items: [
        "Простий інтерфейс для людей будь-якого віку",
        "Підтримка кількох мов",
        "Темна та світла теми",
        "Встановлюється на телефон як звичайний додаток",
        "Безкоштовно та без реклами",
      ],
    },
    cta: {
      title: "Почніть прямо зараз",
      subtitle: "Приєднуйтесь до тисяч людей, які піклуються про своє здоров'я",
      button: "Відкрити додаток",
    },
  },

  // Dashboard
  dashboard: {
    greeting: {
      morning: "Добрий ранок",
      afternoon: "Добрий день",
      evening: "Добрий вечір",
    },
    today: "Сьогодні",
    todayMeds: "Ліки на сьогодні",
    nextMed: "Наступний прийом",
    noMedsToday: "На сьогодні ліків немає",
    allTaken: "Всі ліки прийнято! Молодець! 🎉",
    progress: "Прогрес дня",
    taken: "Прийнято",
    missed: "Пропущено",
    upcoming: "Очікується",
    streak: "Серія",
    streakDays: "днів",
    markTaken: "Прийнято",
    markSkipped: "Пропустити",
    noMedications: "У вас ще немає ліків",
    addFirstMed: "Додати перший препарат",
  },

  // Medications
  medications: {
    title: "Мої ліки",
    add: "Додати ліки",
    edit: "Редагувати",
    delete: "Видалити",
    deleteConfirm: "Ви впевнені, що хочете видалити цей препарат?",
    deleteConfirmDesc: "Ця дія незворотна. Весь журнал прийомів буде видалено.",
    noMedications: "У вас ще немає ліків",
    noMedicationsDesc: "Додайте перший препарат, щоб почати відстеження",
    search: "Пошук ліків...",
    active: "Активні",
    inactive: "Неактивні",
    form: {
      name: "Назва препарату",
      namePlaceholder: "Наприклад: Вітамін C",
      dosage: "Дозування",
      dosagePlaceholder: "Наприклад: 500",
      unit: "Одиниця",
      notes: "Нотатки",
      notesPlaceholder: "Необов'язково: особливі вказівки",
      color: "Колір",
      icon: "Іконка",
      stock: "Кількість в запасі",
      stockPlaceholder: "Наприклад: 30",
      lowStockAlert: "Попередження про низький запас",
      schedule: "Розклад",
      frequency: "Частота",
      times: "Час прийому",
      addTime: "Додати час",
      weekdays: "Дні тижня",
      save: "Зберегти",
      cancel: "Скасувати",
      saving: "Збереження...",
    },
    frequency: {
      DAILY: "Щодня",
      TWICE_DAILY: "Двічі на день",
      THREE_TIMES_DAILY: "Тричі на день",
      WEEKLY: "Щотижня",
      CUSTOM: "Власний графік",
    },
    units: ["мг", "г", "мл", "краплі", "таблетки", "капсули", "МО", "мкг"],
    weekdays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"],
  },

  // Calendar
  calendar: {
    title: "Календар",
    today: "Сьогодні",
    taken: "Прийнято",
    missed: "Пропущено",
    pending: "Очікується",
    noEvents: "На цей день нічого не заплановано",
  },

  // History
  history: {
    title: "Журнал прийомів",
    taken: "Прийнято",
    missed: "Пропущено",
    skipped: "Пропущено",
    pending: "Очікується",
    noHistory: "Журнал порожній",
    noHistoryDesc: "Коли ви почнете приймати ліки, тут з'явиться журнал",
    takenAt: "Прийнято о",
    scheduledAt: "Заплановано на",
    filter: {
      all: "Всі",
      taken: "Прийнято",
      missed: "Пропущено",
      pending: "Очікується",
    },
  },

  // Settings
  settings: {
    title: "Налаштування",
    profile: "Профіль",
    name: "Ім'я",
    namePlaceholder: "Ваше ім'я",
    notifications: "Сповіщення",
    notificationsEnabled: "Увімкнути сповіщення",
    notificationsDesc: "Отримуй нагадування про прийом ліків",
    language: "Мова",
    theme: "Тема",
    themeLight: "Світла",
    themeDark: "Темна",
    themeSystem: "Системна",
    about: "Про додаток",
    version: "Версія",
    save: "Зберегти",
    saved: "Збережено!",
    requestPermission: "Дозволити сповіщення",
    permissionGranted: "Сповіщення увімкнено ✓",
    permissionDenied: "Сповіщення заблоковано. Дозвольте у налаштуваннях браузера.",
  },

  // Common
  common: {
    loading: "Завантаження...",
    error: "Помилка",
    retry: "Повторити",
    back: "Назад",
    close: "Закрити",
    confirm: "Підтвердити",
    yes: "Так",
    no: "Ні",
    ok: "OK",
    skip: "Пропустити",
    next: "Далі",
    done: "Готово",
    add: "Додати",
    edit: "Редагувати",
    delete: "Видалити",
    save: "Зберегти",
    cancel: "Скасувати",
    search: "Пошук",
    all: "Всі",
    today: "Сьогодні",
    noData: "Немає даних",
  },

  // Notifications
  notifications: {
    reminderTitle: "Час прийняти ліки 💊",
    reminderBody: "Пора прийняти {medication}",
    missedTitle: "Ви пропустили прийом ліків",
    missedBody: "{medication} — запланований прийом пропущено",
  },

  // Progress
  progress: {
    title: "Прогрес",
    week: "Цей тиждень",
    month: "Цей місяць",
    allTime: "За весь час",
    consistency: "Послідовність",
    totalTaken: "Всього прийнято",
    totalMissed: "Всього пропущено",
    bestStreak: "Найкраща серія",
    currentStreak: "Поточна серія",
  },
};

export type Translations = typeof uk;

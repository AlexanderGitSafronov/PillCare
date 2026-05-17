import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Політика Cookies — PillCare",
  description:
    "Дізнайтеся, які cookies використовує PillCare та як ними керувати.",
  robots: { index: true, follow: true },
};

export default function CookiesPage() {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">
        Політика Cookies
      </h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Набрала чинності: 17 травня 2025 року
      </p>

      {/* 1 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">1. Що таке cookies?</h2>
        <p className="leading-relaxed text-muted-foreground">
          Cookies — це невеликі текстові файли або записи у сховищі браузера
          (localStorage / sessionStorage), які веб-сайти зберігають на вашому
          пристрої. Вони дозволяють застосунку «запам&apos;ятовувати» ваші
          налаштування та підтримувати сесію між відвідуваннями.
        </p>
      </section>

      {/* 2 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">
          2. Які cookies ми використовуємо
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          PillCare використовує виключно{" "}
          <strong className="text-foreground">необхідні</strong> cookies та
          записи локального сховища — ті, без яких Сервіс не може коректно
          функціонувати. Вони не використовуються для відстеження чи реклами.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 pr-4 text-left font-semibold">Назва</th>
                <th className="py-2 pr-4 text-left font-semibold">Тип сховища</th>
                <th className="py-2 pr-4 text-left font-semibold">Призначення</th>
                <th className="py-2 text-left font-semibold">Категорія</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/40">
                <td className="py-3 pr-4 font-mono text-xs text-foreground">
                  pillcare-settings
                </td>
                <td className="py-3 pr-4">localStorage</td>
                <td className="py-3 pr-4">
                  Зберігає налаштування застосунку: мову інтерфейсу, тему
                  оформлення (світла/темна/системна) та унікальний ідентифікатор
                  користувача (userId).
                </td>
                <td className="py-3">
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-900/40 dark:text-green-400">
                    Необхідний
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-xs text-foreground">
                  __session
                </td>
                <td className="py-3 pr-4">sessionStorage</td>
                <td className="py-3 pr-4">
                  Зберігає тимчасові дані поточної сесії (стан форм, кеш
                  навігації). Автоматично видаляється після закриття вкладки.
                </td>
                <td className="py-3">
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-900/40 dark:text-green-400">
                    Необхідний
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 3 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">3. Сторонні cookies</h2>
        <p className="leading-relaxed text-muted-foreground">
          PillCare <strong className="text-foreground">не використовує</strong>{" "}
          жодних сторонніх cookies — аналітичних, маркетингових, рекламних чи
          соціальних мереж. Усі записи у сховищі браузера належать виключно
          домену <code className="text-foreground">pillcare.app</code>.
        </p>
      </section>

      {/* 4 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">4. Управління cookies</h2>
        <p className="mb-3 leading-relaxed text-muted-foreground">
          Ви можете керувати або видалити записи сховища браузера у будь-який
          момент через налаштування браузера:
        </p>
        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
          <li>
            <strong className="text-foreground">Chrome:</strong> Налаштування →
            Конфіденційність та безпека → Файли cookie та інші дані сайту
          </li>
          <li>
            <strong className="text-foreground">Firefox:</strong> Налаштування →
            Приватність і захист → Файли cookie і дані сайтів
          </li>
          <li>
            <strong className="text-foreground">Safari:</strong> Налаштування →
            Конфіденційність → Керувати даними веб-сайтів
          </li>
          <li>
            <strong className="text-foreground">Edge:</strong> Налаштування →
            Файли cookie і дозволи сайту → Файли cookie і збережені дані
          </li>
        </ul>
        <p className="mt-3 text-sm text-muted-foreground">
          Зверніть увагу: видалення необхідних записів може призвести до
          некоректної роботи Сервісу (наприклад, скидання теми та мови).
        </p>
      </section>

      {/* 5 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">
          5. Зміни до цієї політики
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Якщо ми змінимо перелік або призначення cookies, ми оновимо цю
          сторінку та повідомимо вас через оголошення в застосунку.
        </p>
      </section>

      {/* 6 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">6. Контакт</h2>
        <p className="leading-relaxed text-muted-foreground">
          З питань щодо використання cookies:{" "}
          <a
            href="mailto:privacy@pillcare.app"
            className="text-primary underline-offset-4 hover:underline"
          >
            privacy@pillcare.app
          </a>
          .
        </p>
      </section>
    </article>
  );
}

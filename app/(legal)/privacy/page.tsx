import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Політика конфіденційності — PillCare",
  description:
    "Ознайомтесь із тим, які дані збирає PillCare, як ми їх використовуємо та які права ви маєте відповідно до GDPR.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">
        Політика конфіденційності
      </h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Набрала чинності: 17 травня 2025 року
      </p>

      {/* 1 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">1. Хто ми є</h2>
        <p className="leading-relaxed text-muted-foreground">
          <strong className="text-foreground">PillCare</strong> — безкоштовний
          веб-застосунок для нагадування про прийом ліків. Відповідальним за
          обробку персональних даних є команда розробників PillCare. З питань
          конфіденційності звертайтеся за адресою{" "}
          <a
            href="mailto:privacy@pillcare.app"
            className="text-primary underline-offset-4 hover:underline"
          >
            privacy@pillcare.app
          </a>
          .
        </p>
      </section>

      {/* 2 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">2. Які дані ми збираємо</h2>

        <h3 className="mb-2 mt-4 text-base font-semibold">
          2.1 Технічні дані
        </h3>
        <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
          <li>IP-адреса (для захисту від зловживань і логування помилок)</li>
          <li>User Agent браузера (для сумісності)</li>
          <li>Дата та час запитів</li>
        </ul>

        <h3 className="mb-2 mt-4 text-base font-semibold">
          2.2 Дані про ліки та розклад
        </h3>
        <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
          <li>Назви ліків, дозування та форма випуску</li>
          <li>Розклад прийому (час, частота, тривалість курсу)</li>
          <li>Журнал прийнятих/пропущених доз</li>
        </ul>

        <h3 className="mb-2 mt-4 text-base font-semibold">
          2.3 Налаштування (Preferences)
        </h3>
        <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
          <li>Мова інтерфейсу</li>
          <li>Тема оформлення (світла / темна / системна)</li>
          <li>Унікальний ідентифікатор користувача (userId)</li>
        </ul>

        <p className="mt-3 text-sm text-muted-foreground">
          <strong className="text-foreground">Ми не збираємо</strong> ім&apos;я, прізвище,
          номер телефону, електронну пошту чи інші прямі ідентифікатори, якщо
          ви не надаєте їх добровільно під час звернення в підтримку.
        </p>
      </section>

      {/* 3 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">3. Мета обробки даних</h2>
        <p className="leading-relaxed text-muted-foreground">
          Усі зібрані дані використовуються виключно для надання сервісу
          нагадувань про прийом ліків: відображення розкладу, ведення журналу
          доз та персоналізації інтерфейсу. Ми не використовуємо ваші дані для
          реклами, профілювання чи передачі третім особам з комерційною метою.
        </p>
      </section>

      {/* 4 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">4. Правова основа обробки</h2>
        <p className="leading-relaxed text-muted-foreground">
          Обробка персональних даних здійснюється на підставі{" "}
          <strong className="text-foreground">
            ст.&thinsp;6(1)(b) GDPR — виконання договору
          </strong>
          : користуючись PillCare, ви укладаєте з нами угоду про надання
          послуги, і обробка даних є необхідною умовою її виконання.
        </p>
      </section>

      {/* 5 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">5. Процесори даних</h2>
        <p className="mb-3 leading-relaxed text-muted-foreground">
          Для надання послуги ми залучаємо таких субпроцесорів:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 pr-4 text-left font-semibold">Компанія</th>
                <th className="py-2 pr-4 text-left font-semibold">Роль</th>
                <th className="py-2 text-left font-semibold">Регіон</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/40">
                <td className="py-2 pr-4 font-medium text-foreground">
                  Railway Inc.
                </td>
                <td className="py-2 pr-4">Хостинг застосунку</td>
                <td className="py-2">США</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-foreground">
                  Neon Inc.
                </td>
                <td className="py-2 pr-4">База даних (PostgreSQL)</td>
                <td className="py-2">AWS EU-Central-1</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Усі субпроцесори пов&apos;язані з нами угодами про обробку даних (DPA) та
          забезпечують відповідний рівень захисту персональних даних.
        </p>
      </section>

      {/* 6 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">6. Ваші права</h2>
        <p className="mb-3 leading-relaxed text-muted-foreground">
          Відповідно до GDPR ви маєте такі права щодо ваших персональних даних:
        </p>
        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
          <li>
            <strong className="text-foreground">Доступ</strong> — отримати
            копію ваших даних, якими ми володіємо.
          </li>
          <li>
            <strong className="text-foreground">Виправлення</strong> —
            виправити неточні або неповні дані.
          </li>
          <li>
            <strong className="text-foreground">Видалення</strong> — видалити
            ваші дані («право на забуття»).
          </li>
          <li>
            <strong className="text-foreground">Обмеження</strong> — обмежити
            обробку ваших даних у певних випадках.
          </li>
          <li>
            <strong className="text-foreground">Заперечення</strong> —
            заперечити проти обробки ваших даних.
          </li>
          <li>
            <strong className="text-foreground">Портабельність</strong> —
            отримати ваші дані у структурованому машинозчитуваному форматі.
          </li>
        </ul>
        <p className="mt-3 text-sm text-muted-foreground">
          Для реалізації будь-якого з цих прав надішліть запит на{" "}
          <a
            href="mailto:privacy@pillcare.app"
            className="text-primary underline-offset-4 hover:underline"
          >
            privacy@pillcare.app
          </a>
          . Ми відповімо протягом 30 днів.
        </p>
      </section>

      {/* 7 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">7. Зберігання даних</h2>
        <p className="leading-relaxed text-muted-foreground">
          Ваші дані зберігаються до моменту видалення акаунта або протягом{" "}
          <strong className="text-foreground">2 років</strong> після останньої
          активності у застосунку — залежно від того, що настане раніше. Після
          цього дані безповоротно видаляються з усіх наших систем.
        </p>
      </section>

      {/* 8 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">8. Cookies</h2>
        <p className="leading-relaxed text-muted-foreground">
          PillCare використовує виключно{" "}
          <strong className="text-foreground">необхідні cookies</strong> для
          коректної роботи сервісу: зберігання налаштувань (мова, тема,
          userId) та сесійні дані. Ми не використовуємо аналітичні, маркетингові
          чи сторонні cookies. Детальніше — у нашій{" "}
          <a
            href="/cookies"
            className="text-primary underline-offset-4 hover:underline"
          >
            Політиці Cookies
          </a>
          .
        </p>
      </section>

      {/* 9 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">9. Безпека даних</h2>
        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
          <li>
            Усі дані передаються по зашифрованому з&apos;єднанню{" "}
            <strong className="text-foreground">TLS 1.3</strong>.
          </li>
          <li>
            Дані в базі зашифровані в стані спокою (encryption at rest).
          </li>
          <li>
            Доступ до виробничих систем обмежений і надається лише авторизованим
            членам команди.
          </li>
        </ul>
      </section>

      {/* 10 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">10. Вік користувачів</h2>
        <p className="leading-relaxed text-muted-foreground">
          PillCare призначений для осіб{" "}
          <strong className="text-foreground">від 13 років</strong>. Якщо нам
          стане відомо, що дані дитини молодше 13 років були зібрані без згоди
          батьків, ми негайно видалимо їх.
        </p>
      </section>

      {/* 11 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">11. Зміни до цієї політики</h2>
        <p className="leading-relaxed text-muted-foreground">
          Якщо ми внесемо суттєві зміни до цієї Політики конфіденційності, ми
          повідомимо вас через оголошення в застосунку та/або оновимо дату
          набрання чинності вгорі цієї сторінки.
        </p>
      </section>

      {/* 12 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">12. Контакт</h2>
        <p className="leading-relaxed text-muted-foreground">
          З будь-яких питань щодо захисту персональних даних звертайтеся:{" "}
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

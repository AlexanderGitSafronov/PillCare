import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Умови використання — PillCare",
  description:
    "Умови використання сервісу PillCare. Ознайомтесь із правилами користування застосунком.",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">
        Умови використання
      </h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Набрали чинності: 17 травня 2025 року
      </p>

      {/* 1 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">1. Прийняття умов</h2>
        <p className="leading-relaxed text-muted-foreground">
          Використовуючи застосунок <strong className="text-foreground">PillCare</strong>{" "}
          (далі — «Сервіс»), ви підтверджуєте, що прочитали, зрозуміли та
          погоджуєтесь із цими Умовами використання. Якщо ви не погоджуєтесь із
          будь-яким положенням, будь ласка, припиніть використання Сервісу.
        </p>
      </section>

      {/* 2 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">2. Опис сервісу</h2>
        <p className="leading-relaxed text-muted-foreground">
          PillCare — безкоштовний застосунок для нагадування про прийом ліків.
          Він дозволяє додавати препарати, налаштовувати розклад прийому та
          вести журнал доз.
        </p>
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/60 dark:bg-amber-950/30">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
            Медичне застереження
          </p>
          <p className="mt-1 text-sm leading-relaxed text-amber-700 dark:text-amber-500">
            <strong>PillCare не є медичним пристроєм і не надає медичних
            порад.</strong> Сервіс призначений виключно для особистої організації
            прийому ліків, призначених лікарем. Будь-які рішення щодо вашого
            здоров&apos;я приймайте виключно разом із кваліфікованим медичним
            фахівцем.
          </p>
        </div>
      </section>

      {/* 3 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">3. Акаунт і відповідальність</h2>
        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
          <li>
            Ви несете відповідальність за безпеку вашого пристрою та даних, що
            зберігаються в Сервісі.
          </li>
          <li>
            Ви зобов&apos;язуєтесь надавати достовірну інформацію та не
            передавати доступ до вашого акаунта третім особам.
          </li>
          <li>
            Ви використовуєте Сервіс лише для законних цілей і несете
            відповідальність за всі дії, вчинені під вашим акаунтом.
          </li>
        </ul>
      </section>

      {/* 4 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">4. Заборонені дії</h2>
        <p className="mb-3 leading-relaxed text-muted-foreground">
          Використовуючи Сервіс, ви погоджуєтесь НЕ:
        </p>
        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
          <li>
            Зловживати Сервісом, надсилати надмірну кількість запитів (DDoS,
            brute-force) або намагатися порушити його роботу.
          </li>
          <li>
            Використовувати Сервіс для розповсюдження спаму, шкідливого
            програмного забезпечення або небажаного контенту.
          </li>
          <li>
            Намагатися отримати несанкціонований доступ до даних інших
            користувачів або інфраструктури Сервісу.
          </li>
          <li>
            Реверсувати, декомпілювати або дизасемблювати будь-яку частину
            Сервісу.
          </li>
          <li>
            Перепродувати або комерційно використовувати Сервіс без письмового
            дозволу.
          </li>
        </ul>
      </section>

      {/* 5 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">
          5. Інтелектуальна власність
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Усі права на Сервіс, включаючи, але не обмежуючись, програмний код,
          дизайн, логотипи та торгові марки, належать команді PillCare або
          відповідним правовласникам. Вам надається обмежена, невиключна,
          непередавана ліцензія на використання Сервісу відповідно до цих Умов.
        </p>
      </section>

      {/* 6 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">6. Відмова від гарантій</h2>
        <p className="leading-relaxed text-muted-foreground">
          Сервіс надається «як є» (as is) без будь-яких явних або неявних
          гарантій. Ми не гарантуємо безперебійну роботу Сервісу, відсутність
          помилок чи придатність для конкретних цілей. Ви використовуєте Сервіс
          на власний ризик.
        </p>
      </section>

      {/* 7 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">7. Обмеження відповідальності</h2>
        <p className="leading-relaxed text-muted-foreground">
          У максимальній мірі, дозволеній чинним законодавством, команда
          PillCare не несе відповідальності за будь-які прямі, непрямі,
          випадкові, особливі або наслідкові збитки, що виникли внаслідок
          використання або неможливості використання Сервісу, включаючи збитки,
          пов&apos;язані із здоров&apos;ям унаслідок пропущених нагадувань або
          некоректних даних.
        </p>
      </section>

      {/* 8 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">8. Розірвання</h2>
        <p className="leading-relaxed text-muted-foreground">
          Ми залишаємо за собою право призупинити або припинити ваш доступ до
          Сервісу в будь-який час без попередження у разі порушення цих Умов.
          Ви можете в будь-який момент видалити свій акаунт та дані через
          налаштування Сервісу.
        </p>
      </section>

      {/* 9 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">9. Застосовне право</h2>
        <p className="leading-relaxed text-muted-foreground">
          Ці Умови регулюються законодавством{" "}
          <strong className="text-foreground">України</strong>. Будь-які спори,
          що виникають у зв&apos;язку з цими Умовами, вирішуються у відповідному суді
          за місцем знаходження Сервісу.
        </p>
      </section>

      {/* 10 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">10. Зміни до умов</h2>
        <p className="leading-relaxed text-muted-foreground">
          Ми можемо час від часу оновлювати ці Умови. Про суттєві зміни ми
          повідомимо через оголошення в застосунку. Продовження використання
          Сервісу після набрання змінами чинності означає прийняття нових Умов.
        </p>
      </section>

      {/* 11 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">11. Контакт</h2>
        <p className="leading-relaxed text-muted-foreground">
          З правових питань та питань щодо цих Умов звертайтеся:{" "}
          <a
            href="mailto:legal@pillcare.app"
            className="text-primary underline-offset-4 hover:underline"
          >
            legal@pillcare.app
          </a>
          .
        </p>
      </section>
    </article>
  );
}

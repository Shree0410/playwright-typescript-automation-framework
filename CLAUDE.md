# Project Knowledge File: Playwright TypeScript Automation Framework

Read this file fully before writing or changing any code in this repo.
Follow it on every task. If a request conflicts with this file, say so and ask before proceeding.

---

## 1. Purpose

Public GitHub portfolio project.
Owner: Shreehari N, QA Engineer & Release Owner, learning Playwright + TypeScript.
Repo: github.com/Shree0410/playwright-typescript-automation-framework

The repo must look like a small, clean, production-style test framework that the owner can fully explain in an interview.

---

## 2. Hard rules (never break these)

1. **Playwright Test runner only.** Do NOT add Jest, Mocha, Cypress, Selenium, or pytest.
2. **TypeScript only.** No Python files, no `conftest.py` / `conftest.ts`.
3. **Test files end in `.spec.ts`** and live under `tests/ui/` or `tests/api/`.
4. **Page Object Model.** All UI locators and UI actions live in `pages/`. Test files contain only `test(...)` blocks, assertions and calls to page-object methods.
5. **Each page class holds only actions that happen on that page.** Login belongs in `LoginPage`, logout belongs in `InventoryPage`.
6. **No hardcoded sleeps** (`waitForTimeout`). Use Playwright auto-waiting and web-first assertions.
7. **No secrets or real credentials.** Only the public SauceDemo demo credentials.
8. **README must only describe things that exist in the repo.** Update the README in the same change that adds a feature.
9. **Never commit** `node_modules/`, `playwright-report/`, `test-results/`, `.claude/`.
10. **Keep code simple and readable.** Prefer clear, short code; add a one-line comment where a Playwright concept is non-obvious.
11. **Explain as you build.** After each task, summarise what each new or changed file does and why.

---

## 3. Tech stack

| Layer | Tool |
|---|---|
| Language | TypeScript |
| Test runner / assertions | `@playwright/test` |
| UI target | https://www.saucedemo.com |
| API target | https://jsonplaceholder.typicode.com (no API key needed) |
| API testing | Playwright `request` fixture (no Axios, no node-fetch) |
| Reports | Playwright HTML reporter |
| CI/CD | GitHub Actions |
| Code quality | ESLint (planned, add only when asked) |

API note: JSONPlaceholder fakes writes. POST returns 201, PUT returns 200, DELETE returns **200** with `{}` (not 204),
and nothing is saved. ReqRes was not used because it may require an API key, especially from CI runners.

---

## 4. Test data

All shared data lives in `test_data/users.json`. SauceDemo password for all users: `secret_sauce`.

| Username | Behaviour |
|---|---|
| `standard_user` | Normal valid login |
| `locked_out_user` | Login blocked with a "locked out" error |
| `problem_user` | Login works, UI has known bugs afterwards |
| `performance_glitch_user` | Login works but is slow |

SauceDemo error texts asserted in tests:
- Invalid credentials: `Epic sadface: Username and password do not match any user in this service`
- Locked out: `Epic sadface: Sorry, this user has been locked out.`
- Empty username: `Epic sadface: Username is required`
- Empty password: `Epic sadface: Password is required`
- Checkout: `Error: First Name is required`, `Error: Last Name is required`, `Error: Postal Code is required`

---

## 5. Folder structure

```
playwright-typescript-automation-framework/
├── .github/workflows/test_pipeline.yml
├── pages/        base_page.ts, login_page.ts, inventory_page.ts, cart_page.ts, checkout_page.ts
├── tests/ui/     test_login.spec.ts, test_cart.spec.ts, test_checkout.spec.ts
├── tests/api/    test_users_api.spec.ts
├── test_data/    users.json
├── .gitignore, package.json, package-lock.json, playwright.config.ts, tsconfig.json, CLAUDE.md, README.md
```

Do not create folders or files outside this structure without asking.

---

## 6. Coding conventions

### Page objects
- One class per page, file name in snake_case (`login_page.ts`), class name in PascalCase (`LoginPage`); every page extends `BasePage`.
- Constructor takes `page: Page` and defines locators as `readonly` properties.
- Locator priority: `getByRole` / `getByTestId` / `[data-test="..."]`, then `#id`, then CSS.
- Methods are named for user intent: `login()`, `logout()`, `addToCart()`.
- Page objects contain no assertions.

### Tests
- Group with `test.describe(...)`, set up with `test.beforeEach(...)`.
- Titles read like sentences: `should show locked out error for locked_out_user`.
- One behaviour per test; tests are independent and run in parallel.
- Use `baseURL`, so tests call `page.goto('/')`.

### API tests
- Use the `request` fixture with the full API URL (baseURL points at SauceDemo).
- Assert status code, body fields and, where useful, headers. Cover happy path and a negative case.

---

## 7. Working with the owner

- Ask one short clarifying question if a request is ambiguous; otherwise proceed.
- Show the commands to run and the expected output.
- When a test fails, explain the cause in plain language before fixing it.
- Make the smallest change that solves the task; do not rewrite working files unless asked.
- Do not claim something works until it has been run.
- Add a CI status badge to the README only after the workflow has run green at least once.

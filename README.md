# Playwright TypeScript Automation Framework

A small, production-style test automation framework built with **Playwright Test** and **TypeScript**.
It covers UI tests for the [SauceDemo](https://www.saucedemo.com) web shop (login, cart and checkout) using the
**Page Object Model**, and REST API tests against [JSONPlaceholder](https://jsonplaceholder.typicode.com) using
Playwright's built-in `request` fixture. Tests run in parallel, produce an HTML report, and run automatically on
every push and pull request through GitHub Actions.

## Tech stack

| Layer | Tool |
|---|---|
| Language | TypeScript |
| Test runner and assertions | `@playwright/test` |
| UI tests | Playwright browser automation (Chromium) |
| API tests | Playwright `request` fixture |
| Design pattern | Page Object Model |
| Reports | Playwright HTML reporter |
| CI/CD | GitHub Actions |

## Folder structure

```
playwright-typescript-automation-framework/
├── .github/
│   └── workflows/
│       └── test_pipeline.yml     # CI pipeline: install, run tests, upload report
├── pages/                        # Page objects: locators and actions per page
│   ├── base_page.ts
│   ├── login_page.ts
│   ├── inventory_page.ts
│   ├── cart_page.ts
│   └── checkout_page.ts
├── tests/
│   ├── ui/                       # Browser tests for SauceDemo
│   │   ├── test_login.spec.ts
│   │   ├── test_cart.spec.ts
│   │   └── test_checkout.spec.ts
│   └── api/                      # REST API tests
│       └── test_users_api.spec.ts
├── test_data/
│   └── users.json                # Credentials and payloads used by the tests
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts          # Base URL, parallelism, retries, reporter, browsers
├── tsconfig.json
├── CLAUDE.md                     # Project conventions for AI-assisted changes
└── README.md
```

## Applications under test

| Application | Type | What is tested |
|---|---|---|
| [SauceDemo](https://www.saucedemo.com) | Demo e-commerce web app | Login (valid, invalid, locked out, empty fields, logout), cart badge and cart page, checkout happy path, form validation and cancel |
| [JSONPlaceholder](https://jsonplaceholder.typicode.com) | Free fake REST API | `/users` endpoint: GET list, GET single, POST, PUT, DELETE and a 404 negative case |

SauceDemo's public demo credentials (password `secret_sauce`) are used; no real credentials are stored in this repo.

## Test coverage

| Spec file | Tests |
|---|---|
| `tests/ui/test_login.spec.ts` | 9 |
| `tests/ui/test_cart.spec.ts` | 4 |
| `tests/ui/test_checkout.spec.ts` | 5 |
| `tests/api/test_users_api.spec.ts` | 6 |
| **Total** | **24** |

## How to run locally

Prerequisite: [Node.js](https://nodejs.org) 20 or later.

```bash
git clone https://github.com/Shree0410/playwright-typescript-automation-framework.git
cd playwright-typescript-automation-framework
npm install
npx playwright install
npx playwright test
npx playwright show-report
```

Useful variations:

```bash
npx playwright test tests/ui          # UI tests only
npx playwright test tests/api         # API tests only
npx playwright test --headed          # watch the browser
npx playwright test -g "locked out"   # run tests whose title matches
```

## CI/CD pipeline

The workflow in `.github/workflows/test_pipeline.yml` runs on every push and pull request to `main`:

1. Checks out the code.
2. Sets up Node.js 20.
3. Installs dependencies with `npm ci` (exact versions from `package-lock.json`).
4. Installs the Chromium browser and its system dependencies.
5. Runs the full test suite (failed tests are retried up to 2 times on CI).
6. Uploads the HTML report as a build artifact named `playwright-report` (kept for 30 days), even when tests fail.

## Author

**Shreehari N** — QA Engineer & Release Owner

GitHub: [Shree0410](https://github.com/Shree0410)

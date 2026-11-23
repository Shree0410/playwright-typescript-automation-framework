# Playwright TypeScript Automation Framework

A production-style test automation framework built with **Playwright Test** and **TypeScript**. It tests the
[SauceDemo](https://www.saucedemo.com) web shop with UI, integration and visual tests using the **Page Object Model**,
and tests the [JSONPlaceholder](https://jsonplaceholder.typicode.com) REST API through a typed API client and
response-schema checks. Page objects and API clients are injected into tests through **custom Playwright fixtures**,
all test data lives in JSON files, and the suite runs in parallel on every push and pull request through GitHub Actions.

## Tech stack

| Layer | Tool |
|---|---|
| Language | TypeScript |
| Test runner and assertions | Playwright Test (`@playwright/test`) |
| UI, integration and visual tests | Playwright browser automation (Chromium) |
| API tests | Playwright `request` fixture, wrapped in a typed API client |
| Visual testing | Playwright `toHaveScreenshot` |
| Design patterns | Page Object Model, custom fixtures, API client |
| Reports | Playwright HTML Reporter |
| CI/CD | GitHub Actions |

## Folder structure

```
playwright-typescript-automation-framework/
├── .github/
│   └── workflows/
│       └── test_pipeline.yml          # CI: install, run all tests, upload the HTML report
├── src/
│   ├── fixtures/
│   │   └── test_fixtures.ts           # Custom fixtures: page objects, logged-in page, API client
│   ├── pages/                         # Page objects: locators and actions per page
│   │   ├── base_page.ts
│   │   ├── login_page.ts
│   │   ├── inventory_page.ts
│   │   ├── cart_page.ts
│   │   └── checkout_page.ts
│   ├── api/
│   │   ├── clients/
│   │   │   └── users_client.ts        # Methods for the /users endpoints
│   │   └── schemas/
│   │       └── user_schema.ts         # Expected user shape + validator
│   ├── utils/
│   │   ├── test_data.ts               # Typed access to the files in test-data/
│   │   └── price.ts                   # Price parsing and summing helpers
│   ├── config/
│   │   └── env.ts                     # Base URLs, overridable by environment variables
│   └── types/
│       └── index.ts                   # Shared TypeScript types
├── tests/
│   ├── ui/                            # Single-page UI tests
│   │   ├── test_login.spec.ts
│   │   ├── test_cart.spec.ts
│   │   └── test_checkout.spec.ts
│   ├── api/
│   │   └── test_users_api.spec.ts     # REST API tests (no browser)
│   ├── integration/
│   │   └── test_purchase_flow.spec.ts # Multi-page journeys with cross-page data checks
│   ├── visual/
│   │   └── test_product_images.spec.ts
│   └── __screenshots__/               # Baseline images for the visual tests
├── test-data/
│   ├── users.json
│   ├── checkout.json
│   └── api_users.json
├── .gitignore
├── CLAUDE.md                          # Project conventions for AI-assisted changes
├── package.json
├── package-lock.json
├── playwright.config.ts               # Projects, parallelism, retries, reporter, snapshot settings
├── tsconfig.json
└── README.md
```

## How it fits together

- **Tests import `test` from `src/fixtures/test_fixtures.ts`**, not from `@playwright/test`. Asking for a fixture by
  name, e.g. `async ({ loginPage }) => …`, gives the test a ready page object. `loggedInInventoryPage` also logs in
  first, so cart, checkout and integration tests start on the Products page.
- **Two Playwright projects** in `playwright.config.ts`: `chromium` runs `ui`, `integration` and `visual` against
  SauceDemo; `api` runs `tests/api` without a browser, with JSONPlaceholder as its `baseURL`.
- **Base URLs** come from `src/config/env.ts` and can be overridden with `UI_BASE_URL` / `API_BASE_URL`.

## Applications under test

| Application | Type | What is tested |
|---|---|---|
| [SauceDemo](https://www.saucedemo.com) | Demo e-commerce web app | Login, cart, checkout, full purchase journey, product images |
| [JSONPlaceholder](https://jsonplaceholder.typicode.com) | Free fake REST API | `/users`: GET list, schema of every user, GET single, POST, PUT, DELETE, 404 |

SauceDemo's public demo credentials (password `secret_sauce`) are used; no real credentials are stored in this repo.

## Test coverage

| Spec file | Type | Tests |
|---|---|---|
| `tests/ui/test_login.spec.ts` | UI | 9 |
| `tests/ui/test_cart.spec.ts` | UI | 4 |
| `tests/ui/test_checkout.spec.ts` | UI | 5 |
| `tests/integration/test_purchase_flow.spec.ts` | Integration | 2 |
| `tests/visual/test_product_images.spec.ts` | Visual | 3 |
| `tests/api/test_users_api.spec.ts` | API | 7 |
| **Total** | | **30** |

Highlights:
- The integration test reads product prices on the Products page and checks that the checkout "Item total" equals
  their sum.
- The visual tests compare product photos with saved baselines, and prove the check works by detecting the wrong
  image that SauceDemo's `problem_user` shows.
- API responses are checked against a schema, so a missing or wrongly typed field is reported by name.

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
npx playwright test --project=api                # API tests only
npx playwright test --project=chromium           # browser tests only
npx playwright test tests/integration            # one folder
npx playwright test --headed                     # watch the browser
npx playwright test -g "locked out"              # tests whose title matches
npx playwright test tests/visual --update-snapshots   # re-create visual baselines
```

## CI/CD pipeline

The workflow in `.github/workflows/test_pipeline.yml` runs on every push and pull request to `main`:

1. Checks out the code.
2. Sets up Node.js 20.
3. Installs dependencies with `npm ci` (exact versions from `package-lock.json`).
4. Installs the Chromium browser and its system dependencies.
5. Runs both projects (failed tests are retried up to 2 times on CI).
6. Uploads the HTML report as a build artifact named `playwright-report` (kept for 30 days), even when tests fail.

## Author

**Shreehari N** — QA Engineer & Release Owner

GitHub: [Shree0410](https://github.com/Shree0410)

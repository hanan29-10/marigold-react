import { expect, test, type Page, type Route } from '@playwright/test';

const product = {
  id: 'verona-luggage-tag',
  name: 'Verona Luggage Tag',
  category: 'Accessories',
  price: 45,
  badge: 'Gift edition',
  image: '/images/marigold-verona-luggage-tag.png',
  description: 'A refined leather travel essential.',
};

const catalog = {
  items: [product],
  total: 1,
  categories: ['Accessories'],
};

const pageErrors = new WeakMap<Page, string[]>();

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  pageErrors.set(page, errors);
  await page.route('https://fonts.googleapis.com/**', (route) =>
    route.fulfill({ contentType: 'text/css', body: '' }),
  );
  await page.route('https://unpkg.com/**', (route) =>
    route.fulfill({ contentType: 'text/javascript', body: '' }),
  );
  page.on('console', (message) => {
    const location = message.location();
    const expectedApiFailure =
      location.url.includes('/api/products') &&
      (message.text().includes('500') || message.text().includes('404'));
    if (message.type() === 'error' && !expectedApiFailure)
      errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
});

test.afterEach(({ page }) => {
  const errors = pageErrors.get(page);
  expect(errors, errors?.join('\n')).toEqual([]);
});

async function mockCatalog(page: Page, payload = catalog) {
  await page.route('**/api/products', (route) =>
    route.fulfill({ json: payload }),
  );
}

async function mockProduct(
  page: Page,
  handler: (route: Route) => void | Promise<void>,
) {
  await page.route('**/api/products/verona-luggage-tag', handler);
}

test('opens a product with only its dedicated API request', async ({
  page,
}) => {
  const productRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('/api/products'))
      productRequests.push(request.url());
  });
  await mockProduct(page, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await route.fulfill({ json: product });
  });
  await page.goto(`/product/${product.id}`);
  await expect(
    page.getByRole('heading', { name: 'Loading the piece.' }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: product.name })).toBeVisible();
  expect(productRequests.length).toBeGreaterThan(0);
  expect(productRequests).toEqual(
    expect.arrayContaining([
      expect.stringMatching(/\/api\/products\/verona-luggage-tag$/),
    ]),
  );
  expect(productRequests).not.toContain(
    'https://marigold-api.vercel.app/api/products',
  );
});

test('limits product and persisted cart quantities to ten', async ({
  page,
}) => {
  await mockProduct(page, (route) => route.fulfill({ json: product }));
  await page.goto(`/product/${product.id}`);

  const decrease = page.getByRole('button', { name: 'Decrease quantity' });
  const increase = page.getByRole('button', { name: 'Increase quantity' });
  const addToBag = page.getByRole('button', { name: 'Add to bag' });

  await expect(decrease).toBeDisabled();
  await expect(page.locator('output[aria-label="Quantity: 1"]')).toBeVisible();
  for (let quantity = 1; quantity < 10; quantity += 1) await increase.click();
  await expect(page.locator('output[aria-label="Quantity: 10"]')).toBeVisible();
  await expect(increase).toBeDisabled();

  await addToBag.click();
  await expect(
    page.getByRole('button', { name: 'Open shopping bag' }),
  ).toContainText('10');
  await expect(addToBag).toBeDisabled();
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Open shopping bag' }),
  ).toContainText('10');
});

test('clamps quantities loaded from local storage to ten', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'marigold-cart',
      JSON.stringify([{ id: 'verona-luggage-tag', quantity: 15 }]),
    );
  });
  await mockProduct(page, (route) => route.fulfill({ json: product }));
  await page.goto(`/product/${product.id}`);
  await expect(
    page.getByRole('button', { name: 'Open shopping bag' }),
  ).toContainText('10');
  await expect(page.getByRole('button', { name: 'Add to bag' })).toBeDisabled();
});

test('supports navigation, cart, wishlist, checkout validation, and product details', async ({
  page,
}) => {
  await mockCatalog(page);
  await page.goto('/');
  await page.getByRole('link', { name: 'Shop all' }).click();
  await expect(page.getByRole('heading', { name: 'All pieces' })).toBeVisible();
  await page.getByRole('button', { name: 'Add to bag' }).click();
  await page.getByRole('button', { name: 'Open shopping bag' }).click();
  await expect(
    page.getByRole('dialog', { name: 'Shopping bag' }),
  ).toContainText(product.name);
  await page.reload();
  await page.getByRole('button', { name: 'Open shopping bag' }).click();
  await expect(
    page.getByRole('dialog', { name: 'Shopping bag' }),
  ).toContainText(product.name);
  await page
    .getByRole('button', { name: 'Close shopping bag' })
    .first()
    .click();
  await page.getByRole('button', { name: `Save ${product.name}` }).click();
  await page.getByRole('button', { name: 'View saved pieces' }).click();
  await expect(
    page.getByRole('heading', { name: 'Saved pieces' }),
  ).toBeVisible();
  await page.goto('/checkout');
  await page.getByRole('button', { name: 'Place simulated order' }).click();
  await expect(page.getByText('Enter your full name.')).toBeVisible();
  await mockProduct(page, (route) => route.fulfill({ json: product }));
  await page.goto(`/product/${product.id}`);
  await expect(page.getByRole('heading', { name: product.name })).toBeVisible();
});

test('renders product API error and not-found states', async ({ page }) => {
  await mockCatalog(page);
  await mockProduct(page, (route) => route.fulfill({ status: 500 }));
  await page.goto(`/product/${product.id}`);
  await expect(
    page.getByRole('heading', { name: 'We could not load this piece.' }),
  ).toBeVisible();

  await page.unroute('**/api/products/verona-luggage-tag');
  await mockProduct(page, (route) => route.fulfill({ status: 404 }));
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(
    page.getByRole('heading', { name: 'Product not found' }),
  ).toBeVisible();
});

test('renders the API loading state', async ({ page }) => {
  await page.route('**/api/products', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await route.fulfill({ json: catalog });
  });
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Loading the collection.' }),
  ).toBeVisible();
});

test('renders the API error state', async ({ page }) => {
  await page.route('**/api/products', (route) =>
    route.fulfill({ status: 500 }),
  );
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'We could not load the collection.' }),
  ).toBeVisible();
});

test('renders the empty catalog state', async ({ page }) => {
  await mockCatalog(page, { items: [], total: 0, categories: [] });
  await page.goto('/shop');
  await expect(page.getByText('No products match your search.')).toBeVisible();
});

test('renders a not-found page for an unknown route', async ({ page }) => {
  await mockCatalog(page);
  await page.goto('/not-a-marigold-route');
  await expect(
    page.getByRole('heading', { name: 'Page not found' }),
  ).toBeVisible();
});

test('validates the login demo and toggles password visibility', async ({
  page,
}) => {
  await mockCatalog(page);
  await page.goto('/login');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByText('Enter a valid email address.')).toBeVisible();
  await page.getByLabel('Email address').fill('invalid');
  await page.locator('#login-password').fill('short');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(
    page.getByText('Password must be at least 8 characters.'),
  ).toBeVisible();
  await page.getByLabel('Email address').fill('guest@example.com');
  await page.locator('#login-password').fill('eightchars');
  await page.getByRole('button', { name: 'Show password' }).click();
  await expect(page.locator('#login-password')).toHaveAttribute('type', 'text');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(
    page.getByText('Demo only — authentication is not connected.'),
  ).toBeVisible();
});

test('navigates to login from desktop and mobile header navigation', async ({
  page,
}) => {
  await mockCatalog(page);
  await page.goto('/');
  await page.getByRole('link', { name: 'Open sign in page' }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/login$/);

  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Toggle navigation' }).click();
  await page.getByRole('link', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
});

test('validates the sign-up demo without creating a session', async ({
  page,
}) => {
  await mockCatalog(page);
  await page.goto('/login');
  await page.getByRole('link', { name: 'Sign up' }).click();
  await expect(page).toHaveURL(/\/signup$/);
  await page.getByRole('button', { name: 'Sign up' }).click();
  await expect(page.getByText('Enter your full name.')).toBeVisible();
  await page.locator('#signup-name').fill('Guest');
  await page.locator('#signup-email').fill('guest@example.com');
  await page.locator('#signup-password').fill('eightchars');
  await page.locator('#signup-confirm-password').fill('different');
  await page.getByRole('button', { name: 'Sign up' }).click();
  await expect(page.getByText('Passwords do not match.')).toBeVisible();
  await page.locator('#signup-confirm-password').fill('eightchars');
  await page.getByRole('button', { name: 'Sign up' }).click();
  await expect(
    page.getByText('Demo only — account creation is not connected.'),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Open sign in page' }),
  ).toBeVisible();
});

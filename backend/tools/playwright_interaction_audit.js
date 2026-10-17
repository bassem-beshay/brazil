async page => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });

  await page.locator('summary[aria-label="Abrir menu"]').click();
  const mobileMenuLabels = await page.locator('header details nav a').allTextContents();

  await page.locator('input[name="email"]').fill('qa@example.com');
  await page.locator('#newsletter-captcha').fill('6');
  await page.getByRole('button', { name: 'Inscrever-se' }).click();
  const captchaError = await page.locator('p[role="alert"]').textContent();
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('http://127.0.0.1:3000/blog', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Próxima' }).click();
  const paginationText = await page.locator('nav[aria-label="Paginação do blog"] span').textContent();

  await page.goto('http://127.0.0.1:3000/tours?search=Jordânia', { waitUntil: 'networkidle' });
  const jordanResults = await page.locator('a[href^="/tours/"]').count();

  return {
    mobileMenuLabels: mobileMenuLabels.map(label => label.trim()),
    captchaError: captchaError?.trim(),
    paginationText: paginationText?.trim(),
    jordanResults,
  };
}

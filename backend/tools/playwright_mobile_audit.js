async page => {
  await page.setViewportSize({ width: 390, height: 844 });
  const pages = [
    { path: '/', screenshot: 'frontend/output/home-mobile.png' },
    { path: '/about' },
    { path: '/tours', screenshot: 'frontend/output/tours-mobile.png' },
    { path: '/blog', screenshot: 'frontend/output/blog-mobile.png' },
  ];
  const results = [];

  for (const item of pages) {
    await page.goto(`http://127.0.0.1:3000${item.path}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(700);
    results.push(await page.evaluate(() => ({
      path: location.pathname,
      h1: document.querySelector('h1')?.textContent?.trim(),
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      menuButton: Boolean(document.querySelector('summary[aria-label="Abrir menu"]')),
      brokenImages: [...document.images]
        .filter(image => image.complete && image.naturalWidth === 0)
        .map(image => image.src),
    })));
    await page.evaluate(() => window.scrollTo(0, 0));
    if (item.screenshot) {
      await page.screenshot({ path: item.screenshot, fullPage: true, scale: 'css' });
    }
  }

  return results;
}

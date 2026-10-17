async page => {
  const pages = [
    { path: '/about', screenshot: 'frontend/output/about-full.png' },
    { path: '/tours', screenshot: 'frontend/output/tours-full.png' },
    { path: '/blog', screenshot: 'frontend/output/blog-full.png' },
    { path: '/tours/egito-classico-e-cruzeiro-no-nilo' },
    { path: '/blog/egmont-national-park-nova-zelandia' },
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
      tourLinks: document.querySelectorAll('a[href^="/tours/"]').length,
      blogLinks: document.querySelectorAll('a[href^="/blog/"]').length,
      brokenImages: [...document.images]
        .filter(image => image.complete && image.naturalWidth === 0)
        .map(image => image.src),
    })));
    if (item.screenshot) {
      await page.screenshot({ path: item.screenshot, fullPage: true, scale: 'css' });
    }
  }

  return results;
}

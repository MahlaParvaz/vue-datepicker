let fontLoaded = false;

const FONT_CDN_URL = 'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn/fonts/webfonts/Vazirmatn-Regular.woff2';

export async function loadDefaultFont() {
  if (fontLoaded || typeof document === 'undefined') return;

  try {
    // استفاده از فونت Vazirmatn از CDN (کم حجم و بهینه)
    const fontFace = new FontFace('Vazirmatn', `url(${FONT_CDN_URL}) format('woff2')`, {
      weight: '400',
      style: 'normal',
      display: 'swap'
    });

    await fontFace.load();
    document.fonts.add(fontFace);
    fontLoaded = true;
  } catch (error) {
    // اگه CDN کار نکرد، از فونت‌های سیستم استفاده میشه
    console.warn('[vue-datepicker] Using system fonts');
  }
}

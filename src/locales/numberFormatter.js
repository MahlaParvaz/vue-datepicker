const NUMBER_DIGITS = Object.freeze({
  persian: ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'],
  arabic: ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'],
  latin: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  chinese: ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
});

export function toLocalizedNumbers(value, system = 'latin') {
  if (value === null || value === undefined) return '';

  const digits = NUMBER_DIGITS[system] || NUMBER_DIGITS.latin;
  return String(value).replace(/\d/g, (digit) => {
    return digits[parseInt(digit, 10)];
  });
}

export function toLatinNumbers(value) {
  if (!value) return '';

  let result = String(value);
  Object.entries(NUMBER_DIGITS).forEach(([system, digits]) => {
    if (system === 'latin') return;

    digits.forEach((digit, index) => {
      result = result.replace(new RegExp(digit, 'g'), String(index));
    });
  });
  return result;
}

export function padNumber(num, length = 2, system = 'latin') {
  const padded = String(num).padStart(length, '0');
  return toLocalizedNumbers(padded, system);
}

export function formatNumber(num, system = 'latin', separator = ',') {
  const formatted = String(num).replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return toLocalizedNumbers(formatted, system);
}

export function isNumericString(value) {
  const allDigits = Object.values(NUMBER_DIGITS).flat();

  const pattern = new RegExp(`^[${allDigits.join('')}]+$`);
  return pattern.test(value);
}

export function detectNumberSystem(digit) {
  for (const [system, digits] of Object.entries(NUMBER_DIGITS)) {
    if (digits.includes(digit)) {
      return system;
    }
  }
  return null;
}

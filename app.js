window.navigateTo = function(path) {
  window.location.hash = path;
};

function hexToRgb(hex) {
  hex = hex.replace(/^#/, '').padStart(6, '0');
  var r = parseInt(hex.substring(0, 2), 16);
  var g = parseInt(hex.substring(2, 4), 16);
  var b = parseInt(hex.substring(4, 6), 16);
  return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}

function rgbToHex(rgb) {
  var match = rgb.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
  if (!match) return rgb;
  var r = parseInt(match[1]).toString(16).padStart(2, '0');
  var g = parseInt(match[2]).toString(16).padStart(2, '0');
  var b = parseInt(match[3]).toString(16).padStart(2, '0');
  return (r + g + b).toUpperCase();
}

function hexToHsl(hex) {
  hex = hex.replace(/^#/, '').padStart(6, '0');
  var r = parseInt(hex.substring(0, 2), 16) / 255;
  var g = parseInt(hex.substring(2, 4), 16) / 255;
  var b = parseInt(hex.substring(4, 6), 16) / 255;

  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) {
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    } else if (max === g) {
      h = ((b - r) / d + 2) / 6;
    } else {
      h = ((r - g) / d + 4) / 6;
    }
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
}

function hslToHex(hsl) {
  var match = hsl.match(/hsl\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/i);
  if (!match) return hsl;

  var h = parseInt(match[1]) / 360;
  var s = parseInt(match[2]) / 100;
  var l = parseInt(match[3]) / 100;

  var r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    var hue2rgb = function(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  var toHex = function(x) { return Math.round(x * 255).toString(16).padStart(2, '0'); };
  return (toHex(r) + toHex(g) + toHex(b)).toUpperCase();
}

var categories = [
  {
    key: 'currency',
    label: '货币汇率',
    labelEn: 'Currency',
    icon: '💰',
    baseUnit: 'cny',
    units: [
      { key: 'cny', label: '人民币', labelEn: 'CNY', toBase: 1, fromBase: 1 },
      { key: 'usd', label: '美元', labelEn: 'USD', toBase: 7.24, fromBase: 1 / 7.24 },
      { key: 'eur', label: '欧元', labelEn: 'EUR', toBase: 7.86, fromBase: 1 / 7.86 },
      { key: 'gbp', label: '英镑', labelEn: 'GBP', toBase: 9.12, fromBase: 1 / 9.12 },
      { key: 'jpy', label: '日元', labelEn: 'JPY', toBase: 0.048, fromBase: 1 / 0.048 },
      { key: 'krw', label: '韩元', labelEn: 'KRW', toBase: 0.0052, fromBase: 1 / 0.0052 },
      { key: 'hkd', label: '港币', labelEn: 'HKD', toBase: 0.926, fromBase: 1 / 0.926 },
      { key: 'twd', label: '新台币', labelEn: 'TWD', toBase: 0.224, fromBase: 1 / 0.224 },
      { key: 'aud', label: '澳元', labelEn: 'AUD', toBase: 4.68, fromBase: 1 / 4.68 },
      { key: 'cad', label: '加元', labelEn: 'CAD', toBase: 5.21, fromBase: 1 / 5.21 },
      { key: 'sgd', label: '新加坡元', labelEn: 'SGD', toBase: 5.35, fromBase: 1 / 5.35 },
      { key: 'chf', label: '瑞士法郎', labelEn: 'CHF', toBase: 7.98, fromBase: 1 / 7.98 },
      { key: 'inr', label: '印度卢比', labelEn: 'INR', toBase: 0.086, fromBase: 1 / 0.086 },
      { key: 'thb', label: '泰铢', labelEn: 'THB', toBase: 0.207, fromBase: 1 / 0.207 },
      { key: 'myr', label: '马来西亚林吉特', labelEn: 'MYR', toBase: 1.55, fromBase: 1 / 1.55 },
    ],
  },
  {
    key: 'timestamp',
    label: '时间戳转换',
    labelEn: 'Timestamp',
    icon: '⏰',
    baseUnit: 'unix',
    units: [
      { key: 'unix', label: 'Unix时间戳(秒)', labelEn: 'Unix Timestamp(sec)', toBase: 1, fromBase: 1 },
      { key: 'unix_ms', label: 'Unix时间戳(毫秒)', labelEn: 'Unix Timestamp(ms)', toBase: 0.001, fromBase: 1000 },
      { key: 'datetime', label: '日期时间', labelEn: 'DateTime', toBase: function(v) { return new Date(v).getTime() / 1000; }, fromBase: function(v) { return new Date(v * 1000).toLocaleString('zh-CN'); }, isStringOutput: true },
      { key: 'iso', label: 'ISO 8601', labelEn: 'ISO 8601', toBase: function(v) { return new Date(v).getTime() / 1000; }, fromBase: function(v) { return new Date(v * 1000).toISOString(); }, isStringOutput: true },
      { key: 'date', label: '日期', labelEn: 'Date', toBase: function(v) { return new Date(v).getTime() / 1000; }, fromBase: function(v) { return new Date(v * 1000).toLocaleDateString('zh-CN'); }, isStringOutput: true },
    ],
  },
  {
    key: 'encoding',
    label: '编码加密',
    labelEn: 'Encoding',
    icon: '🔐',
    baseUnit: 'text',
    units: [
      { key: 'text', label: '明文', labelEn: 'Plain Text', toBase: function(v) { return v; }, fromBase: function(v) { return v; }, isStringOutput: true },
      { key: 'url', label: 'URL编码', labelEn: 'URL Encoded', toBase: function(v) { try { return decodeURIComponent(v); } catch(e) { return 'Invalid URL Encoding'; } }, fromBase: encodeURIComponent, isStringOutput: true },
      { key: 'base64', label: 'Base64', labelEn: 'Base64', toBase: function(v) { try { return decodeURIComponent(escape(atob(v))); } catch(e) { return 'Invalid Base64'; } }, fromBase: function(v) { return btoa(unescape(encodeURIComponent(v))); }, isStringOutput: true },
      { key: 'unicode', label: 'Unicode', labelEn: 'Unicode', toBase: function(v) { return v.replace(/\\u([\da-fA-F]{4})/g, (m, p) => String.fromCharCode(parseInt(p, 16))); }, fromBase: function(v) { return v.split('').map(c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')).join(''); }, isStringOutput: true },
      { key: 'hex_str', label: '十六进制字符串', labelEn: 'Hex String', toBase: function(v) { try { var matches = v.match(/.{2}/g); return matches ? matches.map(h => String.fromCharCode(parseInt(h, 16))).join('') : 'Invalid Hex String'; } catch(e) { return 'Invalid Hex String'; } }, fromBase: function(v) { return v.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(''); }, isStringOutput: true },
    ],
  },
  {
    key: 'size',
    label: '鞋服尺码',
    labelEn: 'Clothing Size',
    icon: '👔',
    baseUnit: 'cn',
    units: [
      { key: 'cn', label: '中国码', labelEn: 'CN', toBase: 1, fromBase: 1 },
      { key: 'us_m', label: '美码(男)', labelEn: 'US(Men)', toBase: function(v) { return v + 0.5; }, fromBase: function(v) { return v - 0.5; } },
      { key: 'us_w', label: '美码(女)', labelEn: 'US(Women)', toBase: function(v) { return v + 1.5; }, fromBase: function(v) { return v - 1.5; } },
      { key: 'eu', label: '欧码', labelEn: 'EU', toBase: function(v) { return v * 0.44 + 34.6; }, fromBase: function(v) { return (v - 34.6) / 0.44; } },
      { key: 'uk', label: '英码', labelEn: 'UK', toBase: function(v) { return v + 24.5; }, fromBase: function(v) { return v - 24.5; } },
    ],
  },
  {
    key: 'font',
    label: '字体大小',
    labelEn: 'Font Size',
    icon: '📝',
    baseUnit: 'px',
    units: [
      { key: 'px', label: '像素', labelEn: 'Pixel', toBase: 1, fromBase: 1 },
      { key: 'pt', label: '磅', labelEn: 'Point', toBase: 4 / 3, fromBase: 3 / 4 },
      { key: 'em', label: 'em', labelEn: 'em', toBase: 16, fromBase: 1 / 16 },
      { key: 'rem', label: 'rem', labelEn: 'rem', toBase: 16, fromBase: 1 / 16 },
      { key: 'vw', label: 'vw', labelEn: 'vw', toBase: function(v) { return v * 1.92; }, fromBase: function(v) { return v / 1.92; } },
      { key: 'vh', label: 'vh', labelEn: 'vh', toBase: function(v) { return v * 1.08; }, fromBase: function(v) { return v / 1.08; } },
      { key: 'pc', label: 'Pica', labelEn: 'Pica', toBase: 16, fromBase: 1 / 16 },
    ],
  },
  {
    key: 'network',
    label: '网络速度',
    labelEn: 'Network Speed',
    icon: '📶',
    baseUnit: 'bps',
    units: [
      { key: 'bps', label: '比特/秒', labelEn: 'bps', toBase: 1, fromBase: 1 },
      { key: 'kbps', label: '千比特/秒', labelEn: 'kbps', toBase: 1000, fromBase: 0.001 },
      { key: 'mbps', label: '兆比特/秒', labelEn: 'Mbps', toBase: 1e6, fromBase: 1e-6 },
      { key: 'gbps', label: '吉比特/秒', labelEn: 'Gbps', toBase: 1e9, fromBase: 1e-9 },
      { key: 'b_s', label: '字节/秒', labelEn: 'B/s', toBase: 8, fromBase: 1 / 8 },
      { key: 'kb_s', label: '千字节/秒', labelEn: 'KB/s', toBase: 8000, fromBase: 1 / 8000 },
      { key: 'mb_s', label: '兆字节/秒', labelEn: 'MB/s', toBase: 8e6, fromBase: 1 / 8e6 },
      { key: 'gb_s', label: '吉字节/秒', labelEn: 'GB/s', toBase: 8e9, fromBase: 1 / 8e9 },
    ],
  },
  {
    key: 'density',
    label: '密度',
    labelEn: 'Density',
    icon: '⚗️',
    baseUnit: 'kgm3',
    units: [
      { key: 'kgm3', label: '千克/立方米', labelEn: 'kg/m³', toBase: 1, fromBase: 1 },
      { key: 'gcm3', label: '克/立方厘米', labelEn: 'g/cm³', toBase: 1000, fromBase: 0.001 },
      { key: 'lbft3', label: '磅/立方英尺', labelEn: 'lb/ft³', toBase: 16.0185, fromBase: 1 / 16.0185 },
      { key: 'lbgal', label: '磅/加仑', labelEn: 'lb/gal(US)', toBase: 119.826, fromBase: 1 / 119.826 },
      { key: 'gml', label: '克/毫升', labelEn: 'g/mL', toBase: 1000, fromBase: 0.001 },
    ],
  },
  {
    key: 'frequency',
    label: '频率',
    labelEn: 'Frequency',
    icon: '📡',
    baseUnit: 'hz',
    units: [
      { key: 'hz', label: '赫兹', labelEn: 'Hz', toBase: 1, fromBase: 1 },
      { key: 'khz', label: '千赫兹', labelEn: 'kHz', toBase: 1000, fromBase: 0.001 },
      { key: 'mhz', label: '兆赫兹', labelEn: 'MHz', toBase: 1e6, fromBase: 1e-6 },
      { key: 'ghz', label: '吉赫兹', labelEn: 'GHz', toBase: 1e9, fromBase: 1e-9 },
      { key: 'thz', label: '太赫兹', labelEn: 'THz', toBase: 1e12, fromBase: 1e-12 },
      { key: 'rpm', label: '转/分钟', labelEn: 'RPM', toBase: 1 / 60, fromBase: 60 },
      { key: 'rads', label: '弧度/秒', labelEn: 'rad/s', toBase: 1 / (2 * Math.PI), fromBase: 2 * Math.PI },
    ],
  },
  {
    key: 'force',
    label: '力/力矩',
    labelEn: 'Force/Torque',
    icon: '⚙️',
    baseUnit: 'n',
    units: [
      { key: 'n', label: '牛顿', labelEn: 'Newton', toBase: 1, fromBase: 1 },
      { key: 'kn', label: '千牛', labelEn: 'kN', toBase: 1000, fromBase: 0.001 },
      { key: 'kgf', label: '千克力', labelEn: 'kgf', toBase: 9.80665, fromBase: 1 / 9.80665 },
      { key: 'lbf', label: '磅力', labelEn: 'lbf', toBase: 4.44822, fromBase: 1 / 4.44822 },
      { key: 'n_m', label: '牛·米', labelEn: 'N·m', toBase: 1, fromBase: 1 },
      { key: 'kgf_m', label: '千克力·米', labelEn: 'kgf·m', toBase: 9.80665, fromBase: 1 / 9.80665 },
      { key: 'lbf_ft', label: '磅力·英尺', labelEn: 'lbf·ft', toBase: 1.35582, fromBase: 1 / 1.35582 },
    ],
  },
  {
    key: 'electric',
    label: '电学基础',
    labelEn: 'Electricity',
    icon: '⚡',
    baseUnit: 'v',
    units: [
      { key: 'v', label: '伏特', labelEn: 'Volt', toBase: 1, fromBase: 1 },
      { key: 'kv', label: '千伏', labelEn: 'kV', toBase: 1000, fromBase: 0.001 },
      { key: 'mv', label: '毫伏', labelEn: 'mV', toBase: 0.001, fromBase: 1000 },
      { key: 'a', label: '安培', labelEn: 'Ampere', toBase: 1, fromBase: 1 },
      { key: 'ma', label: '毫安', labelEn: 'mA', toBase: 0.001, fromBase: 1000 },
      { key: 'ua', label: '微安', labelEn: 'μA', toBase: 1e-6, fromBase: 1e6 },
      { key: 'ohm', label: '欧姆', labelEn: 'Ohm', toBase: 1, fromBase: 1 },
      { key: 'kohm', label: '千欧', labelEn: 'kOhm', toBase: 1000, fromBase: 0.001 },
      { key: 'mohm', label: '兆欧', labelEn: 'MOhm', toBase: 1e6, fromBase: 1e-6 },
    ],
  },
  {
    key: 'concentration',
    label: '浓度',
    labelEn: 'Concentration',
    icon: '🧪',
    baseUnit: 'gml',
    units: [
      { key: 'gml', label: '克/毫升', labelEn: 'g/mL', toBase: 1, fromBase: 1 },
      { key: 'gl', label: '克/升', labelEn: 'g/L', toBase: 0.001, fromBase: 1000 },
      { key: 'mgml', label: '毫克/毫升', labelEn: 'mg/mL', toBase: 0.001, fromBase: 1000 },
      { key: 'mgl', label: '毫克/升', labelEn: 'mg/L', toBase: 1e-6, fromBase: 1e6 },
      { key: 'ugml', label: '微克/毫升', labelEn: 'μg/mL', toBase: 1e-6, fromBase: 1e6 },
      { key: 'mol_l', label: '摩尔/升', labelEn: 'mol/L', toBase: 1000, fromBase: 0.001 },
      { key: 'ppm', label: 'ppm', labelEn: 'ppm', toBase: 1e-6, fromBase: 1e6 },
      { key: 'ppb', label: 'ppb', labelEn: 'ppb', toBase: 1e-9, fromBase: 1e9 },
    ],
  },
  {
    key: 'zodiac',
    label: '生肖星座',
    labelEn: 'Zodiac',
    icon: '♈',
    baseUnit: 'year',
    units: [
      { key: 'year', label: '年份', labelEn: 'Year', toBase: 1, fromBase: 1 },
      { key: 'zodiac_cn', label: '生肖', labelEn: 'Chinese Zodiac', toBase: function(v) { return v; }, fromBase: function(v) { var zodiacs = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']; return zodiacs[(v - 1984) % 12]; }, isStringOutput: true },
      { key: 'zodiac_w', label: '星座', labelEn: 'Western Zodiac', toBase: function(v) { return v; }, fromBase: function(v) { return '星座需配合月份使用'; }, isStringOutput: true },
      { key: 'age', label: '年龄', labelEn: 'Age', toBase: function(v) { return v; }, fromBase: function(v) { return new Date().getFullYear() - v; } },
      { key: 'birth_year', label: '出生年份', labelEn: 'Birth Year', toBase: function(v) { return new Date().getFullYear() - v; }, fromBase: function(v) { return new Date().getFullYear() - v; } },
    ],
  },
  {
    key: 'base',
    label: '数字进制',
    labelEn: 'Number Base',
    icon: '🔢',
    baseUnit: 'dec',
    units: [
      { key: 'bin', label: '二进制', labelEn: 'Binary', toBase: function(v) { return parseInt(String(v), 2); }, fromBase: function(v) { return Math.floor(v).toString(2); }, isStringOutput: true },
      { key: 'oct', label: '八进制', labelEn: 'Octal', toBase: function(v) { return parseInt(String(v), 8); }, fromBase: function(v) { return Math.floor(v).toString(8); }, isStringOutput: true },
      { key: 'dec', label: '十进制', labelEn: 'Decimal', toBase: 1, fromBase: 1 },
      { key: 'hex', label: '十六进制', labelEn: 'Hexadecimal', toBase: function(v) { return parseInt(String(v), 16); }, fromBase: function(v) { return Math.floor(v).toString(16).toUpperCase(); }, isStringOutput: true },
    ],
  },
  {
    key: 'length',
    label: '长度',
    labelEn: 'Length',
    icon: '📏',
    baseUnit: 'm',
    units: [
      { key: 'km', label: '千米', labelEn: 'Kilometer', toBase: 1000, fromBase: 0.001 },
      { key: 'm', label: '米', labelEn: 'Meter', toBase: 1, fromBase: 1 },
      { key: 'dm', label: '分米', labelEn: 'Decimeter', toBase: 0.1, fromBase: 10 },
      { key: 'cm', label: '厘米', labelEn: 'Centimeter', toBase: 0.01, fromBase: 100 },
      { key: 'mm', label: '毫米', labelEn: 'Millimeter', toBase: 0.001, fromBase: 1000 },
      { key: 'um', label: '微米', labelEn: 'Micrometer', toBase: 0.000001, fromBase: 1000000 },
      { key: 'nm', label: '纳米', labelEn: 'Nanometer', toBase: 1e-9, fromBase: 1e9 },
      { key: 'mi', label: '英里', labelEn: 'Mile', toBase: 1609.344, fromBase: 1 / 1609.344 },
      { key: 'yd', label: '码', labelEn: 'Yard', toBase: 0.9144, fromBase: 1 / 0.9144 },
      { key: 'ft', label: '英尺', labelEn: 'Foot', toBase: 0.3048, fromBase: 1 / 0.3048 },
      { key: 'in', label: '英寸', labelEn: 'Inch', toBase: 0.0254, fromBase: 1 / 0.0254 },
      { key: 'nmi', label: '海里', labelEn: 'Nautical Mile', toBase: 1852, fromBase: 1 / 1852 },
      { key: 'li', label: '里', labelEn: 'Li', toBase: 500, fromBase: 0.002 },
      { key: 'chi', label: '尺', labelEn: 'Chi', toBase: 1 / 3, fromBase: 3 },
      { key: 'cun', label: '寸', labelEn: 'Cun', toBase: 1 / 30, fromBase: 30 },
    ],
  },
  {
    key: 'area',
    label: '面积',
    labelEn: 'Area',
    icon: '📐',
    baseUnit: 'sqm',
    units: [
      { key: 'sqkm', label: '平方千米', labelEn: 'Square Kilometer', toBase: 1e6, fromBase: 1e-6 },
      { key: 'ha', label: '公顷', labelEn: 'Hectare', toBase: 10000, fromBase: 0.0001 },
      { key: 'mu', label: '亩', labelEn: 'Mu', toBase: 666.667, fromBase: 0.0015 },
      { key: 'sqm', label: '平方米', labelEn: 'Square Meter', toBase: 1, fromBase: 1 },
      { key: 'sqcm', label: '平方厘米', labelEn: 'Square Centimeter', toBase: 1e-4, fromBase: 10000 },
      { key: 'sqft', label: '平方英尺', labelEn: 'Square Foot', toBase: 0.092903, fromBase: 10.7639 },
      { key: 'sqin', label: '平方英寸', labelEn: 'Square Inch', toBase: 6.4516e-4, fromBase: 1550.003 },
      { key: 'acre', label: '英亩', labelEn: 'Acre', toBase: 4046.86, fromBase: 0.000247105 },
      { key: 'sqmi', label: '平方英里', labelEn: 'Square Mile', toBase: 2589988, fromBase: 3.861e-7 },
    ],
  },
  {
    key: 'volume',
    label: '体积',
    labelEn: 'Volume',
    icon: '🧪',
    baseUnit: 'l',
    units: [
      { key: 'l', label: '升', labelEn: 'Liter', toBase: 1, fromBase: 1 },
      { key: 'ml', label: '毫升', labelEn: 'Milliliter', toBase: 0.001, fromBase: 1000 },
      { key: 'cbm', label: '立方米', labelEn: 'Cubic Meter', toBase: 1000, fromBase: 0.001 },
      { key: 'cbcm', label: '立方厘米', labelEn: 'Cubic Centimeter', toBase: 0.001, fromBase: 1000 },
      { key: 'gal', label: '加仑', labelEn: 'Gallon(US)', toBase: 3.78541, fromBase: 0.264172 },
      { key: 'qt', label: '夸脱', labelEn: 'Quart(US)', toBase: 0.946353, fromBase: 1.05669 },
      { key: 'pt', label: '品脱', labelEn: 'Pint(US)', toBase: 0.473176, fromBase: 2.11338 },
      { key: 'floz', label: '液量盎司', labelEn: 'Fluid Ounce(US)', toBase: 0.0295735, fromBase: 33.814 },
      { key: 'cbft', label: '立方英尺', labelEn: 'Cubic Foot', toBase: 28.3168, fromBase: 0.0353147 },
      { key: 'cbin', label: '立方英寸', labelEn: 'Cubic Inch', toBase: 0.0163871, fromBase: 61.0237 },
    ],
  },
  {
    key: 'weight',
    label: '重量',
    labelEn: 'Weight',
    icon: '⚖️',
    baseUnit: 'kg',
    units: [
      { key: 't', label: '吨', labelEn: 'Metric Ton', toBase: 1000, fromBase: 0.001 },
      { key: 'kg', label: '千克', labelEn: 'Kilogram', toBase: 1, fromBase: 1 },
      { key: 'g', label: '克', labelEn: 'Gram', toBase: 0.001, fromBase: 1000 },
      { key: 'mg', label: '毫克', labelEn: 'Milligram', toBase: 1e-6, fromBase: 1e6 },
      { key: 'jin', label: '斤', labelEn: 'Jin', toBase: 0.5, fromBase: 2 },
      { key: 'liang', label: '两', labelEn: 'Liang', toBase: 0.05, fromBase: 20 },
      { key: 'lb', label: '磅', labelEn: 'Pound', toBase: 0.453592, fromBase: 2.20462 },
      { key: 'oz', label: '盎司', labelEn: 'Ounce', toBase: 0.0283495, fromBase: 35.274 },
      { key: 'ct', label: '克拉', labelEn: 'Carat', toBase: 0.0002, fromBase: 5000 },
      { key: 'gr', label: '格令', labelEn: 'Grain', toBase: 6.479891e-5, fromBase: 15432.4 },
    ],
  },
  {
    key: 'temperature',
    label: '温度',
    labelEn: 'Temperature',
    icon: '🌡️',
    baseUnit: 'c',
    units: [
      { key: 'c', label: '摄氏度', labelEn: 'Celsius', toBase: 1, fromBase: 1 },
      { key: 'f', label: '华氏度', labelEn: 'Fahrenheit', toBase: function(v) { return (v - 32) * 5 / 9; }, fromBase: function(v) { return v * 9 / 5 + 32; } },
      { key: 'k', label: '开尔文', labelEn: 'Kelvin', toBase: function(v) { return v - 273.15; }, fromBase: function(v) { return v + 273.15; } },
      { key: 'ra', label: '兰氏度', labelEn: 'Rankine', toBase: function(v) { return (v - 491.67) * 5 / 9; }, fromBase: function(v) { return v * 9 / 5 + 491.67; } },
    ],
  },
  {
    key: 'speed',
    label: '速度',
    labelEn: 'Speed',
    icon: '🚀',
    baseUnit: 'ms',
    units: [
      { key: 'ms', label: '米每秒', labelEn: 'Meter/Second', toBase: 1, fromBase: 1 },
      { key: 'kmh', label: '千米每小时', labelEn: 'Kilometer/Hour', toBase: 1 / 3.6, fromBase: 3.6 },
      { key: 'mph', label: '英里每小时', labelEn: 'Mile/Hour', toBase: 0.44704, fromBase: 2.23694 },
      { key: 'kn', label: '节', labelEn: 'Knot', toBase: 0.514444, fromBase: 1.94384 },
      { key: 'mach', label: '马赫', labelEn: 'Mach', toBase: 340.29, fromBase: 1 / 340.29 },
      { key: 'c', label: '光速', labelEn: 'Speed of Light', toBase: 299792458, fromBase: 1 / 299792458 },
      { key: 'fts', label: '英尺每秒', labelEn: 'Foot/Second', toBase: 0.3048, fromBase: 1 / 0.3048 },
    ],
  },
  {
    key: 'time',
    label: '时间',
    labelEn: 'Time',
    icon: '⏱️',
    baseUnit: 's',
    units: [
      { key: 'ns', label: '纳秒', labelEn: 'Nanosecond', toBase: 1e-9, fromBase: 1e9 },
      { key: 'us', label: '微秒', labelEn: 'Microsecond', toBase: 1e-6, fromBase: 1e6 },
      { key: 'ms_time', label: '毫秒', labelEn: 'Millisecond', toBase: 0.001, fromBase: 1000 },
      { key: 's', label: '秒', labelEn: 'Second', toBase: 1, fromBase: 1 },
      { key: 'min', label: '分钟', labelEn: 'Minute', toBase: 60, fromBase: 1 / 60 },
      { key: 'h', label: '小时', labelEn: 'Hour', toBase: 3600, fromBase: 1 / 3600 },
      { key: 'd', label: '天', labelEn: 'Day', toBase: 86400, fromBase: 1 / 86400 },
      { key: 'wk', label: '周', labelEn: 'Week', toBase: 604800, fromBase: 1 / 604800 },
      { key: 'mo', label: '月', labelEn: 'Month(30d)', toBase: 2592000, fromBase: 1 / 2592000 },
      { key: 'yr', label: '年', labelEn: 'Year(365d)', toBase: 31536000, fromBase: 1 / 31536000 },
    ],
  },
  {
    key: 'data',
    label: '数据存储',
    labelEn: 'Data Storage',
    icon: '💾',
    baseUnit: 'byte',
    units: [
      { key: 'bit', label: '比特', labelEn: 'Bit', toBase: 0.125, fromBase: 8 },
      { key: 'byte', label: '字节', labelEn: 'Byte', toBase: 1, fromBase: 1 },
      { key: 'kb', label: 'KB', labelEn: 'Kilobyte', toBase: 1024, fromBase: 1 / 1024 },
      { key: 'mb', label: 'MB', labelEn: 'Megabyte', toBase: 1048576, fromBase: 1 / 1048576 },
      { key: 'gb', label: 'GB', labelEn: 'Gigabyte', toBase: 1073741824, fromBase: 1 / 1073741824 },
      { key: 'tb', label: 'TB', labelEn: 'Terabyte', toBase: 1099511627776, fromBase: 1 / 1099511627776 },
      { key: 'pb', label: 'PB', labelEn: 'Petabyte', toBase: 1125899906842624, fromBase: 1 / 1125899906842624 },
    ],
  },
  {
    key: 'pressure',
    label: '压力',
    labelEn: 'Pressure',
    icon: '🌀',
    baseUnit: 'pa',
    units: [
      { key: 'pa', label: '帕斯卡', labelEn: 'Pascal', toBase: 1, fromBase: 1 },
      { key: 'kpa', label: '千帕', labelEn: 'Kilopascal', toBase: 1000, fromBase: 0.001 },
      { key: 'mpa', label: '兆帕', labelEn: 'Megapascal', toBase: 1e6, fromBase: 1e-6 },
      { key: 'bar', label: '巴', labelEn: 'Bar', toBase: 100000, fromBase: 1e-5 },
      { key: 'atm', label: '标准大气压', labelEn: 'Atmosphere', toBase: 101325, fromBase: 1 / 101325 },
      { key: 'psi', label: 'PSI', labelEn: 'PSI', toBase: 6894.76, fromBase: 1 / 6894.76 },
      { key: 'mmhg', label: '毫米汞柱', labelEn: 'mmHg', toBase: 133.322, fromBase: 1 / 133.322 },
      { key: 'torr', label: '托', labelEn: 'Torr', toBase: 133.322, fromBase: 1 / 133.322 },
    ],
  },
  {
    key: 'power',
    label: '功率',
    labelEn: 'Power',
    icon: '⚡',
    baseUnit: 'w',
    units: [
      { key: 'w', label: '瓦特', labelEn: 'Watt', toBase: 1, fromBase: 1 },
      { key: 'kw', label: '千瓦', labelEn: 'Kilowatt', toBase: 1000, fromBase: 0.001 },
      { key: 'mw_power', label: '兆瓦', labelEn: 'Megawatt', toBase: 1e6, fromBase: 1e-6 },
      { key: 'hp', label: '马力', labelEn: 'Horsepower', toBase: 745.7, fromBase: 1 / 745.7 },
      { key: 'btuh', label: 'BTU每小时', labelEn: 'BTU/Hour', toBase: 0.293071, fromBase: 3.41214 },
      { key: 'calps', label: '卡路里每秒', labelEn: 'Calorie/Second', toBase: 4.184, fromBase: 1 / 4.184 },
    ],
  },
  {
    key: 'angle',
    label: '角度',
    labelEn: 'Angle',
    icon: '📊',
    baseUnit: 'deg',
    units: [
      { key: 'deg', label: '度', labelEn: 'Degree', toBase: 1, fromBase: 1 },
      { key: 'rad', label: '弧度', labelEn: 'Radian', toBase: function(v) { return v * 180 / Math.PI; }, fromBase: function(v) { return v * Math.PI / 180; } },
      { key: 'grad', label: '梯度', labelEn: 'Gradian', toBase: 0.9, fromBase: 1 / 0.9 },
      { key: 'arcmin', label: '角分', labelEn: 'Arcminute', toBase: 1 / 60, fromBase: 60 },
      { key: 'arcsec', label: '角秒', labelEn: 'Arcsecond', toBase: 1 / 3600, fromBase: 3600 },
      { key: 'rev', label: '圈', labelEn: 'Revolution', toBase: 360, fromBase: 1 / 360 },
    ],
  },
  {
    key: 'fuel',
    label: '油耗',
    labelEn: 'Fuel Economy',
    icon: '⛽',
    baseUnit: 'l100km',
    units: [
      { key: 'l100km', label: 'L/100km', labelEn: 'L/100km', toBase: 1, fromBase: 1 },
      { key: 'mpg_us', label: 'MPG US', labelEn: 'MPG(US)', toBase: function(v) { return 235.215 / v; }, fromBase: function(v) { return 235.215 / v; } },
      { key: 'mpg_uk', label: 'MPG UK', labelEn: 'MPG(UK)', toBase: function(v) { return 282.481 / v; }, fromBase: function(v) { return 282.481 / v; } },
      { key: 'kml', label: 'km/L', labelEn: 'km/L', toBase: function(v) { return 100 / v; }, fromBase: function(v) { return 100 / v; } },
    ],
  },
  {
    key: 'energy',
    label: '能量',
    labelEn: 'Energy',
    icon: '🔋',
    baseUnit: 'j',
    units: [
      { key: 'j', label: '焦耳', labelEn: 'Joule', toBase: 1, fromBase: 1 },
      { key: 'kj', label: '千焦', labelEn: 'Kilojoule', toBase: 1000, fromBase: 0.001 },
      { key: 'cal', label: '卡路里', labelEn: 'Calorie', toBase: 4.184, fromBase: 1 / 4.184 },
      { key: 'kcal', label: '千卡', labelEn: 'Kilocalorie', toBase: 4184, fromBase: 1 / 4184 },
      { key: 'wh', label: '瓦时', labelEn: 'Watt-hour', toBase: 3600, fromBase: 1 / 3600 },
      { key: 'kwh', label: '千瓦时', labelEn: 'Kilowatt-hour', toBase: 3600000, fromBase: 1 / 3600000 },
      { key: 'ev', label: '电子伏特', labelEn: 'Electronvolt', toBase: 1.602176634e-19, fromBase: 1 / 1.602176634e-19 },
      { key: 'btu', label: 'BTU', labelEn: 'BTU', toBase: 1055.06, fromBase: 1 / 1055.06 },
    ],
  },
  {
    key: 'color',
    label: '颜色',
    labelEn: 'Color',
    icon: '🎨',
    baseUnit: 'hex',
    units: [
      { key: 'hex', label: 'HEX', labelEn: 'HEX', toBase: function(v) { return v.replace(/^#/, '').toUpperCase(); }, fromBase: function(v) { return '#' + v.padStart(6, '0').toUpperCase(); } },
      { key: 'rgb', label: 'RGB', labelEn: 'RGB', toBase: rgbToHex, fromBase: hexToRgb },
      { key: 'hsl', label: 'HSL', labelEn: 'HSL', toBase: hslToHex, fromBase: hexToHsl },
    ],
  },
];

function convert(categoryKey, fromUnitKey, toUnitKey, value) {
  var cat = categories.find(function(c) { return c.key === categoryKey; });
  if (!cat) return null;
  var fromUnit = cat.units.find(function(u) { return u.key === fromUnitKey; });
  var toUnit = cat.units.find(function(u) { return u.key === toUnitKey; });
  if (!fromUnit || !toUnit) return null;

  var baseValue;
  if (typeof fromUnit.toBase === 'function') {
    var inputValue = typeof value === 'string' ? value : String(value);
    baseValue = fromUnit.toBase(inputValue);
  } else {
    var numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return null;
    baseValue = numValue * fromUnit.toBase;
  }

  var result = typeof toUnit.fromBase === 'function' ? toUnit.fromBase(baseValue) : baseValue * toUnit.fromBase;
  return result;
}

function getCategory(key) {
  return categories.find(function(c) { return c.key === key; });
}

function getUnit(categoryKey, unitKey) {
  var cat = getCategory(categoryKey);
  if (!cat) return null;
  return cat.units.find(function(u) { return u.key === unitKey; });
}

function formatResult(result, precision) {
  if (result === null) return '---';
  if (typeof result === 'string') return result;
  if (!isFinite(result)) return '---';
  var abs = Math.abs(result);
  if (abs === 0) return '0';
  if (abs >= 1e12 || abs < 1e-6) return result.toExponential(6);
  var p = Math.max(1, Math.min(100, precision || 6));
  return parseFloat(result.toPrecision(p)).toString();
}

function parseSmartQuery(query) {
  var q = query.toLowerCase().trim();
  
  var valueMatch = q.match(/^(\d+\.?\d*)/);
  var value = valueMatch ? parseFloat(valueMatch[1]) : undefined;
  
  var cleanQuery = valueMatch ? q.slice(valueMatch[0].length).trim() : q;

  var toSeparators = ['to', 'to ', ' 转 ', ' 转换 ', ' 换算 ', ' 等于 ', '等于', '等于多少', '=', '->', '→'];
  
  for (var i = 0; i < categories.length; i++) {
    var cat = categories[i];
    for (var j = 0; j < cat.units.length; j++) {
      var from = cat.units[j];
      for (var k = 0; k < cat.units.length; k++) {
        var to = cat.units[k];
        if (from.key === to.key) continue;
        
        var fromNames = [from.label, from.labelEn.toLowerCase(), from.labelEn.toLowerCase() + 's', from.key, from.label.toLowerCase()];
        var toNames = [to.label, to.labelEn.toLowerCase(), to.labelEn.toLowerCase() + 's', to.key, to.label.toLowerCase()];
        
        var fromAbbrs = [];
        var toAbbrs = [];
        if (from.key === 'km') fromAbbrs.push('kilometer', 'kilometers');
        if (from.key === 'mi') fromAbbrs.push('mile', 'miles');
        if (from.key === 'm') fromAbbrs.push('meter', 'meters', 'metre', 'metres');
        if (from.key === 'ft') fromAbbrs.push('foot', 'feet');
        if (from.key === 'in') fromAbbrs.push('inch', 'inches');
        if (from.key === 'kg') fromAbbrs.push('kilogram', 'kilograms', '公斤');
        if (from.key === 'jin') fromAbbrs.push('catty');
        if (from.key === 'lb') fromAbbrs.push('pound', 'pounds');
        if (from.key === 'oz') fromAbbrs.push('ounce', 'ounces');
        
        if (to.key === 'km') toAbbrs.push('kilometer', 'kilometers');
        if (to.key === 'mi') toAbbrs.push('mile', 'miles');
        if (to.key === 'm') toAbbrs.push('meter', 'meters', 'metre', 'metres');
        if (to.key === 'ft') toAbbrs.push('foot', 'feet');
        if (to.key === 'in') toAbbrs.push('inch', 'inches');
        if (to.key === 'kg') toAbbrs.push('kilogram', 'kilograms', '公斤');
        if (to.key === 'jin') toAbbrs.push('catty');
        if (to.key === 'lb') toAbbrs.push('pound', 'pounds');
        if (to.key === 'oz') toAbbrs.push('ounce', 'ounces');
        
        var allFromNames = fromNames.concat(fromAbbrs);
        var allToNames = toNames.concat(toAbbrs);
        
        for (var l = 0; l < toSeparators.length; l++) {
          var sep = toSeparators[l];
          if (cleanQuery.indexOf(sep) !== -1) {
            var parts = cleanQuery.split(sep);
            for (var m = 0; m < parts.length; m++) {
              parts[m] = parts[m].trim();
            }
            if (parts.length >= 2) {
              var fromPart = parts[0];
              var toPart = parts[parts.length - 1];
              
              var foundFrom = null;
              var foundTo = null;
              
              for (var n = 0; n < allFromNames.length; n++) {
                var name = allFromNames[n];
                if (fromPart.indexOf(name) !== -1 || name.indexOf(fromPart) !== -1) {
                  foundFrom = from.key;
                  break;
                }
              }
              
              for (var o = 0; o < allToNames.length; o++) {
                var name = allToNames[o];
                if (toPart.indexOf(name) !== -1 || name.indexOf(toPart) !== -1) {
                  foundTo = to.key;
                  break;
                }
              }
              
              if (foundFrom && foundTo) {
                return { category: cat, from: from, to: to, value: value };
              }
            }
          }
        }
        
        for (var p = 0; p < allFromNames.length; p++) {
          var fromName = allFromNames[p];
          for (var r = 0; r < allToNames.length; r++) {
            var toName = allToNames[r];
            if (fromName === toName) continue;
            var fromIndex = cleanQuery.indexOf(fromName);
            var toIndex = cleanQuery.indexOf(toName);
            if (fromIndex !== -1 && toIndex !== -1) {
              var isSubstring = (fromName.indexOf(toName) !== -1 && fromIndex < toIndex) || (toName.indexOf(fromName) !== -1 && toIndex < fromIndex);
              if (!isSubstring) {
                return { category: cat, from: from, to: to, value: value };
              }
            }
          }
        }
      }
    }
  }
  return null;
}

function parseHash() {
  var hash = window.location.hash.slice(1);
  var parts = hash.split('/').filter(function(item) { return item; });
  
  if (!hash || parts.length === 0) {
    return { type: 'home' };
  }
  
  if (parts[0] === 'categories') {
    return { type: 'categories' };
  }
  
  if (parts[0] === 'convert') {
    if (parts.length === 1) {
      return { type: 'home' };
    }
    if (parts.length === 2) {
      return { type: 'category', slug: parts[1] };
    }
    if (parts.length >= 3) {
      var pair = parts[2].split('?')[0];
      return { type: 'conversion', slug: parts[1], pair: pair };
    }
  }
  
  return { type: 'home' };
}

function renderHome() {
  var html = '';
  html += '<section class="hero">';
  html += '<h1>WXDHCO Convert</h1>';
  html += '<p>免费在线单位换算工具 - 支持长度、重量、温度、进制、货币汇率、时间戳、编码加密、鞋服尺码等 27 大类、200+ 单位一键转换</p>';
  html += '<div class="search-container">';
  html += '<div class="search-box">';
  html += '<input type="text" id="search-input" placeholder="输入转换，如：千米转英里、100km to miles">';
  html += '<button onclick="handleSearch()">转换</button>';
  html += '</div>';
  html += '<div id="search-error" class="search-error"></div>';
  html += '<div id="search-result" class="search-result"></div>';
  html += '<p class="search-hint">示例：1km to miles | 100千克等于多少磅 | 摄氏度转华氏度</p>';
  html += '</div>';
  html += '</section>';

  html += '<section>';
  html += '<h2 class="section-title">选择转换类型</h2>';
  html += '<div class="category-grid">';
  for (var i = 0; i < categories.length; i++) {
    var cat = categories[i];
    html += '<div class="category-card" onclick="navigateTo(\'convert/' + cat.key + '\')">';
    html += '<span class="category-icon">' + cat.icon + '</span>';
    html += '<div class="category-info">';
    html += '<h3>' + cat.label + '</h3>';
    html += '<p>' + cat.units.length + ' 个单位</p>';
    html += '</div>';
    html += '</div>';
  }
  html += '</div>';
  html += '</section>';

  html += '<section class="info-card">';
  html += '<h2>关于 WXDHCO Convert</h2>';
  html += '<p>WXDHCO Convert是一个完全免费的在线单位换算工具网站。支持长度、重量、温度、面积、体积、速度、时间、数据存储、压力、功率、角度、油耗、能量、数字进制等多种单位类型的互相转换。所有计算在浏览器本地完成，无需上传数据，安全快捷。</p>';
  html += '</section>';
  
  return html;
}

function renderCategories() {
  var html = '';
  html += '<nav class="breadcrumbs">';
  html += '<span onclick="navigateTo(\'\')">首页</span>';
  html += '<span class="separator">/</span>';
  html += '<span>全部分类</span>';
  html += '</nav>';

  html += '<h1 class="page-title">全部分类</h1>';
  html += '<p class="page-subtitle">选择您需要的单位转换类型</p>';

  html += '<div class="category-grid">';
  for (var i = 0; i < categories.length; i++) {
    var cat = categories[i];
    html += '<div class="category-card" onclick="navigateTo(\'convert/' + cat.key + '\')">';
    html += '<span class="category-icon">' + cat.icon + '</span>';
    html += '<div class="category-info">';
    html += '<h3>' + cat.label + '</h3>';
    html += '<p>' + cat.units.length + ' 个单位</p>';
    html += '</div>';
    html += '</div>';
  }
  html += '</div>';
  
  return html;
}

function renderCategoryPage(slug) {
  var cat = getCategory(slug);
  if (!cat) return '<div>未找到该分类</div>';

  var defaultFrom = cat.units[0].key;
  var defaultTo = cat.units[1] ? cat.units[1].key : cat.units[0].key;

  var html = '';
  html += '<nav class="breadcrumbs">';
  html += '<span onclick="navigateTo(\'\')">首页</span>';
  html += '<span class="separator">/</span>';
  html += '<span>' + cat.label + '</span>';
  html += '</nav>';

  html += '<h1 class="page-title">' + cat.icon + ' ' + cat.label + '转换</h1>';
  
  var unitLabels = [];
  for (var i = 0; i < cat.units.length; i++) {
    unitLabels.push(cat.units[i].label);
  }
  html += '<p class="page-subtitle">在线' + cat.label + '单位换算，支持 ' + unitLabels.join('、') + ' 互相转换</p>';

  html += '<div class="converter-widget" id="converter-' + cat.key + '">';
  html += '<div class="converter-row">';
  html += '<div class="converter-column">';
  html += '<label class="converter-label">从</label>';
  var defaultInput = '1';
  if (cat.key === 'color') defaultInput = '#FF5733';
  else if (cat.key === 'base') defaultInput = '10';
  else if (cat.key === 'timestamp') defaultInput = Math.floor(Date.now() / 1000).toString();
  else if (cat.key === 'encoding') defaultInput = 'Hello World';
  else if (cat.key === 'zodiac') defaultInput = new Date().getFullYear().toString();
  else if (cat.key === 'currency') defaultInput = '100';
  else if (cat.key === 'size') defaultInput = '40';
  else if (cat.key === 'font') defaultInput = '16';
  else if (cat.key === 'network') defaultInput = '100';
  else if (cat.key === 'frequency') defaultInput = '1000';
  else if (cat.key === 'temperature') defaultInput = '25';
  else if (cat.key === 'speed') defaultInput = '100';
  else if (cat.key === 'angle') defaultInput = '90';
  else if (cat.key === 'weight') defaultInput = '10';
  html += '<input type="text" class="converter-input" id="input-from" value="' + defaultInput + '" oninput="updateConversion(\'' + cat.key + '\')">';
  html += '<select class="converter-select" id="select-from" onchange="updateConversion(\'' + cat.key + '\')" value="' + defaultFrom + '">';
  for (var i = 0; i < cat.units.length; i++) {
    var u = cat.units[i];
    html += '<option value="' + u.key + '"' + (u.key === defaultFrom ? ' selected' : '') + '>' + u.label + ' (' + u.labelEn + ')</option>';
  }
  html += '</select>';
  html += '</div>';
  html += '<div class="swap-button" onclick="swapUnits(\'' + cat.key + '\')">⇄</div>';
  html += '<div class="converter-column">';
  html += '<label class="converter-label">到</label>';
  html += '<input type="text" class="converter-input readonly" id="input-to" readonly>';
  html += '<select class="converter-select" id="select-to" onchange="updateConversion(\'' + cat.key + '\')" value="' + defaultTo + '">';
  for (var i = 0; i < cat.units.length; i++) {
    var u = cat.units[i];
    html += '<option value="' + u.key + '"' + (u.key === defaultTo ? ' selected' : '') + '>' + u.label + ' (' + u.labelEn + ')</option>';
  }
  html += '</select>';
  html += '</div>';
  html += '</div>';
  html += '<div class="converter-result">';
  html += '<span class="result-info" id="result-info"></span>';
  html += '<button class="copy-button" onclick="copyResult()">复制结果</button>';
  html += '</div>';
  html += '</div>';

  html += '<div class="ad-space">广告位</div>';

  html += '<section>';
  html += '<h2 class="section-title">常用' + cat.label + '转换</h2>';
  html += '<div class="quick-links">';
  
  var unitsSlice = cat.units.slice(0, 6);
  for (var i = 0; i < unitsSlice.length; i++) {
    var from = unitsSlice[i];
    var toUnits = cat.units.filter(function(u) { return u.key !== from.key; }).slice(0, 3);
    for (var j = 0; j < toUnits.length; j++) {
      var to = toUnits[j];
      html += '<div class="quick-link" onclick="navigateTo(\'convert/' + cat.key + '/' + from.key + '-to-' + to.key + '\')">' + from.label + ' 转 ' + to.label + '</div>';
    }
  }
  html += '</div>';
  html += '</section>';

  html += '<section>';
  html += '<h2 class="section-title">' + cat.label + '对照表</h2>';
  html += '<div class="reference-table">';
  html += '<table>';
  html += '<thead>';
  html += '<tr>';
  
  if (cat.key === 'color') {
    html += '<th>颜色</th>';
    html += '<th>HEX</th>';
    html += '<th>RGB</th>';
    html += '<th>颜色名称</th>';
  } else if (cat.key === 'timestamp') {
    html += '<th>Unix时间戳(秒)</th>';
    html += '<th>日期时间</th>';
    html += '<th>ISO 8601</th>';
  } else if (cat.key === 'encoding') {
    html += '<th>明文</th>';
    html += '<th>URL编码</th>';
    html += '<th>Base64</th>';
  } else if (cat.key === 'zodiac') {
    html += '<th>年份</th>';
    html += '<th>生肖</th>';
    html += '<th>年龄</th>';
  } else if (cat.key === 'network') {
    html += '<th>网络速度(Mbps)</th>';
    html += '<th>MB/s</th>';
    html += '<th>KB/s</th>';
  } else if (cat.key === 'electric') {
    html += '<th>伏特(V)</th>';
    html += '<th>毫伏(mV)</th>';
    html += '<th>千伏(kV)</th>';
  } else if (cat.key === 'frequency') {
    html += '<th>频率</th>';
    html += '<th>RPM</th>';
    html += '<th>rad/s</th>';
  } else {
    html += '<th>' + cat.units[0]?.label + '</th>';
    var unitsSlice2 = cat.units.slice(1, 5);
    for (var i = 0; i < unitsSlice2.length; i++) {
      html += '<th>' + unitsSlice2[i].label + '</th>';
    }
  }
  
  html += '</tr>';
  html += '</thead>';
  html += '<tbody>';
  
  if (cat.key === 'color') {
    var colorTable = [
      ['#000000', 'rgb(0, 0, 0)', '黑色'],
      ['#FFFFFF', 'rgb(255, 255, 255)', '白色'],
      ['#FF0000', 'rgb(255, 0, 0)', '红色'],
      ['#00FF00', 'rgb(0, 255, 0)', '绿色'],
      ['#0000FF', 'rgb(0, 0, 255)', '蓝色'],
      ['#FFFF00', 'rgb(255, 255, 0)', '黄色'],
      ['#FF00FF', 'rgb(255, 0, 255)', '品红'],
      ['#00FFFF', 'rgb(0, 255, 255)', '青色'],
      ['#FFA500', 'rgb(255, 165, 0)', '橙色'],
      ['#800080', 'rgb(128, 0, 128)', '紫色'],
      ['#008000', 'rgb(0, 128, 0)', '深绿'],
      ['#808080', 'rgb(128, 128, 128)', '灰色'],
      ['#C0C0C0', 'rgb(192, 192, 192)', '银色'],
      ['#8B4513', 'rgb(139, 69, 19)', '棕色'],
      ['#FFC0CB', 'rgb(255, 192, 203)', '粉色'],
      ['#DC143C', 'rgb(220, 20, 60)', '深红'],
      ['#00CED1', 'rgb(0, 206, 209)', '蓝绿'],
      ['#FFD700', 'rgb(255, 215, 0)', '金色']
    ];
    for (var i = 0; i < colorTable.length; i++) {
      html += '<tr><td style="background-color: ' + colorTable[i][0] + '; width: 30px;"></td><td>' + colorTable[i][0] + '</td><td>' + colorTable[i][1] + '</td><td>' + colorTable[i][2] + '</td></tr>';
    }
  } else if (cat.key === 'currency') {
    var currencyValues = [100, 500, 1000, 5000];
    for (var i = 0; i < currencyValues.length; i++) {
      var v = currencyValues[i];
      html += '<tr>';
      html += '<td>' + v + ' ' + cat.units[0].label + '</td>';
      var unitsSlice3 = cat.units.slice(1, 5);
      for (var j = 0; j < unitsSlice3.length; j++) {
        var u = unitsSlice3[j];
        var r = convert(cat.key, cat.units[0].key, u.key, v);
        html += '<td>' + formatResult(r, 2) + '</td>';
      }
      html += '</tr>';
    }
  } else if (cat.key === 'timestamp') {
    var now = Math.floor(Date.now() / 1000);
    var timestampExamples = [now - 86400, now, now + 86400];
    html += '<tr><td>' + formatResult(timestampExamples[0], 0) + '</td><td>' + convert(cat.key, 'unix', 'datetime', timestampExamples[0]) + '</td><td>' + convert(cat.key, 'unix', 'iso', timestampExamples[0]) + '</td></tr>';
    html += '<tr><td>' + formatResult(timestampExamples[1], 0) + '</td><td>' + convert(cat.key, 'unix', 'datetime', timestampExamples[1]) + '</td><td>' + convert(cat.key, 'unix', 'iso', timestampExamples[1]) + '</td></tr>';
    html += '<tr><td>' + formatResult(timestampExamples[2], 0) + '</td><td>' + convert(cat.key, 'unix', 'datetime', timestampExamples[2]) + '</td><td>' + convert(cat.key, 'unix', 'iso', timestampExamples[2]) + '</td></tr>';
  } else if (cat.key === 'encoding') {
    var encodingExamples = ['Hello World', '你好世界', 'Test 123', '特殊字符: @#$%'];
    for (var i = 0; i < encodingExamples.length; i++) {
      var text = encodingExamples[i];
      html += '<tr><td>' + text + '</td><td>' + convert(cat.key, 'text', 'url', text) + '</td><td>' + convert(cat.key, 'text', 'base64', text) + '</td></tr>';
    }
  } else if (cat.key === 'size') {
    var sizeValues = [36, 38, 40, 42, 44, 46];
    for (var i = 0; i < sizeValues.length; i++) {
      var v = sizeValues[i];
      html += '<tr>';
      html += '<td>' + v + ' ' + cat.units[0].label + '</td>';
      var unitsSlice3 = cat.units.slice(1, 5);
      for (var j = 0; j < unitsSlice3.length; j++) {
        var u = unitsSlice3[j];
        var r = convert(cat.key, cat.units[0].key, u.key, v);
        html += '<td>' + (typeof r === 'number' ? r.toFixed(1) : r) + '</td>';
      }
      html += '</tr>';
    }
  } else if (cat.key === 'font') {
    var fontValues = [12, 14, 16, 18, 20, 24];
    for (var i = 0; i < fontValues.length; i++) {
      var v = fontValues[i];
      html += '<tr>';
      html += '<td>' + v + ' ' + cat.units[0].label + '</td>';
      var unitsSlice3 = cat.units.slice(1, 4);
      for (var j = 0; j < unitsSlice3.length; j++) {
        var u = unitsSlice3[j];
        var r = convert(cat.key, cat.units[0].key, u.key, v);
        html += '<td>' + formatResult(r, 3) + '</td>';
      }
      html += '</tr>';
    }
  } else if (cat.key === 'network') {
    var networkValues = [1, 100, 1000, 10000];
    for (var i = 0; i < networkValues.length; i++) {
      var v = networkValues[i];
      html += '<tr>';
      html += '<td>' + v + ' Mbps</td>';
      var r1 = convert(cat.key, 'mbps', 'mb_s', v);
      var r2 = convert(cat.key, 'mbps', 'kb_s', v * 1000);
      html += '<td>' + formatResult(r1, 2) + ' MB/s</td>';
      html += '<td>' + formatResult(r2, 0) + ' KB/s</td>';
      html += '</tr>';
    }
  } else if (cat.key === 'zodiac') {
    var years = [1990, 2000, 2010, 2020, 2025];
    for (var i = 0; i < years.length; i++) {
      var year = years[i];
      var zodiac = convert(cat.key, 'year', 'zodiac_cn', year);
      var age = convert(cat.key, 'year', 'age', year);
      html += '<tr><td>' + year + '年</td><td>' + zodiac + '</td><td>' + age + '岁</td></tr>';
    }
  } else if (cat.key === 'electric') {
    var electricValues = [1, 10, 100, 1000];
    for (var i = 0; i < electricValues.length; i++) {
      var v = electricValues[i];
      html += '<tr>';
      html += '<td>' + v + ' V</td>';
      var r1 = convert(cat.key, 'v', 'mv', v);
      var r2 = v > 0 ? convert(cat.key, 'v', 'kv', v) : '0';
      html += '<td>' + formatResult(r1, 0) + ' mV</td>';
      html += '<td>' + formatResult(r2, 3) + ' kV</td>';
      html += '</tr>';
    }
  } else if (cat.key === 'frequency') {
    var freqValues = [1000, 1000000, 1000000000, 1000000000000];
    var freqLabels = ['1 kHz', '1 MHz', '1 GHz', '1 THz'];
    for (var i = 0; i < freqValues.length; i++) {
      var v = freqValues[i];
      html += '<tr>';
      html += '<td>' + freqLabels[i] + '</td>';
      var r1 = convert(cat.key, 'hz', 'rpm', v);
      html += '<td>' + formatResult(r1, 0) + ' RPM</td>';
      html += '<td>' + formatResult(v / (2 * Math.PI), 2) + ' rad/s</td>';
      html += '</tr>';
    }
  } else {
    var values = [1, 10, 100, 1000];
    if (cat.key === 'density' || cat.key === 'concentration') {
      values = [1, 10, 100, 1000, 10000];
    }
    for (var i = 0; i < values.length; i++) {
      var v = values[i];
      html += '<tr>';
      html += '<td>' + v + '</td>';
      var unitsSlice3 = cat.units.slice(1, 5);
      for (var j = 0; j < unitsSlice3.length; j++) {
        var u = unitsSlice3[j];
        var r = convert(cat.key, cat.units[0].key, u.key, v);
        html += '<td>' + formatResult(r, 6) + '</td>';
      }
      html += '</tr>';
    }
  }
  
  html += '</tbody>';
  html += '</table>';
  html += '</div>';
  html += '</section>';

  html += '<section class="faq-section">';
  html += '<h2>常见问题</h2>';
  html += '<div>';
  
  if (cat.key === 'color') {
    html += '<details><summary>什么是HEX颜色格式？</summary><p>HEX是网页设计中最常用的颜色表示方法，由#开头，后面跟着6位十六进制数字。</p></details>';
    html += '<details><summary>什么是RGB颜色格式？</summary><p>RGB是一种加法色彩模型，通过混合红色、绿色、蓝色三种原色来生成各种颜色。</p></details>';
    html += '<details><summary>什么是HSL颜色格式？</summary><p>HSL包含三个分量：色相、饱和度、明度。</p></details>';
    html += '<details><summary>如何将HEX转换为RGB？</summary><p>将HEX值的每两位转换为十进制即可。</p></details>';
    html += '<details><summary>网页设计中常用的颜色格式有哪些？</summary><p>常用格式包括HEX、RGB、RGBA、HSL、HSLA。</p></details>';
  } else if (cat.key === 'encoding') {
    html += '<details><summary>什么是URL编码？</summary><p>URL编码是一种将URL中不安全的字符转换为%XX格式的编码方式，常用于URL参数传递。</p></details>';
    html += '<details><summary>什么是Base64编码？</summary><p>Base64是一种将二进制数据编码成ASCII字符串的方法，常用于在文本协议中传输二进制数据。</p></details>';
    html += '<details><summary>Unicode转义字符是什么？</summary><p>Unicode转义字符以\\u开头，后面跟4位十六进制数字，表示Unicode字符码点。</p></details>';
    html += '<details><summary>十六进制字符串是什么？</summary><p>每个字符用两位十六进制数表示其ASCII码值，常用于表示二进制数据。</p></details>';
    html += '<details><summary>为什么需要URL编码？</summary><p>URL只能包含ASCII字符，URL编码可以将特殊字符转换为安全的格式。</p></details>';
  } else if (cat.key === 'timestamp') {
    html += '<details><summary>什么是Unix时间戳？</summary><p>Unix时间戳是从1970年1月1日UTC开始到现在的秒数，是计算机中常用的时间表示方式。</p></details>';
    html += '<details><summary>Unix时间戳有什么用途？</summary><p>时间戳常用于日志记录、数据库存储、API接口等场景，便于时间的比较和计算。</p></details>';
    html += '<details><summary>如何获取当前时间戳？</summary><p>在JavaScript中可以使用Date.now()获取毫秒级时间戳，或Math.floor(Date.now() / 1000)获取秒级时间戳。</p></details>';
    html += '<details><summary>ISO 8601格式是什么？</summary><p>ISO 8601是国际标准的日期时间表示格式，如2024-01-15T10:30:00Z。</p></details>';
  } else if (cat.key === 'zodiac') {
    html += '<details><summary>生肖是如何计算的？</summary><p>中国生肖按农历年份计算，每12年一个循环，从鼠开始依次为牛、虎、兔、龙、蛇、马、羊、猴、鸡、狗、猪。</p></details>';
    html += '<details><summary>星座是如何计算的？</summary><p>星座根据公历出生日期划分，例如白羊座是3月21日至4月19日。</p></details>';
    html += '<details><summary>生肖和星座有什么区别？</summary><p>生肖是中国传统历法，按年份计算；星座是西方占星学，按月份计算。</p></details>';
  } else if (cat.key === 'size') {
    html += '<details><summary>中国码是什么？</summary><p>中国码是中国国家标准鞋码，通常指脚长的毫米数或厘米数，是最常用的鞋码标准。</p></details>';
    html += '<details><summary>美码和欧码有什么区别？</summary><p>美码分男女码，男码和女码起始点不同；欧码是欧洲标准，通常比中国码大，计算公式也不同。</p></details>';
    html += '<details><summary>如何测量脚长？</summary><p>穿上袜子，双脚站立在纸上，用笔标出最长脚趾和脚跟位置，测量两点距离即为脚长。</p></details>';
    html += '<details><summary>购买鞋子需要注意什么？</summary><p>不同品牌的鞋码可能有偏差，建议参考品牌尺码表，并且在下午测量脚长（下午脚会稍微肿胀）。</p></details>';
  } else if (cat.key === 'currency') {
    html += '<details><summary>什么是汇率？</summary><p>汇率是两种货币之间的兑换比率，即一种货币兑换另一种货币的价格。</p></details>';
    html += '<details><summary>汇率是如何确定的？</summary><p>汇率由市场供求关系决定，受经济数据、利率政策、政治因素等多种因素影响。</p></details>';
    html += '<details><summary>为什么汇率会波动？</summary><p>汇率波动主要受国际贸易、投资流动、通货膨胀率、利率差异等因素影响。</p></details>';
    html += '<details><summary>什么是基准汇率？</summary><p>基准汇率是本国货币与关键货币（通常是美元）之间的汇率，是其他汇率计算的基础。</p></details>';
  } else if (cat.key === 'font') {
    html += '<details><summary>什么是像素(px)？</summary><p>像素是屏幕上的最小单位，是网页设计中最常用的字体大小单位。</p></details>';
    html += '<details><summary>em和rem有什么区别？</summary><p>em相对于父元素的字体大小，rem相对于根元素(html)的字体大小，rem更便于响应式设计。</p></details>';
    html += '<details><summary>vw和vh是什么单位？</summary><p>vw是视口宽度的百分比，vh是视口高度的百分比，常用于响应式字体大小。</p></details>';
    html += '<details><summary>网页设计常用的字体大小是多少？</summary><p>正文通常使用14px或16px，标题使用18px-36px不等。</p></details>';
  } else if (cat.key === 'network') {
    html += '<details><summary>网络速度的单位有哪些？</summary><p>常用单位包括bps(比特/秒)、kbps、Mbps、Gbps，以及B/s(字节/秒)、KB/s、MB/s等。</p></details>';
    html += '<details><summary>为什么网速会显示两种单位？</summary><p>ISP通常用Mbps(兆比特/秒)宣传，而下载速度显示为MB/s(兆字节/秒)，1MB/s ≈ 8Mbps。</p></details>';
    html += '<details><summary>什么是宽带？</summary><p>宽带是指能够同时传输多个信号的高速网络连接，通常指下载速度超过25Mbps的连接。</p></details>';
    html += '<details><summary>网速测试结果准确吗？</summary><p>网速测试受网络拥堵、设备性能、测试服务器位置等因素影响，建议多次测试取平均值。</p></details>';
  } else if (cat.key === 'frequency') {
    html += '<details><summary>什么是频率？</summary><p>频率是指周期性事件在单位时间内发生的次数，单位是赫兹(Hz)。</p></details>';
    html += '<details><summary>频率和周期有什么关系？</summary><p>频率是周期的倒数，频率越高，周期越短。</p></details>';
    html += '<details><summary>常见的频率范围有哪些？</summary><p>音频范围20Hz-20kHz，无线电波kHz-MHz，微波GHz，光频率THz级。</p></details>';
    html += '<details><summary>为什么频率很重要？</summary><p>频率决定了信号的特性，在通信、电子、声学等领域都有重要应用。</p></details>';
  } else if (cat.key === 'electric') {
    html += '<details><summary>电压是什么？</summary><p>电压是两点之间的电势差，是推动电流流动的力量，单位是伏特(V)。</p></details>';
    html += '<details><summary>电流是什么？</summary><p>电流是电荷的流动，单位是安培(A)，电流=电压/电阻。</p></details>';
    html += '<details><summary>电阻是什么？</summary><p>电阻是导体对电流的阻碍作用，单位是欧姆(Ω)，符合欧姆定律。</p></details>';
    html += '<details><summary>什么是欧姆定律？</summary><p>欧姆定律指出电压=电流×电阻，即V=IR。</p></details>';
  } else if (cat.key === 'density') {
    html += '<details><summary>什么是密度？</summary><p>密度是物质的质量与体积之比，单位是kg/m³或g/cm³，反映物质的紧密程度。</p></details>';
    html += '<details><summary>密度有什么用途？</summary><p>密度用于计算物体质量、判断物质种类、设计材料等，是物质的重要物理属性。</p></details>';
    html += '<details><summary>水的密度是多少？</summary><p>水在4°C时密度最大，约为1000kg/m³或1g/cm³。</p></details>';
    html += '<details><summary>密度和比重有什么区别？</summary><p>比重是物质密度与水密度的比值，是无量纲的量。</p></details>';
  } else if (cat.key === 'force') {
    html += '<details><summary>什么是力？</summary><p>力是改变物体运动状态的原因，单位是牛顿(N)，F=ma。</p></details>';
    html += '<details><summary>力矩是什么？</summary><p>力矩是力乘以力臂，是使物体转动的效果，单位是牛·米(N·m)。</p></details>';
    html += '<details><summary>千克力是什么？</summary><p>千克力是1千克物体在标准重力下受到的力，约等于9.8牛顿。</p></details>';
    html += '<details><summary>马力是什么单位？</summary><p>马力是功率单位，1马力约等于745.7瓦特。</p></details>';
  } else if (cat.key === 'concentration') {
    html += '<details><summary>什么是浓度？</summary><p>浓度是指单位体积或质量的溶液中所含溶质的量，反映溶液的稀稠程度。</p></details>';
    html += '<details><summary>ppm是什么意思？</summary><p>ppm表示百万分之一，常用于表示非常稀的溶液浓度。</p></details>';
    html += '<details><summary>摩尔浓度是什么？</summary><p>摩尔浓度是单位体积溶液中所含溶质的物质的量，单位是mol/L。</p></details>';
    html += '<details><summary>浓度计算需要注意什么？</summary><p>注意单位统一，稀释时遵循稀释定律：C1V1=C2V2。</p></details>';
  } else if (cat.key === 'base') {
    html += '<details><summary>什么是进制？</summary><p>进制是计数的方式，常用的有二进制、八进制、十进制、十六进制。</p></details>';
    html += '<details><summary>二进制有什么用途？</summary><p>二进制是计算机的基础，只用0和1表示所有数据。</p></details>';
    html += '<details><summary>十六进制有什么优势？</summary><p>十六进制可以紧凑地表示二进制数据，每个十六进制数字对应4位二进制。</p></details>';
    html += '<details><summary>如何转换进制？</summary><p>先转换为十进制，再转换为目标进制；或直接使用位运算。</p></details>';
  } else if (cat.key === 'length') {
    html += '<details><summary>国际单位制的长度单位是什么？</summary><p>国际单位制中长度的基本单位是米(m)，其他单位都是米的倍数或分数。</p></details>';
    html += '<details><summary>公里和英里有什么区别？</summary><p>公里是国际单位，1公里=1000米；英里是英制单位，1英里≈1.609公里。</p></details>';
    html += '<details><summary>海里是什么单位？</summary><p>海里是航海单位，1海里=1852米，用于航海和航空。</p></details>';
    html += '<details><summary>光年是什么？</summary><p>光年是长度单位，表示光在真空中一年传播的距离，约等于9.46×10¹²公里。</p></details>';
  } else if (cat.key === 'area') {
    html += '<details><summary>面积单位有哪些？</summary><p>常用单位包括平方米、平方千米、公顷、亩、平方英尺、英亩等。</p></details>';
    html += '<details><summary>公顷和亩有什么区别？</summary><p>1公顷=10000平方米，1亩≈666.67平方米，1公顷≈15亩。</p></details>';
    html += '<details><summary>什么是建筑面积？</summary><p>建筑面积是建筑物各层面积的总和，包括使用面积、辅助面积和结构面积。</p></details>';
    html += '<details><summary>如何计算面积？</summary><p>矩形面积=长×宽，圆形面积=π×半径²，三角形面积=底×高÷2。</p></details>';
  } else if (cat.key === 'volume') {
    html += '<details><summary>体积单位有哪些？</summary><p>常用单位包括立方米、升、毫升、立方英尺、加仑等。</p></details>';
    html += '<details><summary>升和立方米的关系？</summary><p>1立方米=1000升，1升=1立方分米=1000毫升。</p></details>';
    html += '<details><summary>加仑有几种？</summary><p>加仑有美制加仑和英制加仑，1美制加仑≈3.785升，1英制加仑≈4.546升。</p></details>';
    html += '<details><summary>如何计算体积？</summary><p>长方体体积=长×宽×高，圆柱体体积=π×半径²×高。</p></details>';
  } else if (cat.key === 'weight') {
    html += '<details><summary>重量和质量有什么区别？</summary><p>质量是物体所含物质的量，重量是物体受重力的大小，在地球表面近似相等。</p></details>';
    html += '<details><summary>吨是什么单位？</summary><p>吨是质量单位，1吨=1000千克，是常用的大宗货物计量单位。</p></details>';
    html += '<details><summary>斤和公斤的关系？</summary><p>1公斤=2斤，1斤=500克，是中国常用的市制单位。</p></details>';
    html += '<details><summary>盎司是什么单位？</summary><p>盎司是英制单位，1盎司≈28.35克，常用于计量贵金属和药品。</p></details>';
  } else if (cat.key === 'temperature') {
    html += '<details><summary>摄氏度和华氏度有什么区别？</summary><p>摄氏度是国际标准，水的冰点0°C、沸点100°C；华氏度主要在美国使用，冰点32°F、沸点212°F。</p></details>';
    html += '<details><summary>什么是开尔文？</summary><p>开尔文是热力学温度单位，0K是绝对零度，水的冰点是273.15K。</p></details>';
    html += '<details><summary>绝对零度是多少？</summary><p>绝对零度是-273.15°C，是理论上的最低温度，分子停止热运动。</p></details>';
    html += '<details><summary>人体正常体温是多少？</summary><p>人体正常体温约为36.5-37.5°C，或97.7-99.5°F。</p></details>';
  } else if (cat.key === 'speed') {
    html += '<details><summary>速度的单位有哪些？</summary><p>常用单位包括米/秒、千米/小时、英里/小时、节、马赫等。</p></details>';
    html += '<details><summary>节是什么单位？</summary><p>节是航海速度单位，1节=1海里/小时≈1.852公里/小时。</p></details>';
    html += '<details><summary>马赫是什么？</summary><p>马赫是速度与声速的比值，1马赫≈1225公里/小时（海平面）。</p></details>';
    html += '<details><summary>光速是多少？</summary><p>光速约为299792458米/秒，是宇宙中最快的速度。</p></details>';
  } else if (cat.key === 'time') {
    html += '<details><summary>时间单位有哪些？</summary><p>常用单位包括秒、分钟、小时、天、周、月、年等。</p></details>';
    html += '<details><summary>为什么有闰年？</summary><p>闰年是为了弥补公历年份与地球公转周期的差异，每4年加一天。</p></details>';
    html += '<details><summary>毫秒和微秒是什么？</summary><p>毫秒是千分之一秒，微秒是百万分之一秒，用于精确计时。</p></details>';
    html += '<details><summary>时间是如何测量的？</summary><p>现代时间基于原子钟，利用原子的振动频率来精确计时。</p></details>';
  } else if (cat.key === 'data') {
    html += '<details><summary>数据存储单位有哪些？</summary><p>常用单位包括比特、字节、KB、MB、GB、TB、PB等，按1024倍递增。</p></details>';
    html += '<details><summary>比特和字节的区别？</summary><p>比特是最小单位，只有0和1；字节由8位组成，是基本存储单位。</p></details>';
    html += '<details><summary>为什么存储容量显示与标称不符？</summary><p>厂商按1000进制计算，而操作系统按1024进制计算，导致显示容量小于标称。</p></details>';
    html += '<details><summary>什么是云计算存储？</summary><p>云计算存储是将数据存储在远程服务器上，通过网络访问，提供弹性和可扩展性。</p></details>';
  } else if (cat.key === 'pressure') {
    html += '<details><summary>什么是压力？</summary><p>压力是单位面积上受到的力，单位是帕斯卡(Pa)，P=F/S。</p></details>';
    html += '<details><summary>标准大气压是多少？</summary><p>标准大气压约为101325帕，或1个大气压，相当于海平面的气压。</p></details>';
    html += '<details><summary>什么是巴(bar)？</summary><p>巴是常用的压力单位，1巴=100000帕，约等于1个大气压。</p></details>';
    html += '<details><summary>PSI是什么单位？</summary><p>PSI是磅/平方英寸，是英制压力单位，1PSI≈6894.76帕。</p></details>';
  } else if (cat.key === 'power') {
    html += '<details><summary>什么是功率？</summary><p>功率是单位时间内做的功，单位是瓦特(W)，P=W/t。</p></details>';
    html += '<details><summary>千瓦和马力的关系？</summary><p>1马力≈0.7457千瓦，1千瓦≈1.341马力。</p></details>';
    html += '<details><summary>什么是BTU？</summary><p>BTU是英制热单位，1BTU≈1055焦耳，常用于表示空调和暖气的功率。</p></details>';
    html += '<details><summary>电器功率越大越好吗？</summary><p>功率越大表示做功越快，但能耗也越高，需根据需求选择合适功率。</p></details>';
  } else if (cat.key === 'angle') {
    html += '<details><summary>角度单位有哪些？</summary><p>常用单位包括度、弧度、梯度、角分、角秒等。</p></details>';
    html += '<details><summary>弧度是什么？</summary><p>弧度是国际单位制的角度单位，1弧度≈57.3度，圆的周长=2π弧度。</p></details>';
    html += '<details><summary>直角是多少度？</summary><p>直角是90度，平角是180度，周角是360度。</p></details>';
    html += '<details><summary>角度和弧度如何转换？</summary><p>度转弧度：弧度=度×π/180；弧度转度：度=弧度×180/π。</p></details>';
  } else if (cat.key === 'fuel') {
    html += '<details><summary>油耗单位有哪些？</summary><p>常用单位包括L/100km、MPG(英里/加仑)、km/L等。</p></details>';
    html += '<details><summary>L/100km和MPG有什么区别？</summary><p>L/100km表示每100公里消耗的油量，数值越小越省油；MPG表示每加仑油能行驶的英里数，数值越大越省油。</p></details>';
    html += '<details><summary>什么是燃油经济性？</summary><p>燃油经济性是指车辆消耗单位燃料能行驶的距离，是衡量汽车节能性能的指标。</p></details>';
    html += '<details><summary>如何计算油耗？</summary><p>油耗=加油量÷行驶里程×100，得到L/100km。</p></details>';
  } else if (cat.key === 'energy') {
    html += '<details><summary>能量单位有哪些？</summary><p>常用单位包括焦耳、千焦、卡路里、千卡、千瓦时、电子伏特等。</p></details>';
    html += '<details><summary>卡路里和千卡的关系？</summary><p>1千卡=1000卡路里，日常所说的卡路里通常指千卡。</p></details>';
    html += '<details><summary>什么是千瓦时？</summary><p>千瓦时是电能单位，1千瓦时=1度电，等于1千瓦功率工作1小时消耗的能量。</p></details>';
    html += '<details><summary>食物热量如何计算？</summary><p>食物热量通常用千卡表示，通过燃烧法或营养成分计算得出。</p></details>';
  } else {
    var unitsSlice4 = cat.units.slice(0, 3);
    for (var i = 0; i < unitsSlice4.length; i++) {
      var from = unitsSlice4[i];
      var toUnits = cat.units.filter(function(u) { return u.key !== from.key; }).slice(0, 2);
      for (var j = 0; j < toUnits.length; j++) {
        var to = toUnits[j];
        var r = convert(cat.key, from.key, to.key, 1);
        html += '<details><summary>1' + from.label + '等于多少' + to.label + '？</summary><p>1' + from.label + '(' + from.labelEn + ') = ' + formatResult(r, 8) + ' ' + to.label + '(' + to.labelEn + ')</p></details>';
      }
    }
  }
  
  html += '</div>';
  html += '</section>';
  
  return html;
}

function renderConversionPage(slug, pair) {
  var cat = getCategory(slug);
  if (!cat) return '<div>未找到该分类</div>';

  var fromKey = pair.split('-to-')[0];
  var toKey = pair.replace(fromKey + '-to-', '');
  var fromU = getUnit(slug, fromKey);
  var toU = getUnit(slug, toKey);
  if (!fromU || !toU) return '<div>未找到该转换</div>';

  var result1 = convert(slug, fromKey, toKey, 1);

  var html = '';
  html += '<nav class="breadcrumbs">';
  html += '<span onclick="navigateTo(\'\')">首页</span>';
  html += '<span class="separator">/</span>';
  html += '<span onclick="navigateTo(\'convert/' + cat.key + '\')">' + cat.label + '</span>';
  html += '<span class="separator">/</span>';
  html += '<span>' + fromU.label + '转' + toU.label + '</span>';
  html += '</nav>';

  html += '<h1 class="page-title">' + fromU.label + ' 转 ' + toU.label + '</h1>';
  html += '<p class="page-subtitle">' + fromU.label + '(' + fromU.labelEn + ') 到 ' + toU.label + '(' + toU.labelEn + ') 在线换算工具</p>';

  html += '<div class="converter-widget" id="converter-' + cat.key + '">';
  html += '<div class="converter-row">';
  html += '<div class="converter-column">';
  html += '<label class="converter-label">从</label>';
  var defaultInput = '1';
  if (cat.key === 'color') defaultInput = '#FF5733';
  else if (cat.key === 'base') defaultInput = '10';
  else if (cat.key === 'timestamp') defaultInput = Math.floor(Date.now() / 1000).toString();
  else if (cat.key === 'encoding') defaultInput = 'Hello World';
  else if (cat.key === 'zodiac') defaultInput = new Date().getFullYear().toString();
  else if (cat.key === 'currency') defaultInput = '100';
  else if (cat.key === 'size') defaultInput = '40';
  else if (cat.key === 'font') defaultInput = '16';
  else if (cat.key === 'network') defaultInput = '100';
  else if (cat.key === 'frequency') defaultInput = '1000';
  else if (cat.key === 'temperature') defaultInput = '25';
  else if (cat.key === 'speed') defaultInput = '100';
  else if (cat.key === 'angle') defaultInput = '90';
  else if (cat.key === 'weight') defaultInput = '10';
  html += '<input type="text" class="converter-input" id="input-from" value="' + defaultInput + '" oninput="updateConversion(\'' + cat.key + '\')">';
  html += '<select class="converter-select" id="select-from" onchange="updateConversion(\'' + cat.key + '\')">';
  for (var i = 0; i < cat.units.length; i++) {
    var u = cat.units[i];
    html += '<option value="' + u.key + '"' + (u.key === fromKey ? ' selected' : '') + '>' + u.label + ' (' + u.labelEn + ')</option>';
  }
  html += '</select>';
  html += '</div>';
  html += '<div class="swap-button" onclick="swapUnits(\'' + cat.key + '\')">⇄</div>';
  html += '<div class="converter-column">';
  html += '<label class="converter-label">到</label>';
  html += '<input type="text" class="converter-input readonly" id="input-to" readonly>';
  html += '<select class="converter-select" id="select-to" onchange="updateConversion(\'' + cat.key + '\')">';
  for (var i = 0; i < cat.units.length; i++) {
    var u = cat.units[i];
    html += '<option value="' + u.key + '"' + (u.key === toKey ? ' selected' : '') + '>' + u.label + ' (' + u.labelEn + ')</option>';
  }
  html += '</select>';
  html += '</div>';
  html += '</div>';
  html += '<div class="converter-result">';
  html += '<span class="result-info" id="result-info"></span>';
  html += '<button class="copy-button" onclick="copyResult()">复制结果</button>';
  html += '</div>';
  html += '</div>';

  html += '<div class="ad-space">广告位</div>';

  html += '<div class="conversion-details">';
  html += '<h2>换算详情</h2>';
  
  var result1Str = result1 !== null ? (typeof result1 === 'number' ? result1.toPrecision(8) : result1) : '---';
  html += '<p>1 ' + fromU.label + ' = <strong>' + result1Str + '</strong> ' + toU.label + '</p>';
  
  var result2 = convert(slug, toKey, fromKey, 1);
  var result2Str = result2 !== null ? (typeof result2 === 'number' ? result2.toPrecision(8) : result2) : '---';
  html += '<p>1 ' + toU.label + ' = <strong>' + result2Str + '</strong> ' + fromU.label + '</p>';

  html += '<h3>常用对照表</h3>';
  html += '<div class="conversion-table">';
  
  var values = [0.01, 0.1, 1, 2, 5, 10, 20, 50, 100, 500, 1000, 5000];
  for (var i = 0; i < values.length; i++) {
    var v = values[i];
    var r = convert(slug, fromKey, toKey, v);
    if (r !== null) {
      var rStr = typeof r === 'number' ? parseFloat(r.toPrecision(Math.max(1, Math.min(100, 6)))).toString() : r;
      html += '<div class="conversion-item">' + v + ' ' + fromU.label + ' = ' + rStr + ' ' + toU.label + '</div>';
    }
  }
  
  html += '</div>';
  html += '</div>';

  html += '<section class="faq-section">';
  html += '<h2>常见问题</h2>';
  if (slug === 'encoding') {
    html += '<details><summary>什么是URL编码？</summary><p>URL编码是一种将URL中不安全的字符转换为%XX格式的编码方式，常用于URL参数传递。</p></details>';
    html += '<details><summary>什么是Base64编码？</summary><p>Base64是一种将二进制数据编码成ASCII字符串的方法，常用于在文本协议中传输二进制数据。</p></details>';
    html += '<details><summary>Unicode转义字符是什么？</summary><p>Unicode转义字符以\\u开头，后面跟4位十六进制数字，表示Unicode字符码点。</p></details>';
    html += '<details><summary>十六进制字符串是什么？</summary><p>每个字符用两位十六进制数表示其ASCII码值，常用于表示二进制数据。</p></details>';
  } else {
    var result1Precision = result1 !== null ? (typeof result1 === 'number' ? parseFloat(result1.toPrecision(Math.max(1, Math.min(100, 8)))).toString() : result1) : '---';
    html += '<details><summary>1' + fromU.label + '等于多少' + toU.label + '？</summary><p>1' + fromU.label + '(' + fromU.labelEn + ') = ' + result1Precision + ' ' + toU.label + '(' + toU.labelEn + ')</p></details>';
    html += '<details><summary>怎么把' + fromU.label + '换算成' + toU.label + '？</summary><p>将' + fromU.label + '的数值乘以 ' + result1Precision + ' 即可得到' + toU.label + '的值。</p></details>';
  }
  html += '</section>';
  
  return html;
}

function renderContent() {
  var page = parseHash();
  var mainContent = document.getElementById('main-content');
  
  switch (page.type) {
    case 'home':
      mainContent.innerHTML = renderHome();
      break;
    case 'categories':
      mainContent.innerHTML = renderCategories();
      break;
    case 'category':
      mainContent.innerHTML = renderCategoryPage(page.slug);
      updateConversion(page.slug);
      break;
    case 'conversion':
      mainContent.innerHTML = renderConversionPage(page.slug, page.pair);
      updateConversion(page.slug);
      break;
    default:
      mainContent.innerHTML = renderHome();
  }
}

function updateConversion(categoryKey) {
  var cat = getCategory(categoryKey);
  if (!cat) return;

  var inputFrom = document.getElementById('input-from');
  var inputTo = document.getElementById('input-to');
  var selectFrom = document.getElementById('select-from');
  var selectTo = document.getElementById('select-to');
  var resultInfo = document.getElementById('result-info');

  if (!inputFrom || !inputTo || !selectFrom || !selectTo) return;

  var fromKey = selectFrom.value || cat.units[0].key;
  var toKey = selectTo.value || (cat.units[1] ? cat.units[1].key : cat.units[0].key);
  var value = inputFrom.value;

  if (!value || value.trim() === '') {
    inputTo.value = '';
    return;
  }

  var needsNumber = cat.key !== 'base' && cat.key !== 'color' && cat.key !== 'encoding' && cat.key !== 'timestamp' && cat.key !== 'zodiac';
  if (needsNumber) {
    var num = parseFloat(value);
    if (isNaN(num) || !isFinite(num)) {
      inputTo.value = '';
      return;
    }
  }

  var result = convert(cat.key, fromKey, toKey, value);

  if (result !== null && result !== undefined) {
    if (typeof result === 'string') {
      inputTo.value = result;
    } else if (isFinite(result)) {
      var abs = Math.abs(result);
      if (abs === 0) inputTo.value = '0';
      else if (abs >= 1e12 || abs < 1e-6) inputTo.value = result.toExponential(6);
      else inputTo.value = parseFloat(result.toPrecision(10)).toString();
    } else {
      inputTo.value = '---';
    }
  } else {
    inputTo.value = '---';
  }

  var fromU = getUnit(cat.key, fromKey);
  var toU = getUnit(cat.key, toKey);
  if (fromU && toU) {
    resultInfo.textContent = fromU.label + ' (' + fromU.labelEn + ') → ' + toU.label + ' (' + toU.labelEn + ')';
  }
}

function swapUnits(categoryKey) {
  var selectFrom = document.getElementById('select-from');
  var selectTo = document.getElementById('select-to');
  var inputFrom = document.getElementById('input-from');
  var inputTo = document.getElementById('input-to');

  if (!selectFrom || !selectTo || !inputFrom || !inputTo) return;

  var tmpKey = selectFrom.value;
  var tmpVal = inputFrom.value;

  selectFrom.value = selectTo.value;
  inputFrom.value = inputTo.value;
  selectTo.value = tmpKey;
  inputTo.value = tmpVal;

  updateConversion(categoryKey);
}

function copyResult() {
  var inputTo = document.getElementById('input-to');
  var copyBtn = document.querySelector('.copy-button');
  
  if (!inputTo) return;
  
  navigator.clipboard.writeText(inputTo.value);
  
  if (copyBtn) {
    var originalText = copyBtn.textContent;
    copyBtn.textContent = '✓ 已复制';
    setTimeout(function() {
      copyBtn.textContent = originalText;
    }, 1500);
  }
}

function handleSearch() {
  var input = document.getElementById('search-input');
  var errorDiv = document.getElementById('search-error');
  var resultDiv = document.getElementById('search-result');
  
  if (!input) return;
  
  var query = input.value.trim();
  
  if (!query) {
    errorDiv.textContent = '请输入要转换的内容';
    input.classList.add('error');
    resultDiv.style.display = 'none';
    return;
  }
  
  errorDiv.textContent = '';
  input.classList.remove('error');
  
  var parsed = parseSmartQuery(query);
  
  if (parsed) {
    var value = parsed.value !== undefined ? parsed.value : 1;
    var convertResult = convert(parsed.category.key, parsed.from.key, parsed.to.key, value);
    
    var resultText = '';
    if (convertResult !== null && convertResult !== undefined) {
      var formattedResult = typeof convertResult === 'string' ? convertResult : parseFloat(convertResult.toPrecision(10)).toString();
      resultText = '<div class="result-value">' + value + ' ' + parsed.from.label + ' = ' + formattedResult + ' ' + parsed.to.label + '</div>';
      resultText += '<div class="result-info">(' + parsed.from.labelEn + ' → ' + parsed.to.labelEn + ')</div>';
      resultText += '<button class="result-button" onclick="navigateTo(\'convert/' + parsed.category.key + '/' + parsed.from.key + '-to-' + parsed.to.key + '\')">查看详细转换</button>';
    } else {
      resultText = '<div class="result-error">转换失败，请检查输入</div>';
    }
    
    resultDiv.innerHTML = resultText;
    resultDiv.style.display = 'block';
  } else {
    errorDiv.textContent = '无法识别的转换，请尝试：千米转英里、100km to miles 等';
    input.classList.add('error');
    resultDiv.style.display = 'none';
  }
}

function handleHashChange() {
  renderContent();
}

document.addEventListener('DOMContentLoaded', function() {
  renderContent();
});

window.addEventListener('hashchange', handleHashChange);

window.handleSearch = handleSearch;
window.updateConversion = updateConversion;
window.swapUnits = swapUnits;
window.copyResult = copyResult;
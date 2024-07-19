export function validateAndGetColor(colorString: string) {
  // Verify if the color already is a hex
  if (colorString.startsWith('#')) return colorString;
  return colorToHex(colorString);
}

/// Decides the color format type and converts it to hexadecimal format.
///
/// Detects the type of color from [color] and calls the corresponding conversion function:
/// - If [color] starts with 'rgb(', converts it using [rgbToHex].
/// - If [color] starts with 'rgba(', converts it using [rgbaToHex].
/// - If [color] starts with 'hsl(', converts it using [hslToHex].
/// - If [color] starts with 'hsla(', converts it using [hslaToHex].
/// Throws [ArgumentError] if the color format is not supported.
///
/// Parameters:
/// - [color]: The input color string to convert to hexadecimal format.
///
/// Returns:
/// The converted color string in hexadecimal format.
export function colorToHex(color: string) {
  if (color.startsWith('rgb(')) {
    return rgbToHex(color);
  } else if (color.startsWith('rgba(')) {
    return rgbaToHex(color);
  } else if (color.startsWith('hsl(')) {
    return hslToHex(color);
  } else if (color.startsWith('hsla(')) {
    return hslaToHex(color);
  } else {
    throw new Error(`color format not supported: ${color}`);
  }
}

/// Parses an RGB color string to a valid hexadecimal color string.
///
/// Converts the RGB color format string [rgb] (e.g., 'rgb(255, 0, 0)') to its hexadecimal representation.
///
/// Parameters:
/// - [rgb]: The RGB color string to convert to hexadecimal format.
///
/// Returns:
/// The converted color string in hexadecimal format.
export function rgbToHex(rgb: string) {
  rgb = rgb.replace('rgb(', '').replace(')', '');
  const rgbValues = rgb.split(',');
  const r = parseInt(rgbValues[0].trim(), 10);
  const g = parseInt(rgbValues[1].trim(), 10);
  const b = parseInt(rgbValues[2].trim(), 10);
  return toHex(r, g, b, 255);
}

/// Parses an RGBA color string to a valid hexadecimal color string.
///
/// Converts the RGBA color format string [rgba] (e.g., 'rgba(255, 0, 0, 0.5)') to its hexadecimal representation.
///
/// Parameters:
/// - [rgba]: The RGBA color string to convert to hexadecimal format.
///
/// Returns:
/// The converted color string in hexadecimal format.
export function rgbaToHex(rgba: string) {
  rgba = rgba.replace('rgba(', '').replace(')', '');
  const rgbaValues = rgba.split(',');
  const r = parseInt(rgbaValues[0].trim(), 10);
  const g = parseInt(rgbaValues[1].trim(), 10);
  const b = parseInt(rgbaValues[2].trim(), 10);
  const a = parseFloat(rgbaValues[3].trim());
  const alpha = Math.round(a * 255);
  return toHex(r, g, b, alpha);
}

/// Parses an HSL color string to a valid hexadecimal color string.
///
/// Converts the HSL color format string [hsl] (e.g., 'hsl(0, 100%, 50%)') to its hexadecimal representation.
///
/// Parameters:
/// - [hsl]: The HSL color string to convert to hexadecimal format.
///
/// Returns:
/// The converted color string in hexadecimal format.
export function hslToHex(hsl: string) {
  hsl = hsl.replace('hsl(', '').replace(')', '');
  const hslValues = hsl.split(',');
  const h = parseFloat(hslValues[0].trim());
  const s = parseFloat(hslValues[1].replace('%', '').trim()) / 100;
  const l = parseFloat(hslValues[2].replace('%', '').trim()) / 100;
  const rgb = hslToRgb(h, s, l);
  return toHex(rgb[0], rgb[1], rgb[2], 255);
}

/// Parses an HSLA color string to a valid hexadecimal color string.
///
/// Converts the HSLA color format string [hsla] (e.g., 'hsla(0, 100%, 50%, 0.5)') to its hexadecimal representation.
///
/// Parameters:
/// - [hsla]: The HSLA color string to convert to hexadecimal format.
///
/// Returns:
/// The converted color string in hexadecimal format.
export function hslaToHex(hsla: string) {
  hsla = hsla.replace('hsla(', '').replace(')', '');
  const hslaValues = hsla.split(',');
  const h = parseFloat(hslaValues[0].trim());
  const s = parseFloat(hslaValues[1].replace('%', '').trim()) / 100;
  const l = parseFloat(hslaValues[2].replace('%', '').trim()) / 100;
  const a = parseFloat(hslaValues[3].trim());
  const alpha = Math.round(a * 255);
  const rgb = hslToRgb(h, s, l);
  return toHex(rgb[0], rgb[1], rgb[2], alpha);
}

/// Converts HSL (Hue, Saturation, Lightness) values to RGB (Red, Green, Blue) values.
///
/// Converts the HSL color values [h], [s], and [l] to RGB values.
///
/// Parameters:
/// - [h]: Hue value (0-360).
/// - [s]: Saturation value (0-1).
/// - [l]: Lightness value (0-1).
///
/// Returns:
/// A list of integers representing the RGB values ([red, green, blue]).
export function hslToRgb(h: number, s: number, l: number) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
  } else if (h >= 120 && h < 180) {
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    b = x;
  }

  const red = Math.round((r + m) * 255);
  const green = Math.round((g + m) * 255);
  const blue = Math.round((b + m) * 255);

  return [red, green, blue];
}

/// Converts RGB (Red, Green, Blue) values to a hexadecimal color string.
///
/// Converts the RGB values [r], [g], [b], and optional [a] (alpha) to a hexadecimal color string.
///
/// Parameters:
/// - [r]: Red value (0-255).
/// - [g]: Green value (0-255).
/// - [b]: Blue value (0-255).
/// - [a]: Alpha value (0-255), optional. Defaults to 255 (fully opaque).
///
/// Returns:
/// The converted color string in hexadecimal format.
export function toHex(r: number, g: number, b: number, a = 255) {
  const hexR = r.toString(16).padStart(2, '0');
  const hexG = g.toString(16).padStart(2, '0');
  const hexB = b.toString(16).padStart(2, '0');
  const hexA = a.toString(16).padStart(2, '0');
  return `#${hexR}${hexG}${hexB}${hexA}`;
}

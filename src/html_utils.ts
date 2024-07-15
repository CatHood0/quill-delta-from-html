import { AttributeMap } from 'quill-delta';
import { HTMLElement } from 'node-html-parser';
import { validateAndGetColor } from './colors';
import { parseToIndent } from './indent_parser';
import { parseToPx } from './fontsize_parser';

export function getInlineAttributes(element: HTMLElement): AttributeMap {
  const attributes: AttributeMap = {};
  if (element.tagName === 'strong') attributes.bold = true;
  if (element.tagName === 'em') attributes.italic = true;
  if (element.tagName === 'u') attributes.underline = true;
  if (element.tagName === 's') attributes.strike = true;
  if (element.tagName === 'sub') attributes.script = 'sub';
  if (element.tagName === 'sup') attributes.script = 'super';
  return attributes;
}

export function parseStyleAttribute(style: string): AttributeMap {
  const attributes: AttributeMap = {};
  if (!style) return attributes;

  const styles = style.split(';');

  styles.forEach((style: string) => {
    const parts = style.split(':');
    if (parts.length === 2) {
      const key = parts[0].trim();
      const value = parts[1].trim();

      switch (key) {
        case 'text-align':
          attributes['align'] = value;
          break;
        case 'color':
          const color: string = validateAndGetColor(value);
          attributes['color'] = color;
          break;
        case 'background-color':
          const bgColor: string = validateAndGetColor(value);
          attributes['background'] = bgColor;
          break;
        case 'padding-left':
        case 'padding-right':
          const indentation = parseToIndent(value);
          if (indentation !== 0) {
            attributes['indent'] = indentation;
          }
          break;
        case 'font-size':
          let sizeToPass: string;

          // Handle default values
          if (value === '0.75em') {
            sizeToPass = 'small';
          } else if (value === '1.5em') {
            sizeToPass = 'large';
          } else if (value === '2.5em') {
            sizeToPass = 'huge';
          } else {
            try {
              const size = parseToPx(value);
              if (size <= 10) {
                sizeToPass = 'small';
              } else {
                sizeToPass = `${Math.floor(size)}`;
              }
            } catch (e) {
              // Ignore error
              break;
            }
          }
          attributes['size'] = sizeToPass;
          break;
        case 'font-family':
          attributes['font'] = value;
          break;
        default:
          break;
      }
    } else {
      switch (style) {
        case 'justify':
        case 'center':
        case 'left':
        case 'right':
          attributes['align'] = style;
          break;
        case 'rtl':
          attributes['direction'] = 'rtl';
          break;
        case 'true':
          attributes['list'] = 'checked';
          break;
        case 'false':
          attributes['list'] = 'unchecked';
          break;
        default:
          break;
      }
    }
  });

  return attributes;
}

export function parseImageStyleAttribute(style: string): AttributeMap {
  const attributes: AttributeMap = {};

  const styles = style.split(';');
  styles.forEach((style) => {
    const parts = style.split(':');
    if (parts.length === 2) {
      const key = parts[0].trim();
      const value = parts[1].trim();

      switch (key) {
        case 'width':
          attributes['width'] = value;
          break;
        case 'height':
          attributes['height'] = value;
          break;
        case 'margin':
          attributes['margin'] = value;
          break;
        default:
          // Ignore other styles
          break;
      }
    }
  });
  return attributes;
}

export function isInline(tagName: string): Boolean {
  return ['strong', 'em', 'u', 's', 'sub', 'sup'].includes(tagName);
}

export function isBlock(tagName: string): Boolean {
  return [
    'p',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ul',
    'ol',
    'li',
    'img',
    'video',
    'blockquote',
    'pre',
    'div',
  ].includes(tagName);
}
/**
 * Ensure to detect italic html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export function isItalic(element: HTMLElement): boolean {
  return element.localName === 'em' || element.localName === 'i';
}

/**
 * Ensure to detect bold html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export function isStrong(element: HTMLElement): boolean {
  return element.localName === 'strong' || element.localName === 'b';
}

/**
 * Ensure to detect underline html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export function isUnderline(element: HTMLElement): boolean {
  return element.localName === 'ins' || element.localName === 'u';
}

/**
 * Ensure to detect strikethrough html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export function isStrike(element: HTMLElement): boolean {
  return element.localName === 's' || element.localName === 'del';
}

/**
 * Ensure to detect p html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export function isParagraph(element: HTMLElement): boolean {
  return element.localName === 'p';
}

/**
 * Ensure to detect sub html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export function isSubscript(element: HTMLElement): boolean {
  return element.localName === 'sub';
}

/**
 * Ensure to detect sup html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export function isSuperscript(element: HTMLElement): boolean {
  return element.localName === 'sup';
}

/**
 * Ensure to detect br html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export function isBreakLine(element: HTMLElement): boolean {
  return element.localName === 'br';
}

/**
 * Ensure to detect span html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export function isSpan(element: HTMLElement): boolean {
  return element.localName === 'span';
}

/**
 * Ensure to detect h(1-6) html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export function isHeader(element: HTMLElement): boolean {
  return element.localName != null && /h[1-6]/.test(element.localName);
}

/**
 * Ensure to detect img html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export function isImg(element: HTMLElement): boolean {
  return element.localName === 'img';
}

/**
 * Ensure to detect li, ul, ol, <input type=checkbox> html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export function isList(element: HTMLElement): boolean {
  return (
    element.localName === 'li' ||
    element.localName === 'ul' ||
    element.localName === 'ol'
  );
}

/**
 * Ensure to detect video html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export function isVideo(element: HTMLElement): boolean {
  return element.localName === 'video';
}

/**
 * Ensure to detect a html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export function isLink(element: HTMLElement): boolean {
  return element.localName === 'a';
}

/**
 * Ensure to detect blockquote html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export function isBlockquote(element: HTMLElement): boolean {
  return element.localName === 'blockquote';
}

/**
 * Ensure to detect pre, code html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export function isCodeBlock(element: HTMLElement): boolean {
  return element.localName === 'pre' || element.localName === 'code';
}

/**
 * Ensure to detect div html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export function isDivBlock(element: HTMLElement): Boolean {
  return element.localName === 'div';
}

import { AttributeMap } from 'quill-delta';
import { HTMLElement } from 'node-html-parser';
export declare function getInlineAttributes(element: HTMLElement): AttributeMap;
export declare function parseStyleAttribute(style: string): AttributeMap;
export declare function parseImageStyleAttribute(style: string): AttributeMap;
export declare function isInline(tagName: string): Boolean;
export declare function isBlock(tagName: string): Boolean;
/**
 * Ensure to detect italic html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export declare function isItalic(element: HTMLElement): boolean;
/**
 * Ensure to detect bold html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export declare function isStrong(element: HTMLElement): boolean;
/**
 * Ensure to detect underline html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export declare function isUnderline(element: HTMLElement): boolean;
/**
 * Ensure to detect strikethrough html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export declare function isStrike(element: HTMLElement): boolean;
/**
 * Ensure to detect p html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export declare function isParagraph(element: HTMLElement): boolean;
/**
 * Ensure to detect sub html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export declare function isSubscript(element: HTMLElement): boolean;
/**
 * Ensure to detect sup html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export declare function isSuperscript(element: HTMLElement): boolean;
/**
 * Ensure to detect br html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export declare function isBreakLine(element: HTMLElement): boolean;
/**
 * Ensure to detect span html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export declare function isSpan(element: HTMLElement): boolean;
/**
 * Ensure to detect h(1-6) html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export declare function isHeader(element: HTMLElement): boolean;
/**
 * Ensure to detect img html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export declare function isImg(element: HTMLElement): boolean;
/**
 * Ensure to detect li, ul, ol, <input type=checkbox> html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export declare function isList(element: HTMLElement): boolean;
/**
 * Ensure to detect video html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export declare function isVideo(element: HTMLElement): boolean;
/**
 * Ensure to detect a html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export declare function isLink(element: HTMLElement): boolean;
/**
 * Ensure to detect blockquote html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export declare function isBlockquote(element: HTMLElement): boolean;
/**
 * Ensure to detect pre, code html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export declare function isCodeBlock(element: HTMLElement): boolean;
/**
 * Ensure to detect div html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export declare function isDivBlock(element: HTMLElement): Boolean;

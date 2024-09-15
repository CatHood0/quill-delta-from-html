"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInlineAttributes = getInlineAttributes;
exports.parseStyleAttribute = parseStyleAttribute;
exports.parseImageStyleAttribute = parseImageStyleAttribute;
exports.isInline = isInline;
exports.isBlock = isBlock;
exports.isItalic = isItalic;
exports.isStrong = isStrong;
exports.isUnderline = isUnderline;
exports.isStrike = isStrike;
exports.isParagraph = isParagraph;
exports.isSubscript = isSubscript;
exports.isSuperscript = isSuperscript;
exports.isBreakLine = isBreakLine;
exports.isSpan = isSpan;
exports.isHeader = isHeader;
exports.isImg = isImg;
exports.isList = isList;
exports.isVideo = isVideo;
exports.isLink = isLink;
exports.isBlockquote = isBlockquote;
exports.isCodeBlock = isCodeBlock;
exports.isDivBlock = isDivBlock;
const colors_1 = require("./colors");
const indent_parser_1 = require("./indent_parser");
const fontsize_parser_1 = require("./fontsize_parser");
function getInlineAttributes(element) {
    const attributes = {};
    if (element.tagName === 'strong')
        attributes.bold = true;
    if (element.tagName === 'em')
        attributes.italic = true;
    if (element.tagName === 'u')
        attributes.underline = true;
    if (element.tagName === 's')
        attributes.strike = true;
    if (element.tagName === 'sub')
        attributes.script = 'sub';
    if (element.tagName === 'sup')
        attributes.script = 'super';
    return attributes;
}
function parseStyleAttribute(style) {
    const attributes = {};
    if (!style)
        return attributes;
    const styles = style.split(';');
    styles.forEach((style) => {
        const parts = style.split(':');
        if (parts.length === 2) {
            const key = parts[0].trim();
            const value = parts[1].trim();
            switch (key) {
                case 'text-align':
                    attributes['align'] = value;
                    break;
                case 'color':
                    const color = (0, colors_1.validateAndGetColor)(value);
                    attributes['color'] = color;
                    break;
                case 'background-color':
                    const bgColor = (0, colors_1.validateAndGetColor)(value);
                    attributes['background'] = bgColor;
                    break;
                case 'padding-left':
                case 'padding-right':
                    const indentation = (0, indent_parser_1.parseToIndent)(value);
                    if (indentation !== 0) {
                        attributes['indent'] = indentation;
                    }
                    break;
                case 'font-size':
                    let sizeToPass;
                    // Handle default values
                    if (value === '0.75em') {
                        sizeToPass = 'small';
                    }
                    else if (value === '1.5em') {
                        sizeToPass = 'large';
                    }
                    else if (value === '2.5em') {
                        sizeToPass = 'huge';
                    }
                    else {
                        try {
                            const size = (0, fontsize_parser_1.parseToPx)(value);
                            if (size <= 10) {
                                sizeToPass = 'small';
                            }
                            else {
                                sizeToPass = `${Math.floor(size)}`;
                            }
                        }
                        catch (e) {
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
        }
        else {
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
function parseImageStyleAttribute(style) {
    const attributes = {};
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
function isInline(tagName) {
    return ['strong', 'em', 'u', 's', 'sub', 'sup'].includes(tagName);
}
function isBlock(tagName) {
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
function isItalic(element) {
    return element.localName === 'em' || element.localName === 'i';
}
/**
 * Ensure to detect bold html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
function isStrong(element) {
    return element.localName === 'strong' || element.localName === 'b';
}
/**
 * Ensure to detect underline html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
function isUnderline(element) {
    return element.localName === 'ins' || element.localName === 'u';
}
/**
 * Ensure to detect strikethrough html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
function isStrike(element) {
    return element.localName === 's' || element.localName === 'del';
}
/**
 * Ensure to detect p html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
function isParagraph(element) {
    return element.localName === 'p';
}
/**
 * Ensure to detect sub html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
function isSubscript(element) {
    return element.localName === 'sub';
}
/**
 * Ensure to detect sup html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
function isSuperscript(element) {
    return element.localName === 'sup';
}
/**
 * Ensure to detect br html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
function isBreakLine(element) {
    return element.localName === 'br';
}
/**
 * Ensure to detect span html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
function isSpan(element) {
    return element.localName === 'span';
}
/**
 * Ensure to detect h(1-6) html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
function isHeader(element) {
    return element.localName != null && /h[1-6]/.test(element.localName);
}
/**
 * Ensure to detect img html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
function isImg(element) {
    return element.localName === 'img';
}
/**
 * Ensure to detect li, ul, ol, <input type=checkbox> html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
function isList(element) {
    return (element.localName === 'li' ||
        element.localName === 'ul' ||
        element.localName === 'ol');
}
/**
 * Ensure to detect video html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
function isVideo(element) {
    return element.localName === 'video';
}
/**
 * Ensure to detect a html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
function isLink(element) {
    return element.localName === 'a';
}
/**
 * Ensure to detect blockquote html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
function isBlockquote(element) {
    return element.localName === 'blockquote';
}
/**
 * Ensure to detect pre, code html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
function isCodeBlock(element) {
    return element.localName === 'pre' || element.localName === 'code';
}
/**
 * Ensure to detect div html tags
 * @param {HTMLElement} element
 * @returns {boolean}
 */
function isDivBlock(element) {
    return element.localName === 'div';
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processNode = processNode;
const node_html_parser_1 = require("node-html-parser");
const html_utils_1 = require("./html_utils");
/**
 * Processes a DOM node, converting it into Quill Delta operations.
 *
 * Recursively processes the DOM nodes, converting text nodes, inline styles,
 * links, and custom HTML blocks into Quill Delta operations.
 *
 * @param {Node} node - The DOM node to process.
 * @param {Object} attributes - The current Delta attributes to apply.
 * @param {Delta} delta - The Delta object to push operations into.
 * @param {boolean} [addSpanAttrs=false] - Whether to add attributes from <span> tags.
 */
function processNode(node, attributes, delta, addSpanAttrs = false, customBlocks = [], removeTheseAttributesFromSpan = []) {
    var _a, _b, _c;
    if (node instanceof node_html_parser_1.TextNode) {
        const validAttributes = {};
        for (let attrs in attributes) {
            const key = attrs;
            const value = attributes[key];
            if (value && key !== 'indent' && key !== 'align' && key !== 'direction') {
                validAttributes[key] = value;
            }
        }
        if (Object.keys(validAttributes).length > 0) {
            delta.insert(node.text || '', validAttributes);
        }
        else {
            delta.insert(node.text || '');
        }
    }
    else if (node instanceof node_html_parser_1.HTMLElement) {
        let newAttributes = Object.assign({}, attributes);
        // Apply inline styles based on tag type
        if ((0, html_utils_1.isStrong)(node))
            newAttributes['bold'] = true;
        if ((0, html_utils_1.isItalic)(node))
            newAttributes['italic'] = true;
        if ((0, html_utils_1.isUnderline)(node))
            newAttributes['underline'] = true;
        if ((0, html_utils_1.isStrike)(node))
            newAttributes['strike'] = true;
        if ((0, html_utils_1.isSubscript)(node))
            newAttributes['script'] = 'sub';
        if ((0, html_utils_1.isSuperscript)(node))
            newAttributes['script'] = 'super';
        if (customBlocks.length > 0) {
            let continueLoop = false;
            for (let index = 0; index < customBlocks.length; index++) {
                const customPart = customBlocks.at(index);
                if (customPart.matches(node)) {
                    const ops = customPart.convert(node);
                    for (let indexOp = 0; indexOp < ops.length; indexOp++) {
                        const insertion = (_a = ops.at(indexOp)) === null || _a === void 0 ? void 0 : _a.insert;
                        if (insertion !== undefined) {
                            delta.insert(insertion, (_b = ops.at(indexOp)) === null || _b === void 0 ? void 0 : _b.attributes);
                        }
                    }
                    continueLoop = true;
                    break;
                }
            }
            if (continueLoop) {
                return;
            }
        }
        // Use custom block definitions if provided
        // Handle <span> tags
        if ((0, html_utils_1.isSpan)(node)) {
            let spanAttributes = (0, html_utils_1.parseStyleAttribute)(node.getAttribute('style') || '');
            if (addSpanAttrs) {
                let newCopyAttr = {};
                for (const key in newAttributes) {
                    if (key === 'align' || key === 'direction' || key === 'indent') {
                        continue;
                    }
                    if (newAttributes[key] !== null && newAttributes[key] !== undefined && removeTheseAttributesFromSpan.indexOf(key) <= -1) {
                        newCopyAttr[key] = newAttributes[key];
                    }
                }
                if (removeTheseAttributesFromSpan) {
                    let copyAttributes = {};
                    for (const key in spanAttributes) {
                        if (spanAttributes[key] !== null && spanAttributes[key] !== undefined && removeTheseAttributesFromSpan.indexOf(key) <= -1) {
                            copyAttributes[key] = spanAttributes[key];
                        }
                        else if (key === 'align' || key === 'direction' || key === 'indent') {
                            continue;
                        }
                    }
                    spanAttributes = copyAttributes;
                }
                Object.assign(newAttributes, spanAttributes);
            }
        }
        // Handle <img> tags
        if ((0, html_utils_1.isImg)(node)) {
            const src = node.getAttribute('src') || '';
            const styles = node.getAttribute('style') || '';
            const imgAttributes = (0, html_utils_1.parseImageStyleAttribute)(styles);
            if (src) {
                delta.insert({ image: src }, styles
                    ? {
                        style: Object.entries(imgAttributes)
                            .map((entry) => `${entry[0]}:${entry[1]}`)
                            .join(';'),
                    }
                    : null);
            }
        }
        // Handle <video> tags
        if ((0, html_utils_1.isVideo)(node)) {
            const src = node.getAttribute('src');
            const sourceSrc = (_c = Array.from(node.childNodes)
                .find((child) => child instanceof Element)) === null || _c === void 0 ? void 0 : _c.getAttribute('src');
            if ((src && src.length) || (sourceSrc && sourceSrc.length)) {
                delta.insert({ video: src || sourceSrc });
            }
        }
        // Handle <a> tags (links)
        if ((0, html_utils_1.isLink)(node)) {
            const href = node.getAttribute('href');
            if (href) {
                delete newAttributes['indent'];
                newAttributes['link'] = href;
            }
        }
        // Handle <br> tags (line breaks)
        if ((0, html_utils_1.isBreakLine)(node)) {
            delete newAttributes['align'];
            delete newAttributes['direction'];
            delete newAttributes['indent'];
            delta.insert('\n');
        }
        // Recursively process child nodes
        for (let child of node.childNodes) {
            processNode(child, newAttributes, delta, addSpanAttrs);
        }
    }
}

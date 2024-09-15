"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultHtmlToOperations = void 0;
const quill_delta_1 = __importDefault(require("quill-delta"));
const html_utils_1 = require("./html_utils");
const node_html_parser_1 = require("node-html-parser");
const html_to_operation_1 = require("./html_to_operation");
const node_processor_1 = require("./node_processor");
/// Default implementation of `HtmlOperations` for converting common HTML to Delta operations.
///
/// This class provides default implementations for converting common HTML elements
/// like paragraphs, headers, lists, links, images, videos, code blocks, and blockquotes
/// into Delta operations.
class DefaultHtmlToOperations extends html_to_operation_1.HtmlOperations {
    paragraphToOp(element) {
        const delta = new quill_delta_1.default();
        let inlineAttributes = {};
        let blockAttributes = {};
        // Process the style attribute
        if (element.getAttribute('style') !== null ||
            element.getAttribute('align') !== null ||
            element.getAttribute('dir') !== null) {
            const style = element.getAttribute('style') || '';
            const styles2 = element.getAttribute('align') || '';
            const styles3 = element.getAttribute('dir') || '';
            let styleAttributes = (0, html_utils_1.parseStyleAttribute)(style);
            const alignAttribute = (0, html_utils_1.parseStyleAttribute)(styles2);
            const dirAttribute = (0, html_utils_1.parseStyleAttribute)(styles3);
            Object.assign(styleAttributes, alignAttribute, dirAttribute);
            if (styleAttributes.hasOwnProperty('align') ||
                styleAttributes.hasOwnProperty('direction') ||
                styleAttributes.hasOwnProperty('indent')) {
                if (styleAttributes.align !== undefined &&
                    styleAttributes.align !== null) {
                    blockAttributes.align = styleAttributes.align;
                }
                if (styleAttributes.direction !== undefined &&
                    styleAttributes.direction !== null) {
                    blockAttributes.direction = styleAttributes.direction;
                }
                if (styleAttributes.indent !== undefined &&
                    styleAttributes.indent !== null) {
                    blockAttributes.indent = styleAttributes.indent;
                }
                const validAttributes = {};
                for (let attrs in styleAttributes) {
                    const key = attrs;
                    const value = styleAttributes[key];
                    if (value &&
                        key !== 'indent' &&
                        key !== 'align' &&
                        key !== 'direction') {
                        validAttributes[key] = value;
                    }
                }
                styleAttributes = validAttributes;
            }
            Object.assign(inlineAttributes, styleAttributes);
        }
        const nodes = element.childNodes;
        // This stores all nodes into a paragraph,
        // and ensures getting all attributes or tags into a paragraph
        nodes.forEach((node) => {
            (0, node_processor_1.processNode)(node, inlineAttributes, delta, true, this.customBlocks);
        });
        if (Object.keys(blockAttributes).length > 0) {
            let copyAttributes = {};
            for (const key in blockAttributes) {
                if (blockAttributes[key] !== null) {
                    copyAttributes[key] = blockAttributes[key];
                }
            }
            blockAttributes = copyAttributes;
            delta.insert('\n', blockAttributes);
        }
        return delta.ops;
    }
    spanToOp(element) {
        const delta = new quill_delta_1.default();
        let inlineAttributes = {};
        // Process the style attribute
        if (element.getAttribute('style') !== null) {
            const style = element.getAttribute('style') || '';
            let styleAttributes = (0, html_utils_1.parseStyleAttribute)(style);
            if (styleAttributes.hasOwnProperty('align')) {
                const validAttributes = {};
                for (let attrs in styleAttributes) {
                    const key = attrs;
                    const value = styleAttributes[key];
                    if (value && key !== 'align') {
                        validAttributes[key] = value;
                    }
                }
                styleAttributes = validAttributes;
            }
            Object.assign(inlineAttributes, styleAttributes);
        }
        const nodes = element.childNodes;
        // This stores all nodes into a paragraph,
        // and ensures getting all attributes or tags into a paragraph
        nodes.forEach((node) => {
            (0, node_processor_1.processNode)(node, inlineAttributes, delta, false, this.customBlocks);
        });
        return delta.ops;
    }
    linkToOp(element) {
        const delta = new quill_delta_1.default();
        let attributes = {};
        if (element.getAttribute('href') !== null) {
            attributes.link = element.getAttribute('href');
        }
        const nodes = element.childNodes;
        nodes.forEach((node) => {
            (0, node_processor_1.processNode)(node, attributes, delta);
        });
        return delta.ops;
    }
    headerToOp(element) {
        const delta = new quill_delta_1.default();
        let attributes = {};
        let blockAttributes = {};
        if (element.getAttribute('style') !== null ||
            element.getAttribute('align') !== null ||
            element.getAttribute('dir') !== null) {
            const style = element.getAttribute('style') || '';
            const styles2 = element.getAttribute('align') || '';
            const styles3 = element.getAttribute('dir') || '';
            let styleAttributes = (0, html_utils_1.parseStyleAttribute)(style);
            const alignAttribute = (0, html_utils_1.parseStyleAttribute)(styles2);
            const dirAttribute = (0, html_utils_1.parseStyleAttribute)(styles3);
            Object.assign(styleAttributes, alignAttribute, dirAttribute);
            if (styleAttributes.hasOwnProperty('align') ||
                styleAttributes.hasOwnProperty('direction') ||
                styleAttributes.hasOwnProperty('indent')) {
                if (styleAttributes.align !== undefined &&
                    styleAttributes.align !== null) {
                    blockAttributes.align = styleAttributes.align;
                }
                if (styleAttributes.direction !== undefined &&
                    styleAttributes.direction !== null) {
                    blockAttributes.direction = styleAttributes.direction;
                }
                if (styleAttributes.indent !== undefined &&
                    styleAttributes.indent !== null) {
                    blockAttributes.indent = styleAttributes.indent;
                }
                const validAttributes = {};
                for (let attrs in styleAttributes) {
                    const key = attrs;
                    const value = styleAttributes[key];
                    if (value &&
                        key !== 'indent' &&
                        key !== 'align' &&
                        key !== 'direction') {
                        validAttributes[key] = value;
                    }
                }
                styleAttributes = validAttributes;
            }
            Object.assign(attributes, styleAttributes);
        }
        const headerLevel = element.localName || 'h1';
        blockAttributes.header = parseInt(headerLevel.substring(1), 10);
        const nodes = element.childNodes;
        nodes.forEach((node) => {
            (0, node_processor_1.processNode)(node, attributes, delta, true, this.customBlocks, ['size']);
        });
        // Ensure a newline is added at the end of the header with the correct attributes
        if (Object.keys(blockAttributes).length > 0) {
            let copyAttributes = {};
            for (const key in blockAttributes) {
                if (blockAttributes[key] !== null) {
                    copyAttributes[key] = blockAttributes[key];
                }
            }
            blockAttributes = copyAttributes;
            delta.insert('\n', blockAttributes);
        }
        return delta.ops;
    }
    divToOp(element) {
        const delta = new quill_delta_1.default();
        let attributes = {};
        if (element.getAttribute('style') !== null) {
            const style = element.getAttribute('style') || '';
            const styleAttributes = (0, html_utils_1.parseStyleAttribute)(style);
            Object.assign(attributes, styleAttributes);
        }
        const nodes = element.childNodes;
        nodes.forEach((node) => {
            if (node instanceof node_html_parser_1.TextNode) {
                delta.insert(node.text || '');
            }
            else if (node instanceof node_html_parser_1.HTMLElement) {
                const ops = this.resolveCurrentElement(node, 0);
                ops.forEach((op) => {
                    delta.insert(op.insert, op.attributes);
                });
                if (node.localName === 'p') {
                    delta.insert('\n');
                }
            }
        });
        return delta.ops;
    }
    listToOp(element, indentLevel = 0) {
        const delta = new quill_delta_1.default();
        const tagName = element.localName || 'ul';
        const attributes = {};
        const items = Array.from(element.childNodes).filter((child) => child.rawTagName === 'li');
        if (tagName === 'ul') {
            attributes.list = 'bullet';
        }
        else if (tagName === 'ol') {
            attributes.list = 'ordered';
        }
        const checkbox = element.querySelector('input[type="checkbox"]');
        if (checkbox) {
            const isChecked = checkbox.hasAttribute('checked');
            attributes.list = isChecked ? 'checked' : 'unchecked';
        }
        let ignoreBlockAttributesInsertion = false;
        items.forEach((item) => {
            ignoreBlockAttributesInsertion = false;
            let indent = indentLevel;
            if (!checkbox && item instanceof node_html_parser_1.HTMLElement) {
                const dataChecked = item.getAttribute('data-checked');
                const blockAttrs = (0, html_utils_1.parseStyleAttribute)(dataChecked || '');
                const isCheckList = item.rawTagName === 'li' &&
                    Object.keys(blockAttrs).length > 0 &&
                    blockAttrs.hasOwnProperty('list');
                if (isCheckList) {
                    attributes.list = blockAttrs.list;
                }
            }
            // Force always the max level indentation to be five
            if (indentLevel > 5)
                indentLevel = 5;
            if (indentLevel > 0)
                attributes.indent = indentLevel;
            const nodes = item.childNodes;
            nodes.forEach((node) => {
                if (node instanceof node_html_parser_1.TextNode) {
                    delta.insert(node.text || '');
                }
                else if (node instanceof node_html_parser_1.HTMLElement) {
                    const element = node;
                    let ops = [];
                    // If found an element list within another list, then this is nested and must insert first the block attributes
                    // to separate the current element from the nested list elements
                    if (element.localName === 'ul' || element.localName === 'ol') {
                        indent++;
                        ignoreBlockAttributesInsertion = true;
                        delta.insert('\n', attributes);
                    }
                    ops = this.resolveCurrentElement(element, indent);
                    ops.forEach((op) => {
                        delta.insert(op.insert, op.attributes);
                    });
                }
            });
            if (!ignoreBlockAttributesInsertion) {
                delta.insert('\n', attributes);
            }
        });
        return delta.ops;
    }
    imgToOp(element) {
        const src = element.getAttribute('src') || '';
        if (src) {
            const delta = new quill_delta_1.default();
            delta.insert({ image: src });
            return delta.ops;
        }
        return [];
    }
    videoToOp(element) {
        const src = element.getAttribute('src') || '';
        const sourceSrc = Array.from(element.childNodes)
            .filter((node) => node instanceof Element)
            .map((node) => node.getAttribute('src'))
            .find(Boolean);
        if (src || sourceSrc) {
            const delta = new quill_delta_1.default();
            delta.insert({ video: src || sourceSrc });
            return delta.ops;
        }
        return [];
    }
    blockquoteToOp(element) {
        const delta = new quill_delta_1.default();
        const blockAttributes = { blockquote: true };
        const nodes = element.childNodes;
        nodes.forEach((node) => {
            (0, node_processor_1.processNode)(node, {}, delta, false, this.customBlocks);
        });
        delta.insert('\n', blockAttributes);
        return delta.ops;
    }
    codeblockToOp(element) {
        const delta = new quill_delta_1.default();
        const blockAttributes = { 'code-block': true };
        const nodes = element.childNodes;
        nodes.forEach((node) => {
            (0, node_processor_1.processNode)(node, {}, delta, false, this.customBlocks);
        });
        delta.insert('\n', blockAttributes);
        return delta.ops;
    }
    brToOp(_element) {
        return [{ insert: '\n' }];
    }
}
exports.DefaultHtmlToOperations = DefaultHtmlToOperations;

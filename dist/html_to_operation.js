"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlOperations = void 0;
const node_html_parser_1 = require("node-html-parser");
const quill_delta_1 = __importDefault(require("quill-delta"));
const html_utils_1 = require("./html_utils");
const node_processor_1 = require("./node_processor");
/** Operations for converting supported HTML elements to Delta operations.
 *
 * This abstract class defines methods for converting various HTML elements
 * into Delta operations, which are used for rich text editing.
 *
 **/
class HtmlOperations {
    constructor() {
        this.customBlocks = [];
    }
    /** Resolves the current HTML element into Delta operations.
     *
     * Determines the type of HTML element and converts it into corresponding Delta operations.
     *
     * Parameters:
     * - [element]: The HTML element to convert into Delta operations.
     * - [indentLevel]: The current indentation (by now is just used by listToOp).
     *
     * Returns:
     * A list of Delta operations corresponding to the HTML element.
     *
     **/
    resolveCurrentElement(element, indentLevel = 0) {
        let ops = [];
        if (!element.tagName) {
            ops.push({ insert: element.text || '' });
            return ops;
        }
        // Inlines
        //
        // the current element could be into a <li> then it's node can be
        // a <strong> or a <em>, or even a <span> then we first need to verify
        // if a inline an store into it to parse the attributes as we need
        if ((0, html_utils_1.isInline)(element.tagName)) {
            const delta = new quill_delta_1.default();
            const attributes = (0, html_utils_1.getInlineAttributes)(element);
            for (let index = 0; index < element.childNodes.length; index++) {
                const node = element.childNodes.at(index);
                if (node instanceof node_html_parser_1.HTMLElement) {
                    (0, node_processor_1.processNode)(node, attributes, delta, false, this.customBlocks);
                }
            }
            ops.push(...delta.ops);
        }
        if ((0, html_utils_1.isBreakLine)(element)) {
            ops.push(...this.brToOp(element));
        }
        if ((0, html_utils_1.isParagraph)(element)) {
            ops.push(...this.paragraphToOp(element));
        }
        if ((0, html_utils_1.isHeader)(element)) {
            ops.push(...this.headerToOp(element));
        }
        if ((0, html_utils_1.isList)(element)) {
            ops.push(...this.listToOp(element, indentLevel));
        }
        if ((0, html_utils_1.isSpan)(element)) {
            ops.push(...this.spanToOp(element));
        }
        if ((0, html_utils_1.isLink)(element)) {
            ops.push(...this.linkToOp(element));
        }
        if ((0, html_utils_1.isImg)(element)) {
            ops.push(...this.imgToOp(element));
        }
        if ((0, html_utils_1.isVideo)(element)) {
            ops.push(...this.videoToOp(element));
        }
        if ((0, html_utils_1.isBlockquote)(element)) {
            ops.push(...this.blockquoteToOp(element));
        }
        if ((0, html_utils_1.isCodeBlock)(element)) {
            ops.push(...this.codeblockToOp(element));
        }
        if ((0, html_utils_1.isDivBlock)(element)) {
            ops.push(...this.divToOp(element));
        }
        return ops;
    }
    setCustomBlocks(customBlocks) {
        this.customBlocks = customBlocks || [];
    }
}
exports.HtmlOperations = HtmlOperations;

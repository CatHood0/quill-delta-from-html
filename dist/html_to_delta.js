"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlToDelta = void 0;
const quill_delta_1 = __importDefault(require("quill-delta"));
const node_html_parser_1 = require("node-html-parser");
const default_html_to_operation_1 = require("./default_html_to_operation");
const html_utils_1 = require("./html_utils");
/**
 * Default converter for html to Delta
 **/
class HtmlToDelta {
    constructor(customBlocks, htmlToOperation, blackNodesList = []) {
        this.customBlocks = customBlocks || [];
        this.htmlToOp = htmlToOperation || new default_html_to_operation_1.DefaultHtmlToOperations();
        //automatically set custom block
        this.htmlToOp.setCustomBlocks(this.customBlocks);
        this.blackNodesList = blackNodesList;
    }
    /**
     * Converts an HTML string into Delta operations.
     *
     * Converts the HTML string [htmlText] into Delta operations using QuillJS-compatible attributes.
     * Custom blocks can be applied based on registered [customBlocks].
     *
     * Parameters:
     * - [htmlText]: The HTML string to convert into Delta operations.
     *
     * Returns:
     * A Delta object representing the formatted content from HTML.
     *
     **/
    convert(htmlText) {
        var _a, _b, _c, _d, _e;
        const parsedHtmlText = htmlText.split('\n').map((e) => e.trimStart()).join('');
        const delta = new quill_delta_1.default();
        const document = (0, node_html_parser_1.parse)(parsedHtmlText);
        const nodesToProcess = ((_a = document.querySelector('body')) === null || _a === void 0 ? void 0 : _a.childNodes) ||
            ((_b = document.querySelector('html')) === null || _b === void 0 ? void 0 : _b.childNodes) ||
            document.childNodes;
        for (let index = 0; index < nodesToProcess.length; index++) {
            const node = nodesToProcess.at(index);
            let nextNode = (_c = nodesToProcess.at(index + 1)) !== null && _c !== void 0 ? _c : null;
            let nextIsBlock = nextNode === null || nextNode === undefined
                ? false
                : nextNode instanceof node_html_parser_1.HTMLElement
                    ? (0, html_utils_1.isBlock)(nextNode.localName)
                    : false;
            if (node instanceof node_html_parser_1.HTMLElement) {
                //first just verify if the customBlocks aren't empty and then store on them to
                //validate if one of them make match with the current Node
                if (this.customBlocks.length > 0) {
                    let continueLoop = false;
                    for (let index = 0; index < this.customBlocks.length; index++) {
                        const customPart = this.customBlocks[index];
                        if (customPart.matches(node)) {
                            const ops = customPart.convert(node);
                            for (let indexOp = 0; indexOp < ops.length; indexOp++) {
                                const insertion = (_d = ops.at(indexOp)) === null || _d === void 0 ? void 0 : _d.insert;
                                if (insertion !== undefined) {
                                    delta.insert(insertion, (_e = ops.at(indexOp)) === null || _e === void 0 ? void 0 : _e.attributes);
                                }
                            }
                            continueLoop = true;
                            break;
                        }
                    }
                    if (continueLoop) {
                        continue;
                    }
                }
                if (this.blackNodesList.indexOf(node.localName) >= 0) {
                    delta.push({ insert: node.text });
                    if (nextIsBlock)
                        delta.insert('\n');
                    continue;
                }
                const operations = this.htmlToOp.resolveCurrentElement(node, 0, nextIsBlock);
                operations.forEach((op) => {
                    delta.push(op);
                });
            }
            if (node instanceof node_html_parser_1.TextNode) {
                delta.insert(node.text);
                if (nextIsBlock)
                    delta.push({ insert: '\n' });
            }
        }
        const operation = delta.ops[delta.ops.length - 1];
        const hasAttributes = operation.attributes !== null && operation.attributes !== undefined;
        const lastData = operation.insert;
        if (typeof lastData !== 'string' ||
            !lastData.endsWith('\n') ||
            hasAttributes) {
            delta.insert('\n');
        }
        return delta;
    }
}
exports.HtmlToDelta = HtmlToDelta;

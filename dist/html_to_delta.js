"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlToDelta = void 0;
const quill_delta_1 = __importDefault(require("quill-delta"));
const node_html_parser_1 = require("node-html-parser");
const default_html_to_operation_1 = require("./default_html_to_operation");
/**
 * Default converter for html to Delta
 **/
class HtmlToDelta {
    constructor(customBlocks, htmlToOperation) {
        this.customBlocks = customBlocks || [];
        this.htmlToOp = htmlToOperation || new default_html_to_operation_1.DefaultHtmlToOperations();
        //automatically set custom block
        this.htmlToOp.setCustomBlocks(this.customBlocks);
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
        var _a, _b, _c, _d;
        const delta = new quill_delta_1.default();
        const document = (0, node_html_parser_1.parse)(htmlText);
        const nodesToProcess = ((_a = document.querySelector('body')) === null || _a === void 0 ? void 0 : _a.childNodes) ||
            ((_b = document.querySelector('html')) === null || _b === void 0 ? void 0 : _b.childNodes) ||
            document.childNodes;
        for (let index = 0; index < nodesToProcess.length; index++) {
            const node = nodesToProcess.at(index);
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
                                const insertion = (_c = ops.at(indexOp)) === null || _c === void 0 ? void 0 : _c.insert;
                                if (insertion !== undefined) {
                                    delta.insert(insertion, (_d = ops.at(indexOp)) === null || _d === void 0 ? void 0 : _d.attributes);
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
                const operations = this.htmlToOp.resolveCurrentElement(node, 0);
                operations.forEach((op) => {
                    delta.push(op);
                });
            }
            if (node instanceof node_html_parser_1.TextNode) {
                delta.insert(node.text);
            }
        }
        const operation = delta.ops[delta.ops.length - 1];
        const hasAttributes = operation.attributes !== null && operation.attributes !== undefined;
        const lastData = operation.insert;
        if (typeof lastData !== 'string' || !lastData.endsWith('\n') || hasAttributes) {
            delta.insert('\n');
        }
        return delta;
    }
}
exports.HtmlToDelta = HtmlToDelta;

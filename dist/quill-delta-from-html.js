"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSuperscript = exports.isBlockquote = exports.isUnderline = exports.isSubscript = exports.isParagraph = exports.isCodeBlock = exports.isBreakLine = exports.isDivBlock = exports.isStrong = exports.isStrike = exports.isItalic = exports.isHeader = exports.isVideo = exports.isSpan = exports.isList = exports.isLink = exports.isImg = exports.isBlock = exports.isInline = exports.parseImageStyleAttribute = exports.parseStyleAttribute = exports.getInlineAttributes = exports.HtmlOperations = exports.HtmlToDelta = exports.DefaultHtmlToOperations = exports.processNode = exports.parseToIndent = exports.pointSizeMultiplier = exports.picasSizeMultiplier = exports.mmSizeMultiplier = exports.inchSizeMultiplier = exports.cmSizeMultiplier = exports.parseToPx = exports.rgbToHex = exports.rgbaToHex = exports.hslToRgb = exports.hslToHex = exports.hslaToHex = exports.toHex = exports.colorToHex = exports.validateAndGetColor = void 0;
var colors_1 = require("./colors");
Object.defineProperty(exports, "validateAndGetColor", { enumerable: true, get: function () { return colors_1.validateAndGetColor; } });
Object.defineProperty(exports, "colorToHex", { enumerable: true, get: function () { return colors_1.colorToHex; } });
Object.defineProperty(exports, "toHex", { enumerable: true, get: function () { return colors_1.toHex; } });
Object.defineProperty(exports, "hslaToHex", { enumerable: true, get: function () { return colors_1.hslaToHex; } });
Object.defineProperty(exports, "hslToHex", { enumerable: true, get: function () { return colors_1.hslToHex; } });
Object.defineProperty(exports, "hslToRgb", { enumerable: true, get: function () { return colors_1.hslToRgb; } });
Object.defineProperty(exports, "rgbaToHex", { enumerable: true, get: function () { return colors_1.rgbaToHex; } });
Object.defineProperty(exports, "rgbToHex", { enumerable: true, get: function () { return colors_1.rgbToHex; } });
var fontsize_parser_1 = require("./fontsize_parser");
Object.defineProperty(exports, "parseToPx", { enumerable: true, get: function () { return fontsize_parser_1.parseToPx; } });
Object.defineProperty(exports, "cmSizeMultiplier", { enumerable: true, get: function () { return fontsize_parser_1.cmSizeMultiplier; } });
Object.defineProperty(exports, "inchSizeMultiplier", { enumerable: true, get: function () { return fontsize_parser_1.inchSizeMultiplier; } });
Object.defineProperty(exports, "mmSizeMultiplier", { enumerable: true, get: function () { return fontsize_parser_1.mmSizeMultiplier; } });
Object.defineProperty(exports, "picasSizeMultiplier", { enumerable: true, get: function () { return fontsize_parser_1.picasSizeMultiplier; } });
Object.defineProperty(exports, "pointSizeMultiplier", { enumerable: true, get: function () { return fontsize_parser_1.pointSizeMultiplier; } });
var indent_parser_1 = require("./indent_parser");
Object.defineProperty(exports, "parseToIndent", { enumerable: true, get: function () { return indent_parser_1.parseToIndent; } });
var node_processor_1 = require("./node_processor");
Object.defineProperty(exports, "processNode", { enumerable: true, get: function () { return node_processor_1.processNode; } });
var default_html_to_operation_1 = require("./default_html_to_operation");
Object.defineProperty(exports, "DefaultHtmlToOperations", { enumerable: true, get: function () { return default_html_to_operation_1.DefaultHtmlToOperations; } });
var html_to_delta_1 = require("./html_to_delta");
Object.defineProperty(exports, "HtmlToDelta", { enumerable: true, get: function () { return html_to_delta_1.HtmlToDelta; } });
var html_to_operation_1 = require("./html_to_operation");
Object.defineProperty(exports, "HtmlOperations", { enumerable: true, get: function () { return html_to_operation_1.HtmlOperations; } });
var html_utils_1 = require("./html_utils");
Object.defineProperty(exports, "getInlineAttributes", { enumerable: true, get: function () { return html_utils_1.getInlineAttributes; } });
Object.defineProperty(exports, "parseStyleAttribute", { enumerable: true, get: function () { return html_utils_1.parseStyleAttribute; } });
Object.defineProperty(exports, "parseImageStyleAttribute", { enumerable: true, get: function () { return html_utils_1.parseImageStyleAttribute; } });
Object.defineProperty(exports, "isInline", { enumerable: true, get: function () { return html_utils_1.isInline; } });
Object.defineProperty(exports, "isBlock", { enumerable: true, get: function () { return html_utils_1.isBlock; } });
Object.defineProperty(exports, "isImg", { enumerable: true, get: function () { return html_utils_1.isImg; } });
Object.defineProperty(exports, "isLink", { enumerable: true, get: function () { return html_utils_1.isLink; } });
Object.defineProperty(exports, "isList", { enumerable: true, get: function () { return html_utils_1.isList; } });
Object.defineProperty(exports, "isSpan", { enumerable: true, get: function () { return html_utils_1.isSpan; } });
Object.defineProperty(exports, "isVideo", { enumerable: true, get: function () { return html_utils_1.isVideo; } });
Object.defineProperty(exports, "isHeader", { enumerable: true, get: function () { return html_utils_1.isHeader; } });
Object.defineProperty(exports, "isItalic", { enumerable: true, get: function () { return html_utils_1.isItalic; } });
Object.defineProperty(exports, "isStrike", { enumerable: true, get: function () { return html_utils_1.isStrike; } });
Object.defineProperty(exports, "isStrong", { enumerable: true, get: function () { return html_utils_1.isStrong; } });
Object.defineProperty(exports, "isDivBlock", { enumerable: true, get: function () { return html_utils_1.isDivBlock; } });
Object.defineProperty(exports, "isBreakLine", { enumerable: true, get: function () { return html_utils_1.isBreakLine; } });
Object.defineProperty(exports, "isCodeBlock", { enumerable: true, get: function () { return html_utils_1.isCodeBlock; } });
Object.defineProperty(exports, "isParagraph", { enumerable: true, get: function () { return html_utils_1.isParagraph; } });
Object.defineProperty(exports, "isSubscript", { enumerable: true, get: function () { return html_utils_1.isSubscript; } });
Object.defineProperty(exports, "isUnderline", { enumerable: true, get: function () { return html_utils_1.isUnderline; } });
Object.defineProperty(exports, "isBlockquote", { enumerable: true, get: function () { return html_utils_1.isBlockquote; } });
Object.defineProperty(exports, "isSuperscript", { enumerable: true, get: function () { return html_utils_1.isSuperscript; } });

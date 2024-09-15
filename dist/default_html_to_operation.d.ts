import { Op } from 'quill-delta';
import { HTMLElement } from 'node-html-parser';
import { HtmlOperations } from './html_to_operation';
export declare class DefaultHtmlToOperations extends HtmlOperations {
    paragraphToOp(element: HTMLElement): Op[];
    spanToOp(element: HTMLElement): Op[];
    linkToOp(element: HTMLElement): Op[];
    headerToOp(element: HTMLElement): Op[];
    divToOp(element: HTMLElement): Op[];
    listToOp(element: HTMLElement, indentLevel?: number): Op[];
    imgToOp(element: HTMLElement): Op[];
    videoToOp(element: HTMLElement): Op[];
    blockquoteToOp(element: HTMLElement): Op[];
    codeblockToOp(element: HTMLElement): Op[];
    brToOp(_element: HTMLElement): Op[];
}

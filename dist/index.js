"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const html_to_delta_1 = require("./html_to_delta");
const delta = new html_to_delta_1.HtmlToDelta().convert('<p>Hello <strong>Word</strong>!<br></p>');
const delta2 = new html_to_delta_1.HtmlToDelta().convert('<p><span style="color:#F06292FF">This is just pink </span><br/><br/><span style="color:#4DD0E1FF">This is just blue</span><br></p>');
const delta3 = new html_to_delta_1.HtmlToDelta().convert('<p>This is a <a href="https://example.com">link</a> to example.com</p>');
const delta4 = new html_to_delta_1.HtmlToDelta().convert('<p style="font-size: 0.75em">This is a paragraph example</p><h1>Header</h1>');
const delta5 = new html_to_delta_1.HtmlToDelta().convert('<p>This is an image: <img align="center" style="width: 50px;height: 250px;margin: 5px;" src="https://example.com/image.png"/> example</p>');
const delta6 = new html_to_delta_1.HtmlToDelta().convert('<ol><li>First <strong>item</strong><ul><li>SubItem <a href="https://www.google.com">1</a><ol><li>Sub 1.5</li></ol></li><li>SubItem 2</li></ul></li><li>Second item</li></ol>');
const delta7 = new html_to_delta_1.HtmlToDelta().convert('<h1>Example title <span style="font-size: 20px; color: var(--); background-color: #ffffffff">with an internal span</span></h1>');
const delta8 = new html_to_delta_1.HtmlToDelta(null, null, ['div']).convert('<h1>Example title <span style="font-size: 20px; color: var(--); background-color: #ffffffff">with an internal span</span></h1><div><p align="center">Paragraph ignored</p></div>');
printOps(delta);
console.log('\nPart 2\n');
printOps(delta2);
console.log('\nPart 3\n');
printOps(delta3);
console.log('\nPart 4\n');
printOps(delta4);
console.log('\nPart 5\n');
printOps(delta5);
console.log('\nPart 6\n');
printOps(delta6);
console.log('\nPart 7\n');
printOps(delta7);
console.log('\nPart 8\n');
printOps(delta8);
function printOps(delta) {
    delta.ops.forEach((op) => {
        var _a;
        console.log({
            insert: JSON.stringify(op.insert),
            attributes: (_a = op.attributes) !== null && _a !== void 0 ? _a : null,
        });
    });
}

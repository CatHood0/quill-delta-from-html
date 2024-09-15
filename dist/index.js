"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const html_to_delta_1 = require("./html_to_delta");
const delta = new html_to_delta_1.HtmlToDelta().convert('<p>Hello <strong>Word</strong>!<br></p>');
delta.ops.forEach((op) => {
    console.log(JSON.stringify(op.insert) +
        (op.attributes ? JSON.stringify(op.attributes) : ''));
});
const delta2 = new html_to_delta_1.HtmlToDelta().convert('<p><span style="color:#F06292FF">This is just pink </span><br/><br/><span style="color:#4DD0E1FF">This is just blue</span><br></p>');
console.log('\n');
delta2.ops.forEach((op) => {
    console.log(JSON.stringify(op.insert) +
        (op.attributes ? JSON.stringify(op.attributes) : ''));
});
const delta3 = new html_to_delta_1.HtmlToDelta().convert('<p>This is a <a href="https://example.com">link</a> to example.com</p>');
console.log('\n');
delta3.ops.forEach((op) => {
    console.log(JSON.stringify(op.insert) +
        (op.attributes ? JSON.stringify(op.attributes) : ''));
});
const delta4 = new html_to_delta_1.HtmlToDelta().convert('<p style="font-size: 0.75em">This is a paragraph example</p>');
console.log('\n');
delta4.ops.forEach((op) => {
    console.log(JSON.stringify(op.insert) +
        (op.attributes ? JSON.stringify(op.attributes) : ''));
});
const delta5 = new html_to_delta_1.HtmlToDelta().convert('<p>This is an image: <img align="center" style="width: 50px;height: 250px;margin: 5px;" src="https://example.com/image.png"/> example</p>');
console.log('\n');
delta5.ops.forEach((op) => {
    console.log(JSON.stringify(op.insert) +
        (op.attributes ? JSON.stringify(op.attributes) : ''));
});
const delta6 = new html_to_delta_1.HtmlToDelta().convert('<ol><li>First <strong>item</strong><ul><li>SubItem <a href="https://www.google.com">1</a><ol><li>Sub 1.5</li></ol></li><li>SubItem 2</li></ul></li><li>Second item</li></ol>');
console.log('\n');
delta6.ops.forEach((op) => {
    console.log(JSON.stringify(op.insert) +
        (op.attributes ? JSON.stringify(op.attributes) : ''));
});
const delta7 = new html_to_delta_1.HtmlToDelta().convert('<h1>Example title <span style="font-size: 20px; color: var(--); background-color: #ffffffff">with an internal span</span></h1>');
console.log('\n');
delta7.ops.forEach((op) => {
    console.log(JSON.stringify(op.insert) +
        (op.attributes ? JSON.stringify(op.attributes) : ''));
});
const delta8 = new html_to_delta_1.HtmlToDelta(null, null, ['div']).convert('<h1>Example title <span style="font-size: 20px; color: var(--); background-color: #ffffffff">with an internal span</span></h1><div><p align="center">Paragraph ignored</p></div>');
console.log('\n');
delta8.ops.forEach((op) => {
    console.log(JSON.stringify(op.insert) +
        (op.attributes ? JSON.stringify(op.attributes) : ''));
});

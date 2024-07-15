# Quill Delta from HTML

This is a package that converts **HTML** input into Quill **Delta** format, which is used in the [Quill Js](https://quilljs.com/) package.

**This package** supports the conversion of a wide range of **HTML** tags and attributes into their corresponding **Delta** operations, ensuring that your **HTML** content is accurately represented in the **Quill editor**.

## Supported tags

```html
    <!--Text Formatting-->
        <b>, <strong>: Bold text
        <i>, <em>: Italic text
        <u>, <ins>: Underlined text
        <s>, <del>: Strikethrough text
        <sup>: Superscript text
        <sub>: Subscript text

    <!--Headings-->
        <h1> to <h6>: Headings of various levels

    <!--Lists and nested ones-->
        <ul>: Unordered lists
        <ol>: Ordered lists
        <li>: List items
        <li data-checked="true">: Check lists
        <input type="checkbox">: Another alternative to make a check lists

    <!--Links-->
        <a>: Hyperlinks with support for the href attribute

    <!--Images-->
        <img>: Images with support for the src, align, and styles

    <!--div-->
        <div>: HTML tag containers

    <!--Videos -->
        <video>: Videos with support for the src

    <!--Blockquotes-->
        <blockquote>: Block quotations

    <!--Code Blocks-->
        <pre>, <code>: Code blocks

    <!--Text Alignment, inline text align and direction-->
        <p style="text-align:left|center|right|justify">: Paragraph style alignment
        <p align="left|center|right|justify">: Paragraph alignment
        <p dir="rtl">: Paragraph direction

    <!--Text attributes-->
        <p style="padding: 10px;font-size: 12px;font-family: Times New Roman;color:#ffffff">: Inline attributes

    <!--Custom Blocks-->
        <pullquote data-author="john">: Custom html
```

## Quick Example

```typescript
import { HtmlToDelta } from 'quill-delta-from-html';

const htmlContent: string = '<p>Hello, <b>world</b>!</p>';
const delta = new HtmlToDelta().convert(htmlContent);

/*
   { "insert": "hello, " },
   { "insert": "world", "attributes": {"bold": true} },
   { "insert": "!\n" }
*/
```

## Creating your own `CustomHtmlPart`

#### What is a CustomHtmlPart?

`CustomHtmlPart`is a special class that let us convert custom `HTML` elements in Operation to `Quill Delta`. 

First you need to define your own `CustomHtmlPart`

```typescript
import { CustomHtmlPart } from 'quill-delta-from-html';
import { HTMLElement } from 'node-html-parser';
import Delta, { AttributeMap, Op } from 'quill-delta';

/// Custom block handler for <pullquote> elements.
class PullquoteBlock extends CustomHtmlPart {
  matches(element: HTMLElement): boolean {
    // you can put here the validation that you want
    // To detect a <p>, you just need to do something like:
    // element.rawTagName === 'p'
    return element.rawTagName === 'pullquote';
  }

  convert(element: HTMLElement, currentAttributes: AttributeMap): Op[] {
    const delta: Delta = new Delta();
    const attributes = { ...currentAttributes };

    // Extract custom attributes from the <pullquote> element
    // The attributes represent the data into a html tag
    // at this point, <pullquote> should have these attributes
    //
    // <pullquote data-author="John Doe" data-style="italic">
    // These attributes can be optional, so ensure not to use "!" to avoid any null conflict
    const author = element.attribs['data-author'];
    const style = element.attribs['data-style'];

    // Apply custom attributes to the Delta operations
    if (author) {
      delta.insert(
        `Pullquote: "${element.children[0].data}" by ${author}`,
        attributes,
      );
    } else {
      delta.insert(`Pullquote: "${element.children[0].data}"`, attributes);
    }

    if (style && style.toLowerCase() === 'italic') {
      attributes['italic'] = true;
    }
    return delta;
  }
}
```

After, put your `PullquoteBlock` to `HtmlToDelta` using the param `customBlocks`

```typescript
import { HtmlToDelta } from 'quill-delta-from-html';

const htmlText: string = `
  <html>
    <body>
      <p>Regular paragraph before the custom block</p>
      <pullquote data-author="John Doe" data-style="italic">This is a custom pullquote</pullquote>
      <p>Regular paragraph after the custom block</p>
    </body>
  </html>
`;

// Registering the custom block
const customBlocks = [new PullquoteBlock()];

// Initialize HtmlToDelta with the HTML text and custom blocks
const converter = new HtmlToDelta(customBlocks);

// Convert HTML to Delta operations
const delta = converter.convert(htmlText);

/*
This should be resulting delta
  {"insert": "Regular paragraph before the custom block"},
  {"insert": "Pullquote: \"This is a custom pullquote\" by John Doe", "attributes": {"italic": true}},
  {"insert": "\n"},
  {"insert": "Regular paragraph after the custom block\n"}
*/
```

## HtmlOperations

The `HtmlOperations` class is designed to streamline the conversion process from `HTML` to `Delta` operations, accommodating a wide range of `HTML` structures and attributes commonly used in web content.

To utilize `HtmlOperations`, extend this class and implement the methods necessary to handle specific `HTML` elements. Each method corresponds to a different `HTML` tag or element type and converts it into Delta operations suitable for use with `Quill JS`.

```typescript
abstract class HtmlOperations {
  // customBlocks are passed internally by HtmlToDelta
  protected customBlocks?: CustomHtmlPart[];

  // You don't need to override this method
  // as it simply calls the other methods
  // to detect the type of HTML tag
  resolveCurrentElement(
    element: dom.Element,
    indentLevel?: number,
  ): Operation[];

  abstract brToOp(element: dom.Element): Operation[];
  abstract headerToOp(element: dom.Element): Operation[];
  abstract listToOp(element: dom.Element, indentLevel?: number): Operation[];
  abstract paragraphToOp(element: dom.Element): Operation[];
  abstract linkToOp(element: dom.Element): Operation[];
  abstract spanToOp(element: dom.Element): Operation[];
  abstract imgToOp(element: dom.Element): Operation[];
  abstract videoToOp(element: dom.Element): Operation[];
  abstract codeblockToOp(element: dom.Element): Operation[];
  abstract blockquoteToOp(element: dom.Element): Operation[];
}
```

### Passing a custom `HtmlOperations` implementation 

```typescript
import { HtmlToDelta } from 'quill-delta-from-html';

const converter = new HtmlToDelta(...your_custom_blocks, <YourHtmlToOperationsImpl>);
```

## Contributions

If you find a bug or want to add a new feature, please open an issue or submit a pull request on the [GitHub repository](https://github.com/CatHood0/quill-delta-from-html).

This project is licensed under the MIT License - see the [LICENSE](https://github.com/CatHood0/quill-delta-from-html/blob/Main/LICENSE) file for details.

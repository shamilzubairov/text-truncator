# Text-truncator

Universal library that makes a lot of text truncated in a small parent container.

`text-truncator` listened by resize event for applied every time when page is resized. 
You can turn this option off by provide in parameter `options` boolean property `once` is true.

[MIT License](LICENSE.txt)

## Attention!
Version before 1.0.11 didn't work correctly. Please update it.

## Installation

```sh
npm install text-truncator
```
## Usage

What if you need to truncate a part of the text inside the paragraph element that doesn't fit in `div.app` element in the HTML structure below:
```html
...
<body>
    <div class="app">
        <h1>This is test of package</h1>
        <p class="text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </div>
</body>
...
```
For that you use `truncator` as shown further:

```js / ts
import truncator from 'text-truncator'
...
const stopTruncator = truncator({
  sourceNode: ".text", // or just `p` (like a tag) or document.querySelector('.text') - you may provide also HTML element 
  sourceAncestor: ".app", // or just `div` (if its only parent tag) or document.querySelector('.app')
  ending: "read mode...",
});
```
In ending param you can add HTML element also by create it in advance:
```js
const anchor = document.createElement("a");
anchor.innerText = "read more...";
anchor.href = "https://somesite.com";
```
and provide it to param `ending`
```js / ts
...
const stopTruncator = truncator({
  ...
  ending: anchor,
  ...
});
```
`truncator` counts size of parent element (`.app` in example) and fits `sourceNode` to the parent. 
In the result we get truncated text with `ending` instead of extra text.

## All available parameters
```js / ts
const stopTruncator = truncator({
  sourceNode: ".text", // Required! Use CSS selectors (string) or HTML element with text inside to be truncated.
  sourceAncestor: ".app", // Use CSS selectors (string) or HTML element. By default it equals "body". This is the parent of sourceNode element.
  ending: "read mode...",  // Use CSS selectors (string) or HTML element. By default it equals ... Add instead of truncated text.
  options: {
    maxLength: 700, // The maximum number of letters that we want to be shown before truncate. By default it equals Infinity.
    minCutLength: 100, // The maximum number of letters after which the text completely disappears. By default it equals 50.
    delay: 250, // Time (in millisec) to delay animation of truncate. Inside itself truncator uses the throttling function. By default it equals 100.
    once: true // Needs to call truncator just one time without adding listener to resize event. By default it equals false.
  }
});
```

## SPA
To use in SPA it returns closing function which can be called before a component will be removed from the DOM.
For example you can use it with `React/Hooks`:
```js / ts
...
useEffect(() => {
  ...
  return () => {
    stopTruncator()
    ...
  }
})
...
```

## Ending
If you use a string as the ending character don't use special chars like these `< \ ( ) ^ * $` as this can lead to incorrect results.

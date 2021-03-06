# Text-truncator

Universal library that makes a lot of text truncated in a small parent container.

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
        <h1>This is a test</h1>
        <p class="text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </div>
</body>
...
```
For that you use `truncator` as shown further:

```js / ts
import truncator from 'text-truncator'
...
truncator({
  sourceNode: ".text", // or just `p` (like a tag) or document.querySelector('.text') - you may provide also HTML element 
  sourceAncestor: ".app", // or just `div` (if it's only parent tag) or document.querySelector('.app')
  ending: "read mode...",
});
```
In ending param you can add HTML element also by create it in advance:
```js
const anchor = document.createElement("a");
anchor.innerText = "read more...";
anchor.href = "https://somesite.com";
```
and provide it to param `ending`:
```js / ts
...
truncator({
  ...
  ending: anchor,
  ...
});
```
`text-truncator` counts size of parent element (`.app` in example) and fits `sourceNode` to the parent. 
In the result we get truncated text with `ending` instead of extra text.

`text-truncator` listened by resize event for applied every time when page is resized. 
You can turn this option off by provide in parameter `options` boolean property `once` is true:
```js / ts
...
truncator({
  ...
  options: {
    once: true
  },
  ...
});
```
Or you can actually stop `truncator` at all. For that you just call a function retured by `truncator` (closing function) after its launch whenever you need.
For instance you need to stop it in 5 sec after start:
```js / ts
...
const stopTruncator = truncator({...});
...
setTimeout(() => stopTruncator(), 5000);
...
```

## All available parameters
```js / ts
truncator({
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
To use in SPA call closing function mentioned above in unmounted lifecycle method.
For example you can use it with `React/Hooks`:
```js / ts
...
useEffect(() => {
  const stopTruncator = truncator({...});
  ...
  return () => {
    stopTruncator();
    ...
  }
}, []);
...
```

## Ending
If you use a string as the ending character don't use special chars like these `< \ ( ) ^ * $` as this can lead to incorrect results.

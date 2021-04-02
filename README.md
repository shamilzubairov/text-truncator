# Text-truncator 1.2.3v

Universal library that makes a lot of text truncated in a small parent container.

`text-truncator` listened by resize event for applied every time when page is resized. You can turn this option off by provide in parameter `options` boolean property `once` is true.

[MIT License](LICENSE.txt)

## Attention!
Version before 1.0.11 didn't work correctly. Please update it.

## Installation

```sh
npm install text-truncator
```
## Usage

```js / ts
import truncator from 'text-truncator'

...

const stopTruncator = truncator({
  sourceNode: "h3", // Required! Use CSS selectors (string) or HTML element
  sourceAncestor: ".parentDiv", // Use CSS selectors (string) or HTML element. By default it uses "body"
  ending: "read mode...",  // Use CSS selectors (string) or HTML element. By default it uses ...
  options: {
    maxLength: 700, // The maximum number of letters that we want to be shown before truncate. By default it uses Infinity
    minCutLength: 100, // The maximum number of letters after which the text completely disappears. By default it uses 0
    delay: 250, // Time (in millisec) to delay animation of truncate. Inside itself truncator uses the throttling function. By default it uses 100
    once: true // Needs to call truncator just one time without adding listener to resize event. By default it equals false
  }
});
```

To use in SPA it returns closing function which can be called before a component will be removed from the DOM.

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
If you use a string as the ending character don't use special chars like this `< \ ( ) ^ * $`
This can lead to errors.
# Truncator 1.0.7v (beta)

This library will help you crop text that does not fit into the container and replace it by some ending.

[MIT License](LICENSE.txt)

## Installation

```sh
npm install truncator
```
## Usage

```js / ts
import truncator from 'text-truncator'
...

/**
 * @param {(HTMLElement|string)} sourceNode - Source element which contains truncated text
 * @param {(HTMLElement|string)} [sourceAncestor=body] - Parent node of the source element or body tag by default
 * @param {(HTMLElement|string)} [ending=...] - Ending of the text or `...` by default
 * @param {Options} options - Object {@link SettingOptions} with additional parameters
 * @return {Function} - Closing function
 * 
 * @typedef {Object} SettingOptions
 * @property {number} [maxLength=Infinity] - The maximum number of letters that we want to be shown before truncate
 * @property {number} [minCutLength=0] - The maximum number of letters after which the text completely disappears
 * @property {number} [delay=100] - Time (in millisec) to delay animation of truncate. Inside itself truncator uses the throttling function
 */
truncator = ({
  sourceNode,
  sourceAncestor = ".parentDiv",
  ending = "read mode...",
  options = {
    maxLength: 700,
    delay: 250,
  }
}:
```

To use in SPA it returns closing function which can be called before a component will be removed from the DOM.



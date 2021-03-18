# Truncator 1.0.0v (beta)

This library will help you crop text that does not fit into the container and replace it by some ending.

[MIT License](LICENSE.txt)

## Installation

```sh
npm install truncator
```
## Usage

```js / ts
import truncator from 'truncator'

...

/**
 * @param sourceNode {Node | string} исхожный DOM-элемент в котором происходит обрезка текста
 * @param sourceAncestor {Node | string} родитель исходного DOM-элемента, по которому происходит подсчет допустимого текста
 * @param ending {Node | string} окончание текста - может быть либо строкой, либо DOM-элементом
 * @param options {Object} объект с дополнительными параметрами
 * @return {Function}
 */
truncator = ({
  sourceNode,
  sourceAncestor = "body",
  ending,
  options = {
    maxLength: Infinity,
    minCutLength: 0,
    delay: 100,
  }
}:
```



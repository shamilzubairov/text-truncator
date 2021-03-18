export interface TruncatorParams {
  sourceNode: HTMLElement | string,
  sourceAncestor: HTMLElement | string,
  ending: HTMLElement | string,
  options: {
    maxLength?: number,
    minCutLength?: number,
    delay?: number,
  }
}
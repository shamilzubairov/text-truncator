export const getAncestorBottomCoords = (nodeRef: HTMLElement, ancestorRef: HTMLElement): number | null => {
  let ancestorRefAttr = ancestorRef.tagName.toLowerCase();
  ancestorRefAttr += ancestorRef.id && `#${ancestorRef.id}`;
  ancestorRefAttr += ancestorRef.className && `.${ancestorRef.className}`;
  const closestAncestor = nodeRef.closest(ancestorRefAttr);
  return closestAncestor ? closestAncestor.getBoundingClientRect().bottom : null
}
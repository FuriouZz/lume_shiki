export function insertToHead(document: Document, newNode: Node) {
  for (const node of document.head.childNodes) {
    if (
      node.nodeType === document.COMMENT_NODE &&
      node.textContent?.trim() === "shiki-imports"
    ) {
      document.head.insertBefore(newNode, node);
      break;
    }
  }
}

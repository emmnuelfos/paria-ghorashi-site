"use client";

/** Shared text-splitting helpers (masked char rise + word blur reveals). */

/** Split an element's text into masked char spans; returns inner spans to animate. */
export function splitIntoChars(el: HTMLElement): HTMLElement[] {
  const raw = el.textContent ?? "";
  el.innerHTML = "";
  const inners: HTMLElement[] = [];
  raw.split("").forEach((ch) => {
    const outer = document.createElement("span");
    outer.style.cssText =
      "display:inline-block;overflow:hidden;vertical-align:top;padding:0.15em 0.3em;margin:-0.15em -0.3em;";
    const inner = document.createElement("span");
    inner.className = "char";
    inner.style.display = "inline-block";
    inner.textContent = ch === " " ? " " : ch;
    outer.appendChild(inner);
    el.appendChild(outer);
    inners.push(inner);
  });
  return inners;
}

/** Wrap every word (text nodes only, preserving markup) in a .word span. */
export function wrapWords(el: HTMLElement): void {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode as Text);

  textNodes.forEach((node) => {
    const words = (node.textContent ?? "").split(/(\s+)/);
    const frag = document.createDocumentFragment();
    words.forEach((w) => {
      if (/^\s+$/.test(w)) {
        frag.appendChild(document.createTextNode(w));
      } else if (w) {
        const span = document.createElement("span");
        span.className = "word";
        span.textContent = w;
        frag.appendChild(span);
      }
    });
    node.parentNode?.replaceChild(frag, node);
  });
}

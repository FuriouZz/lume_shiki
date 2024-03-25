globalThis.addEventListener("click", (e) => {
  const target = e.target;

  if (
    target instanceof HTMLButtonElement &&
    target.matches("pre > button.copy")
  ) {
    const parent = target.parentElement;
    const codeBlock = parent?.querySelector("code[class*=language-]");
    const lines = codeBlock?.querySelectorAll(".line");
    if (!lines) return;

    const str = [];

    for (const line of lines) {
      if (line.matches(".diff.remove")) continue;
      str.push(line.textContent);
    }

    navigator.clipboard.writeText(str.join("\n"));
  }
});


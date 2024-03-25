---
layout: layout.vto
---

## Highlight

```javascript{label=demo.js lang=js}
const greeting = "Hello";
const who = "World";
const msg = `${greeting} ${who}!`; // [!code highlight]
console.log(msg);
const longString = "abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789";
```

## Range highlight

```javascript{label=demo.js}
const greeting = "Hello";
const who = "World"; // [!code highlight:2]
const msg = `${greeting} ${who}!`;
console.log(msg);
```

## Diff

```javascript{label=demo.js}
const greeting = "Hello";
const who = "World"; // [!code --]
const who = "John"; // [!code ++]
const msg = `${greeting} ${who}!`;
console.log(msg);
```

## Focus

```javascript{label=demo.js}
const greeting = "Hello";
const who = "World";
const who = "John";
const msg = `${greeting} ${who}!`; // [!code focus]
console.log(msg);
```

## Warning and Error

```javascript{label=demo.js}
const msg = "Hello World";
console.warn(msg); // [!code warning]
console.error(msg); // [!code error]
```

## Whitespace

```javascript{label=demo.js}
const msg = "Hello World";
  console.warn(msg);
	console.error(msg);
```

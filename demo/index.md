---
layout: layout.vto
---

## Highlight

```javascript
const greeting = "Hello";
const who = "World";
const msg = `${greeting} ${who}!`; // [!code highlight]
console.log(msg);
```

## Range highlight

```javascript
const greeting = "Hello";
const who = "World"; // [!code highlight:2]
const msg = `${greeting} ${who}!`;
console.log(msg);
```

## Diff

```javascript
const greeting = "Hello";
const who = "World"; // [!code --]
const who = "John"; // [!code ++]
const msg = `${greeting} ${who}!`;
console.log(msg);
```

## Focus

```javascript
const greeting = "Hello";
const who = "World";
const who = "John";
const msg = `${greeting} ${who}!`; // [!code focus]
console.log(msg);
```

## Warning and Error

```javascript
const msg = "Hello World";
console.warn(msg); // [!code warning]
console.error(msg); // [!code error]
```

## Whitespace

```javascript
const msg = "Hello World";
  console.warn(msg);
	console.error(msg);
```

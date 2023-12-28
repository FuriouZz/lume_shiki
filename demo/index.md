---
layout: layout.vto
---

```javascript
const greeting = "Hello";
const who = "World";
const msg = `${greeting} ${who}!`; // [!code highlight]
console.log(msg);
```

```javascript
const greeting = "Hello";
const who = "World"; // [!code --]
const who = "John"; // [!code ++]
const msg = `${greeting} ${who}!`;
console.log(msg);
```

```javascript
const greeting = "Hello";
const who = "World";
const who = "John";
const msg = `${greeting} ${who}!`; // [!code focus]
console.log(msg);
```

```javascript
const msg = "Hello World";
console.warn(msg); // [!code warning]
console.error(msg); // [!code error]
```

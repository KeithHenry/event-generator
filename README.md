# Event Generator

Experiment using `--js-flags=--harmony-async-iteration` in Chrome Canary 60

`EventGenerator` is reative-style _observable_ pattern using the new `async generator` language function.

## Examples
```javascript
// Get a test panel in the page
const testPanel = document.getElementById('test');

// Create a generator that iterates each time the click event happens
const eventIterator = eg(testPanel, 'click');

// Loop through the events 
for await (const e of eventIterator) {
    console.log('Clicked', e);
    testPanel.textContent = `x: ${e.offsetX}, y: ${e.offsetY}`;
}
```

## Disclaimer

`EventGenerator` is an experimental proof of concept. It is not intended for production.
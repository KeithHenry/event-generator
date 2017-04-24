# Event Generator

Experiment using `--js-flags=--harmony-async-iteration` in Chrome Canary 60

`EventGenerator` is reactive-style _observable_ pattern using the new `async generator` language function.

## Examples

Create a new generator with `new EventGenerator` or the shorthand `eg`:

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

This creates a loop that never stops, but you can stop listening with `.stop()`:

```javascript
// Create a generator that iterates each time the click event happens
const eventIterator = eg(testPanel, 'click');

// When a cancel button is clicked stop the iterator
const cancelButton = document.getElementById('cancel');
cancelButton.addEventListener('click', e => eventIterator.stop(), { once: true })

// Loop until cancel is clicked
for await (const e of eventIterator) {
    console.log('Clicked', e);
    testPanel.textContent = `x: ${e.offsetX}, y: ${e.offsetY}`;
}

// Fires once the listener is clicked
console.log('Done');
testPanel.textContent = 'Done';
```

## Disclaimer

`EventGenerator` is an experimental proof of concept. It is not intended for production.
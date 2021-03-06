# Event Generator

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

You can exit the loop with `break` and the event listener will be removed:

```javascript
for await (const e of eventIterator.map(e => ({ x: e.offsetX, y: e.offsetY }))) {
    console.log('Clicked', e);
    testPanel.textContent = `x: ${e.x}, y: ${e.y}, ${maxClicks} clicks left`;

    if(maxClicks-- <= 0)
        break; // Stop looping events
}
```

`return`, `continue` on an outer loop, or `throw` will have the same effect.

You can run the loop without `await` using `.each()` :

```javascript
eg(testPanel, 'mousemove').
    each(e => console.log(`x: ${e.offsetX}, y: ${e.offsetY}`)).
    then(_ => console.log('stopped');
```

## Demo

Live demo at [https://keithhenry.github.io/event-generator/](https://keithhenry.github.io/event-generator/), requires Chrome 63 or above.

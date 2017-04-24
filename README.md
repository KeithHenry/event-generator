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

You can run the loop without `await` using `.each()` :

```javascript
eg(testPanel, 'mousemove').
    each(e => console.log(`x: ${e.offsetX}, y: ${e.offsetY}`)).
    then(_ => console.log('stopped');
```

## Demo

Live demo at [https://keithhenry.github.io/event-generator/](https://keithhenry.github.io/event-generator/), but it only works in Chrome Canary 60+ with  `--js-flags=--harmony-async-iteration` enabled.

## TODO

This overlaps/conflicts with [the _observable_ proposal](https://github.com/tc39/proposal-observable), which is fine as it's just a sandbox for playing with these ideas.

If that gets implementent then this really isn't needed, but if it isn't then it could be worth resolving this to be closer to that proposal.

## Disclaimer

`EventGenerator` is an experimental proof of concept. It is not intended for production.
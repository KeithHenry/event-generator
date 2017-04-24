/** Wrap an event with a generator that yields each time the event fires 
 * @author Keith Henry <keith.henry@evolutionjobs.co.uk>
 * @license MIT */
class EventGenerator {

    /** Create an async iteration of events
     * @param {Element} element The DOM element to subscribe to an event on
     * @param {string} event The name of the event to subscribe to */
    constructor(element, event) {
        this.running = true;
        this.element = element;
        this.event = event;
    }

    /** Stop listening for further events */
    return() {
        this.running = false;

        // If set resolve the current promise
        if(this.resolveCurrent)
            this.resolveCurrent(null);

        return { done: true };
    }

    /** Return a promise that resolves when the next event fires, or when stop is called.
     * @returns {Promise} Resolves when the next event fires, or when stop is called. */
    next() {
        // Each time this is called we await a promise resolving on the next event
        return new Promise((r,x) => {
            if(this.resolveCurrent)
                x(new Error('Cannot iterate to the next promise while previous is still active.'));

            // If not running then resolve any current event and return done
            if(!this.running)
                return r({ done: true });

            // Hold on to the resolution event so we can stop it from outside the loop
            this.resolveCurrent = e => { 
                // Always stop listening, though once: true will handle this normally
                this.element.removeEventListener(this.event, this.resolveCurrent);

                // Resolve the promise
                r({value: e, done: !this.running });

                // This keeps a reference to the expired promise hanging around, so null it once done
                this.resolveCurrent = null;
            };

            this.element.addEventListener(this.event, this.resolveCurrent, { once: true, passive: true });
        });
    }
    
    /** Iterate the event asynchronously */
    [Symbol.asyncIterator]() {
        return this;
    }

    stop() { this.return(); }

    /** Execute an action each time an event is iterated.
     * @param {function} action To fire for each element.
     * @returns {Promise} Resolves once the event has been stopped. */
    async each(action) {
        for await (const e of this)
            action(e);
    }

    /** Map the collection of events 
     * @param {function} transform To translate each element.
     * @returns Async iterator of mapped items. */
    async *map(transform) {
        for await (const e of this)
            yield transform(e);
    }

    /** Filter the collection of events 
     * @param {function} predicate Determine whether the item should be included.
     * @returns Async iterator of filtered items. */
    async *filter(predicate) {
        for await (const e of this)
            if(predicate(e))
                yield e;
    }
}

/** Create an async iteration of events.
 * @param {Element} element The DOM element to subscribe to an event on.
 * @param {string} event The name of the event to subscribe to.
 * @returns {EventGenerator} Iterator for events. */
function eg(element, event) { return new EventGenerator(element, event); }
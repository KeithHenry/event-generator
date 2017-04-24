/** Wrap an event with a generator that yields each time the event fires */
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
    stop() {
        this.running = false;

        // Fire once more to clear the current event
        if(typeof this.element[this.event] === 'function')
            this.element[this.event](null);
    }

    /** Iterate the event asynchronously */
    async *[Symbol.asyncIterator]() {

        // Each time n() is called we await a promise resolving on the next event
        const n = () => new Promise(r => this.element.addEventListener(this.event, r, { once: true, passive: true }));

        // Await the next event
        let e = await n();
        while (this.running) {
            yield e;
            e = await n();
        }

        return;
    }
}

/** Create an async iteration of events.
 * @param {Element} element The DOM element to subscribe to an event on.
 * @param {string} event The name of the event to subscribe to.
 * @returns {EventGenerator} Iterator for events. */
function eg(element, event) { return new EventGenerator(element, event); }
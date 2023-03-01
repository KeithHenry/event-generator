class EventSourceGenerator<T> 
    implements AsyncIterator<T, number, void> {

    /** Create an async iteration of events.
     * @param source Event source to generate an iterator over. */
    constructor(private source: EventSource, private event: string) {
        this.running = true;
    }

    private running: boolean;
    private resolveCurrent: (e: MessageEvent<T>) => void;
    private messageCount: number = 0;

    /** Stop listening for further events.
     * Sets flag so that next() will return done as true, and resolves and unsubscribes the current event.
     * This tidies up if the loop is exited early with break or return.
     * @returns {any} Object with done: true, always. */
    return(): Promise<IteratorResult<T, number>> {
        this.running = false;

        // If set resolve the current promise
        if(this.resolveCurrent)
            this.resolveCurrent(undefined);

        return { done: true, value: this.messageCount } as any; // really IteratorReturnResult<number>;
    }

    /** Return a promise that resolves when the next event fires, or when stop is called.
     * Called each time for-await-of iterates as long as done is false.
     * @returns Resolves when the next event fires, or when stop is called. */
    next(): Promise<IteratorResult<T, number>> {
        // Each time this is called we await a promise resolving on the next event
        return new Promise((r,x) => {
            if(this.resolveCurrent)
                x(new Error('Cannot iterate to the next promise while previous is still active.'));

            // If not running then resolve any current event and return done
            if(!this.running)
                return r({ done: true, value: undefined });

            // Hold on to the resolution event so we can stop it from outside the loop
            this.resolveCurrent = e => { 
                // Always stop listening, though once: true will handle this normally
                this.source.removeEventListener(this.event, this.resolveCurrent);

                // Resolve the promise
                if(this.running)
                    r({value: e.data, done: false });

                // This keeps a reference to the expired promise hanging around, so null it once done
                this.resolveCurrent = null;
                this.messageCount++;
            };

            this.source.addEventListener(this.event, this.resolveCurrent, { once: true, passive: true });
        });
    }
    
    /** Iterate the event asynchronously */
    [Symbol.asyncIterator]() { return this; }
}

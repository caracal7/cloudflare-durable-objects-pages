
export class Counter {

    constructor(state, env) {
        this.value = 0;
        this.state = state;
        // `blockConcurrencyWhile()` ensures no requests are delivered until
        // initialization completes.
        this.state.blockConcurrencyWhile(async () => {
            this.value = (await this.state.storage.get('value')) || 0;
        })
    }

    async fetch(request) {
        let url = new URL(request.url);

        // Durable Object storage is automatically cached in-memory, so reading the
        // same key every request is fast. (That said, you could also store the
        // value in a class member if you prefer.)
        let value = (await this.state.storage.get("value")) || 0;

        switch (url.pathname) {
            case "/increment":
                ++value;
                await this.state.storage.put("value", value);
                break;
            case "/decrement":
                --value;
                await this.state.storage.put("value", value);
                break;
            case "/get":
                break;
            default:
                return new Response("Not found", { status: 404 });
        }



        return new Response(value);
    }
}

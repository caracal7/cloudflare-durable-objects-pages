export { Counter } from './counter';
import { Hono } from 'hono';
const app = new Hono();

async function callDO(ctx, method) {
    const id = ctx.env.COUNTER.idFromName('test-drive');
    const obj = ctx.env.COUNTER.get(id);

    const origin = (new URL(ctx.req.url)).origin;
    const response = await obj.fetch(origin+'/'+method);

    if (response.status === 404) return ctx.json({ '404': 'Not Found' });

    const count = parseInt(await response.text());

    return ctx.json({
        message: 'Hello i.js',
        count
    })
}

app.get('/get',         async ctx => await callDO(ctx, 'get'));
app.get('/increment',   async ctx => await callDO(ctx, 'increment'));
app.get('/decrement',   async ctx => await callDO(ctx, 'decrement'));

app.get('*', async ctx => await ctx.env.ASSETS.fetch(ctx.req.url));

export default app;

# CloudFlare vs Vercel benchmark

This repo is meant to benchmark SSR performance between CloudFlare and Vercel. There's a lot of misinformation going around and I'm annoyed. So I wrote a really annoying component and server rendered it in a bunch of different ways.

## Results

From my findings, **Vercel is 1.2x to 5x faster than CloudFlare for server rendering**.

I also noticed some CF runs would perform TERRIBLY on Next and SvelteKit. Like 1/5th of attempts taking 10+ seconds (mean is closer to 1.2s). Horrible variability.

Do these numbers really matter? Meh. Not really. Most "slowness" for web apps is APIs and queries being slow. CPU is rarely the bottleneck.

Regardless, here's the results laid out (you can see individual runs in the `results` directory).

I ran 100 iterations with every framework/provider combo. The results will shock you!

All Vercel tests were run with "performance" function environments (2 vcpu and 4gb ram). I ran multiple runs on "Standard" as well (included in `/results`), difference wasn't as large as expected (~10% hit overall).

## next-js

| Platform   | Mean   | Min    | Max    | Variability |
| ---------- | ------ | ------ | ------ | ----------- |
| Cloudflare | 1.895s | 0.800s | 3.971s | 3.171s      |
| Vercel     | 0.534s | 0.343s | 1.442s | 1.098s      |

**Winner:** Vercel (3.55x faster)

## react-ssr-bench

| Platform   | Mean   | Min    | Max    | Variability |
| ---------- | ------ | ------ | ------ | ----------- |
| Cloudflare | 0.476s | 0.227s | 1.383s | 1.156s      |
| Vercel     | 0.138s | 0.059s | 0.635s | 0.576s      |

**Winner:** Vercel (3.45x faster)

## sveltekit

| Platform   | Mean   | Min    | Max    | Variability |
| ---------- | ------ | ------ | ------ | ----------- |
| Cloudflare | 0.292s | 0.078s | 1.038s | 0.960s      |
| Vercel     | 0.113s | 0.058s | 0.552s | 0.494s      |

**Winner:** Vercel (2.59x faster)

## shitty-sine-bench

| Platform   | Mean    | Min     | Max     | Variability |
| ---------- | ------- | ------- | ------- | ----------- |
| Cloudflare | 23.401s | 8.122s  | 46.326s | 38.204s     |
| Vercel     | 36.025s | 30.376s | 38.156s | 7.781s      |

**Winner:** Cloudflare (1.54x faster)

## realistic-math-bench

| Platform   | Mean   | Min    | Max    | Variability |
| ---------- | ------ | ------ | ------ | ----------- |
| Cloudflare | 1.469s | 0.751s | 3.387s | 2.636s      |
| Vercel     | 0.702s | 0.463s | 1.136s | 0.673s      |

**Winner:** Vercel (2.09x faster)

## vanilla-slower

| Platform   | Mean   | Min    | Max    | Variability |
| ---------- | ------ | ------ | ------ | ----------- |
| Cloudflare | 0.220s | 0.104s | 0.620s | 0.516s      |
| Vercel     | 0.208s | 0.119s | 0.743s | 0.624s      |

**Winner:** Vercel (1.06x faster)

## FAQ

### Why do this?

Someone was lying on the internet and it went viral. I was annoyed. This should show why.

### Isn't this measuring round trip time? Why not measure actual compute time?

Fun fact - you \_can't use `performance.now()` on CloudFlare. It's [frozen due to spectre side channeling](https://developers.cloudflare.com/workers/runtime-apis/performance/#:~:text=When%20Workers%20are%20deployed%20to%20Cloudflare%2C%20as%20a%20security%20measure%20to%20mitigate%20against%20Spectre%20attacks). Since CloudFlare runs your code in an isolate instead of a vm, you're sharing memory with other workers by other devs. They have to do shit like this to keep your data safe.

### What is the "shitty-sine-bench" test about?

There's another youtuber who claimed CF is 3x faster than Vercel. He's mostly wrong.

CF is ~2x faster at computing floating point numbers and sine/cosine operations. In more realistic math, Vercel is faster (see `realistic-math-bench`).

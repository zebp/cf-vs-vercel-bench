# CloudFlare vs Vercel benchmark

This repo is meant to benchmark SSR performance between CloudFlare and Vercel. There's a lot of misinformation going around and I'm annoyed. So I wrote a really annoying component and server rendered it in a bunch of different ways.

## Results

From my findings, **Vercel is 1.37x to 4.8x faster than CloudFlare for server rendering**.

I also noticed some CF runs would perform TERRIBLY on Next and SvelteKit. Like 1/5th of attempts taking 10+ seconds (mean is closer to 1.2s). Horrible variability.

Do these numbers really matter? Meh. Not really. Most "slowness" for web apps is APIs and queries being slow. CPU is rarely the bottleneck.

Regardless, here's the results laid out (you can see individual runs in the `results` directory).

I ran 100 iterations with every framework/provider combo. The results will shock you!

All Vercel tests were run with "performance" function environments (2 vcpu and 4gb ram). I ran multiple runs on "Standard" as well (included in `/results`), difference wasn't as large as expected (~10% hit overall).

## next-js

| Platform   | Mean   | Min    | Max    | Variability |
| ---------- | ------ | ------ | ------ | ----------- |
| Cloudflare | 2.217s | 1.183s | 3.604s | 2.421s      |
| Vercel     | 0.448s | 0.318s | 0.678s | 0.360s      |

**Winner:** Vercel (4.95x faster)

## vanilla-slower

| Platform   | Mean   | Min    | Max    | Variability |
| ---------- | ------ | ------ | ------ | ----------- |
| Cloudflare | 0.308s | 0.148s | 1.004s | 0.856s      |
| Vercel     | 0.245s | 0.198s | 0.516s | 0.318s      |

**Winner:** Vercel (1.26x faster)

## sveltekit

| Platform   | Mean   | Min    | Max    | Variability |
| ---------- | ------ | ------ | ------ | ----------- |
| Cloudflare | 0.161s | 0.061s | 0.609s | 0.548s      |
| Vercel     | 0.086s | 0.054s | 0.304s | 0.250s      |

**Winner:** Vercel (1.87x faster)

## react-ssr-bench

| Platform   | Mean   | Min    | Max    | Variability |
| ---------- | ------ | ------ | ------ | ----------- |
| Cloudflare | 0.566s | 0.205s | 1.275s | 1.070s      |
| Vercel     | 0.122s | 0.074s | 0.342s | 0.268s      |

**Winner:** Vercel (4.65x faster)

## FAQ

### Why do this?

Someone was lying on the internet and it went viral. I was annoyed. This should show why.

### Isn't this measuring round trip time? Why not measure actual compute time?

Fun fact - you \_can't use `performance.now()` on CloudFlare. It's [frozen due to spectre side channeling](https://developers.cloudflare.com/workers/runtime-apis/performance/#:~:text=When%20Workers%20are%20deployed%20to%20Cloudflare%2C%20as%20a%20security%20measure%20to%20mitigate%20against%20Spectre%20attacks). Since CloudFlare runs your code in an isolate instead of a vm, you're sharing memory with other workers by other devs. They have to do shit like this to keep your data safe.

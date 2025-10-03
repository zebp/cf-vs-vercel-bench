# CloudFlare vs Vercel benchmark

This repo is meant to benchmark SSR performance between CloudFlare and Vercel. There's a lot of misinformation going around and I'm annoyed.

## Results

I ran the Next.js bench 10 times. Vercel is configured to use the "standard" function size (1 vcpu + 2gb RAM)

From my findings: **Vercel was 2.1x faster than CloudFlare for rendering a complex server component**.

Cloudflare:
**Average: 2.249 seconds**

```
3.19 seconds
2.71 seconds
2.06 seconds
1.85 seconds
2.19 seconds
2.16 seconds
1.92 seconds
2.09 seconds
2.19 seconds
2.13 seconds
```

Vercel (east-1):
**Average: 1.291 seconds**

```
1.20 seconds
1.70 seconds
1.56 seconds
1.70 seconds
1.14 seconds
1.04 seconds
1.04 seconds
0.99 seconds
1.05 seconds
1.49 seconds
```

Vercel (west-1):

**Average: 1.069 seconds**

```
1.24 seconds
1.16 seconds
1.01 seconds
1.06 seconds
1.07 seconds
1.05 seconds
1.04 seconds
1.04 seconds
1.03 seconds
0.99 seconds
```

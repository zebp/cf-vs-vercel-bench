# CloudFlare vs Vercel benchmark

This repo is meant to benchmark SSR performance between CloudFlare and Vercel. There's a lot of misinformation going around and I'm annoyed.

## Results

I ran the Next.js bench 50 times on both platforms. From my findings, **Vercel is 2.5x to 3.3x faster than CloudFlare for server rendering**.

I also noticed some CF runs would perform TERRIBLY. Like 1/5th of attempts taking 10+ seconds (mean is closer to 1.2s). Horrible variability.

Do these numbers really matter? Meh. Not really. Most "slowness" for web apps is APIs and queries being slow. CPU is rarely the bottleneck.

Regardless, here's the results laid out (you can see individual runs in the `results` directory).

## Run 1 (standard function size)

This test is using the "standard" function size (1 vcpu + 2gb RAM) on Vercel.

### 📊 Cloudflare Results:

Successful requests: 50/50
Min: 1.530s
Max: 5.098s
Mean: 3.074s

### 📊 Vercel Results (us-west-1 w/ standard function size):

Successful requests: 50/50
Min: 1.017s
Max: 1.834s
Mean: 1.155s

### 📈 Comparison:

**Vercel is 2.66x faster than Cloudflare (by mean)**

## Run 2 ("Performance" function size)

This test is using the "Performance" function size (2 vcpu + 4gb RAM) on Vercel.

### 📊 Cloudflare Results:

Successful requests: 50/50
Min: 1.191s
Max: 5.731s
Mean: 2.926s

### 📊 Vercel Results:

Successful requests: 50/50
Min: 0.658s
Max: 1.804s
Mean: 0.889s

### 📈 Comparison:

Vercel is 3.29x faster than Cloudflare (by mean)

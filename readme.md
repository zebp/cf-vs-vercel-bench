# CloudFlare vs Vercel benchmark

This repo is meant to benchmark SSR performance between CloudFlare and Vercel. There's a lot of misinformation going around and I'm annoyed.

## Results

I ran the Next.js bench 10 times. Vercel is configured to use the "standard" function size (1 vcpu + 2gb RAM)

From my findings: **Vercel was 2.66x faster than CloudFlare for rendering a complex server component**.

### 📊 Cloudflare Results:

Successful requests: 50/50
Min: 1.530s
Max: 5.098s
Mean: 3.074s

### 📊 Vercel Results (us-west-1):

Successful requests: 50/50
Min: 1.017s
Max: 1.834s
Mean: 1.155s

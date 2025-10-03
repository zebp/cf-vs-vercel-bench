# CloudFlare vs Vercel benchmark

This repo is meant to benchmark SSR performance between CloudFlare and Vercel. There's a lot of misinformation going around and I'm annoyed.

## Results

I ran the Next.js bench 50 times on both platforms.

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
Min: 1.469s
Max: 6.010s
Mean: 2.965s

### 📊 Vercel Results:

Successful requests: 50/50
Min: 0.650s
Max: 2.077s
Mean: 1.000s

### 📈 Comparison:

**Vercel is 2.96x faster than Cloudflare (by mean)**

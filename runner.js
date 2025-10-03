const tests = [
  {
    name: "next-js",
    vercelUrl: "https://vercel-ssr-bench-v2-hidden.vercel.app/bench",
    cfUrl: "https://my-next-app.pinglabs.workers.dev/bench",
  },
  {
    name: "vanilla-slower",
    cfUrl: "https://vanilla-ssr-cf.pinglabs.workers.dev/slower-bench",
    vercelUrl: "https://vanilla-bench-v2.vercel.app/api/slower-bench",
  },
  {
    name: "sveltekit",
    cfUrl: "https://cf-sveltekit-bench.davis-benjamin41902.workers.dev",
    vercelUrl: "https://vercel-svelte-bench.vercel.app",
  },
  {
    name: "react-ssr-bench",
    cfUrl: "https://react-ssr-cf.pinglabs.workers.dev/bench",
    vercelUrl: "https://react-ssr-bench-v2.vercel.app/api/bench",
  },
];

const fs = require("fs");
const path = require("path");

const ITERATIONS = 50;

async function measureResponseTime(url) {
  const start = performance.now();
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    await response.text(); // Ensure the full response is received
    const end = performance.now();
    return end - start;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    return null;
  }
}

async function runBenchmark(url, name) {
  console.log(`\n🏃 Running benchmark for ${name}...`);
  console.log(`URL: ${url}`);
  console.log(`Iterations: ${ITERATIONS} (concurrency: 5)\n`);

  const times = [];
  const CONCURRENCY = 5;
  let completed = 0;
  let nextIndex = 0;

  // Spawn a fixed number of workers; each pulls the next index until done
  async function worker() {
    while (true) {
      const i = nextIndex++;
      if (i >= ITERATIONS) break;
      const time = await measureResponseTime(url);
      if (time !== null) times.push(time);
      completed++;
      process.stdout.write(`  Progress: ${completed}/${ITERATIONS}\r`);
    }
  }

  const workerCount = Math.min(CONCURRENCY, ITERATIONS);
  const workers = Array.from({ length: workerCount }, () => worker());
  await Promise.all(workers);

  console.log(`\n`);

  if (times.length === 0) {
    console.log(`❌ No successful requests for ${name}`);
    return null;
  }

  const min = Math.min(...times);
  const max = Math.max(...times);
  const mean = times.reduce((a, b) => a + b, 0) / times.length;
  const successful = times.length;

  return { min, max, mean, successful, times };
}

function formatTime(ms) {
  return `${(ms / 1000).toFixed(3)}s`;
}

async function main() {
  console.log("=".repeat(60));
  console.log("  SSR Performance Benchmark: Cloudflare vs Vercel");
  console.log("=".repeat(60));

  const allResults = [];

  for (const test of tests) {
    console.log("\n" + "-".repeat(60));
    console.log(`Test: ${test.name}`);
    console.log("-".repeat(60));

    const cfResults = await runBenchmark(
      test.cfUrl,
      `${test.name} - Cloudflare`
    );
    const vercelResults = await runBenchmark(
      test.vercelUrl,
      `${test.name} - Vercel`
    );

    console.log("=".repeat(60));
    console.log(`  RESULTS (${test.name})`);
    console.log("=".repeat(60));

    if (cfResults) {
      console.log("\n📊 Cloudflare Results:");
      console.log(
        `  Successful requests: ${cfResults.successful}/${ITERATIONS}`
      );
      console.log(`  Min:  ${formatTime(cfResults.min)}`);
      console.log(`  Max:  ${formatTime(cfResults.max)}`);
      console.log(`  Mean: ${formatTime(cfResults.mean)}`);
    }

    if (vercelResults) {
      console.log("\n📊 Vercel Results:");
      console.log(
        `  Successful requests: ${vercelResults.successful}/${ITERATIONS}`
      );
      console.log(`  Min:  ${formatTime(vercelResults.min)}`);
      console.log(`  Max:  ${formatTime(vercelResults.max)}`);
      console.log(`  Mean: ${formatTime(vercelResults.mean)}`);
    }

    if (cfResults && vercelResults) {
      console.log("\n📈 Comparison:");
      const ratio = cfResults.mean / vercelResults.mean;
      if (ratio > 1) {
        console.log(
          `  Vercel is ${ratio.toFixed(2)}x faster than Cloudflare (by mean)`
        );
      } else {
        console.log(
          `  Cloudflare is ${(1 / ratio).toFixed(
            2
          )}x faster than Vercel (by mean)`
        );
      }
    }

    allResults.push({
      name: test.name,
      urls: { cloudflare: test.cfUrl, vercel: test.vercelUrl },
      results: { cloudflare: cfResults, vercel: vercelResults },
    });
  }

  console.log("\n" + "=".repeat(60));

  // Write consolidated results to results-(datetime).json inside results/ directory
  try {
    const resultsDir = path.resolve(__dirname, "results");
    await fs.promises.mkdir(resultsDir, { recursive: true });

    const timestamp = new Date().toISOString();
    const safeStamp = timestamp.replace(/[:.]/g, "-");
    const filePath = path.join(resultsDir, `results-${safeStamp}.json`);

    const summary = {
      timestamp,
      iterations: ITERATIONS,
      concurrency: 5,
      tests: allResults,
    };

    await fs.promises.writeFile(
      filePath,
      JSON.stringify(summary, null, 2),
      "utf8"
    );
    console.log(`\n📝 Results written to: ${filePath}`);
  } catch (err) {
    console.error("Failed to write results file:", err.message);
  }
}

main().catch(console.error);

// Note: This whole file is vibe coded. I do not know how any of the formatting works. Blame Claude.

const tests = [
  {
    name: "next-js",
    cfUrl: "https://next-cf-bench.zebpiasecki.workers.dev/bench",
    vercelUrl: "https://vercel-edition-blond.vercel.app/bench",
  },
  {
    name: "react-ssr-bench",
    cfUrl: "https://react-ssr-cf.zebpiasecki.workers.dev/bench",
    vercelUrl: "https://cf-vs-vercel-bench-pqc1.vercel.app/api/bench",
  },
  {
    name: "sveltekit",
    cfUrl: " https://cf-sveltekit-bench.zebpiasecki.workers.dev/",
    vercelUrl: "https://svelte-cf-vercel-bench.vercel.app/",
  },
  // {
  //   name: "shitty-sine-bench",
  //   cfUrl: "https://vanilla-ssr-cf.zebpiasecki.workers.dev/shitty-sine-bench",
  //   vercelUrl:
  //     "https://cf-vs-vercel-bench-rho.vercel.app/api/shitty-sine-bench",
  // },
  {
    name: "realistic-math-bench",
    cfUrl:
      "https://vanilla-ssr-cf.zebpiasecki.workers.dev/realistic-math-bench",
    vercelUrl:
      "https://cf-vs-vercel-bench-rho.vercel.app/api/realistic-math-bench",
  },
  {
    name: "vanilla-slower",
    cfUrl: "https://vanilla-ssr-cf.zebpiasecki.workers.dev/slower-bench",
    vercelUrl: "https://cf-vs-vercel-bench-rho.vercel.app/api/slower-bench",
  },
  {
    name: "speedtest",
    cfUrl: "https://speed-test-cf.zebpiasecki.workers.dev/",
    vercelUrl: "https://speedtest-vercel.vercel.app/api/test",
  },
  {
    name: "react-router",
    cfUrl: "https://react-router-test.zebpiasecki.workers.dev/",
    vercelUrl: "https://react-router-vercel-ten.vercel.app/",
  },
  {
    name: "react-router [suspended]",
    cfUrl: "https://react-router-test.zebpiasecki.workers.dev/suspended",
    vercelUrl: "https://react-router-vercel-ten.vercel.app/suspended",
  },
];

const fs = require("fs");
const path = require("path");

const ITERATIONS = 100;
const CONCURRENCY = 10;

async function measureResponseTime(url) {
  const start = performance.now();
  try {
    const response = await fetch(url);

    const ttfb = performance.now() - start;

    // Read the response body
    await response.text();
    const responseTime = performance.now() - start;

    return {
      ttfb,
      time: responseTime,
      status: response.status,
      success: response.ok,
    };
  } catch (error) {
    return {
      ttfb: null,
      time: null,
      status: null,
      success: false,
      error: error.message,
    };
  }
}

async function runBenchmark(url, name) {
  console.log(`\n🏃 Running benchmark for ${name}...`);
  console.log(`URL: ${url}`);
  console.log(`Iterations: ${ITERATIONS} (concurrency: ${CONCURRENCY})\n`);

  const results = [];
  let completed = 0;
  let nextIndex = 0;

  // Spawn a fixed number of workers; each pulls the next index until done
  async function worker() {
    while (true) {
      const i = nextIndex++;
      if (i >= ITERATIONS) break;
      const result = await measureResponseTime(url);
      results.push(result);
      completed++;
      process.stdout.write(`  Progress: ${completed}/${ITERATIONS}\r`);
    }
  }

  const workerCount = Math.min(CONCURRENCY, ITERATIONS);
  const workers = Array.from({ length: workerCount }, () => worker());
  await Promise.all(workers);

  console.log(`\n`);

  // Analyze results
  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);
  const ttlb = successful.map((r) => r.time);
  const ttfb = successful.map((r) => r.ttfb);

  // Count status codes
  const statusCodes = {};
  results.forEach((r) => {
    if (r.status !== null) {
      statusCodes[r.status] = (statusCodes[r.status] || 0) + 1;
    }
  });

  // Count error types
  const errors = {};
  failed.forEach((r) => {
    if (r.error) {
      errors[r.error] = (errors[r.error] || 0) + 1;
    }
  });

  const failureRate = (failed.length / results.length) * 100;

  if (ttlb.length === 0) {
    console.log(`❌ No successful requests for ${name}`);
    console.log(`   Failure rate: ${failureRate.toFixed(2)}%`);
    if (Object.keys(statusCodes).length > 0) {
      console.log(`   Status codes:`, statusCodes);
    }
    if (Object.keys(errors).length > 0) {
      console.log(`   Errors:`, errors);
    }
    return null;
  }

  const ttlbMin = Math.min(...ttlb);
  const ttlbMax = Math.max(...ttlb);
  const ttlbMean = ttlb.reduce((a, b) => a + b, 0) / ttlb.length;

  const minTtfb = Math.min(...ttfb);
  const maxTtfb = Math.max(...ttfb);
  const meanTtfb = ttfb.reduce((a, b) => a + b, 0) / ttfb.length;

  return {
    ttlbMin,
    ttlbMax,
    ttlbMean,
    minTtfb,
    maxTtfb,
    meanTtfb,
    successful: successful.length,
    failed: failed.length,
    failureRate,
    statusCodes,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
    times: ttlb,
    ttfb,
  };
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
      if (cfResults.failed > 0) {
        console.log(`  Failed requests: ${cfResults.failed}/${ITERATIONS}`);
        console.log(`  Failure rate: ${cfResults.failureRate.toFixed(2)}%`);
        console.log(`  Status codes:`, cfResults.statusCodes);
        if (cfResults.errors) {
          console.log(`  Errors:`, cfResults.errors);
        }
      }
      console.log(`  Min:  ${formatTime(cfResults.ttlbMin)}`);
      console.log(`  Max:  ${formatTime(cfResults.ttlbMax)}`);
      console.log(`  Mean: ${formatTime(cfResults.ttlbMean)}`);
      console.log(`  Min TTFB: ${formatTime(cfResults.minTtfb)}`);
      console.log(`  Max TTFB: ${formatTime(cfResults.maxTtfb)}`);
      console.log(`  Mean TTFB: ${formatTime(cfResults.meanTtfb)}`);
    }

    if (vercelResults) {
      console.log("\n📊 Vercel Results:");
      console.log(
        `  Successful requests: ${vercelResults.successful}/${ITERATIONS}`
      );
      if (vercelResults.failed > 0) {
        console.log(`  Failed requests: ${vercelResults.failed}/${ITERATIONS}`);
        console.log(`  Failure rate: ${vercelResults.failureRate.toFixed(2)}%`);
        console.log(`  Status codes:`, vercelResults.statusCodes);
        if (vercelResults.errors) {
          console.log(`  Errors:`, vercelResults.errors);
        }
      }
      console.log(`  Min TTLB:  ${formatTime(vercelResults.ttlbMin)}`);
      console.log(`  Max TTLB:  ${formatTime(vercelResults.ttlbMax)}`);
      console.log(`  Mean TTLB: ${formatTime(vercelResults.ttlbMean)}`);
      console.log(`  Min TTFB: ${formatTime(vercelResults.minTtfb)}`);
      console.log(`  Max TTFB: ${formatTime(vercelResults.maxTtfb)}`);
      console.log(`  Mean TTFB: ${formatTime(vercelResults.meanTtfb)}`);
    }

    if (cfResults && vercelResults) {
      console.log("\n📈 Comparison:");
      const ratio = cfResults.ttlbMean / vercelResults.ttlbMean;
      if (ratio > 1) {
        console.log(
          `  Vercel is ${ratio.toFixed(
            2
          )}x faster than Cloudflare (by mean) (TTLB)`
        );
      } else {
        console.log(
          `  Cloudflare is ${(1 / ratio).toFixed(
            2
          )}x faster than Vercel (by mean) (TTLB)`
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

  // Output final results summary for README
  console.log("\n\n" + "=".repeat(60));
  console.log("  FINAL RESULTS SUMMARY");
  console.log("=".repeat(60) + "\n");

  for (const result of allResults) {
    const cf = result.results.cloudflare;
    const vercel = result.results.vercel;

    console.log(`## ${result.name}`);
    console.log();

    if (cf && vercel) {
      const ratioTTLB = vercel.ttlbMean / cf.ttlbMean;
      const winnerTTLB = ratioTTLB > 1 ? "Cloudflare" : "Vercel";
      const speedupTTLB = ratioTTLB > 1 ? ratioTTLB : 1 / ratioTTLB;

      const ratioTTFB = vercel.meanTtfb / cf.meanTtfb;
      const winnerTTFB = ratioTTFB > 1 ? "Cloudflare" : "Vercel";
      const speedupTTFB = ratioTTFB > 1 ? ratioTTFB : 1 / ratioTTFB;

      const cfVariabilityTTLB = cf.ttlbMax - cf.ttlbMin;
      const cfVariabilityTTFB = cf.maxTtfb - cf.minTtfb;
      const vercelVariabilityTTLB = vercel.ttlbMax - vercel.ttlbMin;
      const vercelVariabilityTTFB = vercel.maxTtfb - vercel.minTtfb;

      console.log(
        `| Platform   | TTLB Mean | TTLB Min | TTLB Max | TTLB Variability | TTFB Mean| TTFB Min | TTFB Max | TTFB Variability |`
      );
      console.log(
        `|------------|-----------|----------|----------|------------------|----------|----------|----------|------------------|`
      );
      console.log(
        `| Cloudflare | ${formatTime(cf.ttlbMean)} | ${formatTime(
          cf.ttlbMin
        )} | ${formatTime(cf.ttlbMax)} | ${formatTime(
          cfVariabilityTTLB
        )} | ${formatTime(cf.meanTtfb)} | ${formatTime(
          cf.minTtfb
        )} | ${formatTime(cf.maxTtfb)} | ${formatTime(cfVariabilityTTFB)} |`
      );
      console.log(
        `| Vercel     | ${formatTime(vercel.ttlbMean)} | ${formatTime(
          vercel.ttlbMin
        )} | ${formatTime(vercel.ttlbMax)} | ${formatTime(
          vercelVariabilityTTLB
        )} | ${formatTime(vercel.meanTtfb)} | ${formatTime(
          vercel.minTtfb
        )} | ${formatTime(vercel.maxTtfb)} | ${formatTime(
          vercelVariabilityTTFB
        )} |`
      );
      console.log();
      console.log(
        `**Winner TTFB:** ${winnerTTFB} (${speedupTTFB.toFixed(2)}x faster)`
      );
      console.log(
        `**Winner TTLB:** ${winnerTTLB} (${speedupTTLB.toFixed(2)}x faster)`
      );
      console.log();
    }
  }

  console.log("---");
  console.log(
    `\n*Benchmark run: ${
      new Date().toISOString().split("T")[0]
    } • ${ITERATIONS} iterations • Concurrency: ${CONCURRENCY}*`
  );
  console.log("\n" + "=".repeat(60) + "\n");

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
      concurrency: CONCURRENCY,
      tests: allResults,
    };

    await fs.promises.writeFile(
      filePath,
      JSON.stringify(summary, null, 2),
      "utf8"
    );
    console.log(`📝 Results written to: ${filePath}`);
  } catch (err) {
    console.error("Failed to write results file:", err.message);
  }
}

main().catch(console.error);

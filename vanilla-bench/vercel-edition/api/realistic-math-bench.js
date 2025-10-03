// Realistic Math Bench - CPU-bound integer and string operations benchmark

export default function handler(req, res) {
  console.log("rendering realistic math bench", Date.now());

  // CPU-bound integer and string operations benchmark
  let result = 0;

  // Integer arithmetic and bitwise operations
  for (let i = 0; i < 10_000_000; i++) {
    result += ((i * 31) ^ (i << 3)) & 0xFFFFFFFF;
    result = (result * 1103515245 + 12345) & 0x7FFFFFFF; // LCG
  }

  // Array sorting and manipulation
  const arrays = [];
  for (let i = 0; i < 100; i++) {
    const arr = Array.from({ length: 10000 }, (_, idx) => (idx * 7919) % 10007);
    arr.sort((a, b) => a - b);
    arrays.push(arr.reduce((acc, val) => acc + val, 0));
  }

  // String operations and hashing
  let stringHash = 0;
  const baseStr = "benchmark-test-string-";
  for (let i = 0; i < 1_000_000; i++) {
    const str = baseStr + i;
    for (let j = 0; j < str.length; j++) {
      stringHash = ((stringHash << 5) - stringHash + str.charCodeAt(j)) | 0;
    }
  }

  // Prime counting with optimized trial division
  let primeCount = 0;
  for (let n = 2; n < 100000; n++) {
    let isPrime = n > 1;
    if (n > 2 && n % 2 === 0) isPrime = false;
    else {
      for (let i = 3; i * i <= n; i += 2) {
        if (n % i === 0) {
          isPrime = false;
          break;
        }
      }
    }
    if (isPrime) primeCount++;
  }

  const currentTime = new Date().toLocaleString();

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Realistic Math Benchmark - Vercel</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }
      </style>
    </head>
    <body>
      <main style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh;">
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">Realistic Math Bench - Last rendered at:</h1>
        <p style="font-size: 18px; font-family: monospace; padding: 16px; border-radius: 4px;">${currentTime}</p>
        <div style="padding: 32px; max-width: 800px; margin: 0 auto; background-color: white; color: #111827;">
          <h2 style="font-size: 28px; font-weight: bold; margin-bottom: 16px;">CPU-Bound Integer & String Operations Test</h2>
          <p style="font-size: 18px; margin-bottom: 16px;">Mixed workload: integer arithmetic, array sorting, string hashing, prime counting</p>
          <div style="background-color: #f3f4f6; padding: 24px; border-radius: 8px; border: 1px solid #e5e7eb;">
            <p style="font-size: 16px; color: #1f2937; margin-bottom: 8px;">Integer result: ${result}</p>
            <p style="font-size: 16px; color: #1f2937; margin-bottom: 8px;">Array ops: ${arrays.length} sorts completed</p>
            <p style="font-size: 16px; color: #1f2937; margin-bottom: 8px;">String hash: ${stringHash}</p>
            <p style="font-size: 16px; color: #1f2937;">Primes found: ${primeCount}</p>
          </div>
        </div>
      </main>
    </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(html);
}

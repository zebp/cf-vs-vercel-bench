// Shitty Sine Bench - CPU-bound floating-point math benchmark
// Based on https://github.com/Buzut/serverless-benchmark

export default function handler(req, res) {
  console.log("rendering shitty sine bench", Date.now());

  // CPU-bound floating-point math benchmark
  let sum = 0;
  for (let i = 0; i < 100_000_000; i++) {
    const result = Math.sin(Math.PI * i) * Math.cos(Math.PI * i);
    sum += result;
  }

  const currentTime = new Date().toLocaleString();

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Shitty Sine Benchmark - Vercel</title>
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
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">Shitty Sine Bench - Last rendered at:</h1>
        <p style="font-size: 18px; font-family: monospace; padding: 16px; border-radius: 4px;">${currentTime}</p>
        <div style="padding: 32px; max-width: 800px; margin: 0 auto; background-color: white; color: #111827;">
          <h2 style="font-size: 28px; font-weight: bold; margin-bottom: 16px;">CPU-Bound Floating-Point Math Test</h2>
          <p style="font-size: 18px; margin-bottom: 16px;">Computed 100 million sine/cosine operations</p>
          <div style="background-color: #f3f4f6; padding: 24px; border-radius: 8px; border: 1px solid #e5e7eb;">
            <p style="font-size: 20px; font-weight: 600; color: #1f2937;">Result Sum: ${sum.toFixed(6)}</p>
          </div>
        </div>
      </main>
    </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(html);
}

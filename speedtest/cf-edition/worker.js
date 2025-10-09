let randomString = "";

for (let i = 0; i < 50_000; i++) {
  randomString += Math.random().toString(36).substring(2, 15);
}

export default {
  fetch: () => new Response(randomString),
};

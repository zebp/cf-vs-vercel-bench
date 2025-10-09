let randomString = "";

for (let i = 0; i < 50_000; i++) {
  randomString += Math.random().toString(36).substring(2, 15);
}

export default function handler(req, res) {
  res.status(200).send(randomString);
}

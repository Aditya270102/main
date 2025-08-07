// prompt.js
const { exec } = require("child_process");
const fs = require("fs");

const diff = fs.readFileSync("diff.txt", "utf-8");
console.log('--- DIFF FILE CONTENTS ---');
const prompt = `
You are an expert Angular/TypeScript reviewer.
Your job is to carefully analyze only the following git-style code diff.

Rules:
1. Use lodash methods instead of native JS methods.
2. Avoid using console.log in production.
3. Use const over let when variables don't change.

Here is the diff to analyze:
${diff}

IMPORTANT:
- Do NOT guess.
- Only comment on changed lines.
- Do not invent issues.
- Your response must be based strictly on the diff above.
- Format your reply in JSON like this:

[
  {
    "line": <line number>,
    "issue": "<short issue name>",
    "comment": "<detailed comment>"
  }
]
`;

console.log('--- END DIFF ---');
const child = exec("ollama run gemma3:4b", (err, stdout, stderr) => {
  if (err) {
    console.error("Error running Ollama:", err.message);
    return;
  }
  console.log(stdout);
});

child.stdin.write(prompt);
child.stdin.end();

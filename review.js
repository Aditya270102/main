const fs = require("fs");
const { execSync } = require("child_process");

// Step 1: Read git diff from a file
const diff = fs.readFileSync("diff.txt", "utf-8");

// Step 2: Create your full prompt
const prompt = `
You are an expert Angular/TypeScript reviewer.

Only review the changed lines of code below using these rules:
1. Use lodash instead of native JS functions like map/filter.
2. Avoid console.log in production code.
3. Use 'const' when the variable does not change.
4. Comment only on changed lines.

Changed Code:
----------------------------
${diff}
----------------------------

Please respond in JSON format like:
[
  {
    "line": 12,
    "issue": "Use lodash",
    "comment": "Use lodash.map instead of native map."
  }
]
`;

// Step 3: Save the prompt to a temp file
fs.writeFileSync("prompt.txt", prompt);

// Step 4: Run Ollama by redirecting the prompt as input
try {
  const result = execSync(`ollama run gemma3:4b < prompt.txt`, {
    encoding: "utf-8"
  });
  console.log("\n--- AI Response ---\n");
  console.log(result);
} catch (error) {
  console.error("\n❌ Error running Ollama:", error.message);
}

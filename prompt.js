const { execSync } = require("child_process");

const MODEL = "gemma3:4b";

try {
  // Get the diff of the latest commit
  const diff = execSync(`git diff > diff.txt`, {
    stdio: "inherit",
    shell: "/bin/bash"
  });

  // Construct the prompt
  const prompt = `You are a senior software engineer conducting a code review. You must analyze the provided code changes and provide feedback based on the following specific rules. Focus ONLY on the changes shown in the diff.

1. **Lodash Preference**: Lodash utility methods (e.g., _.map, _.filter) must be used instead of native JavaScript array methods.
2. **Avoid \`any\`**: The \`any\` type in TypeScript or similar is not allowed. Use specific, well-defined types.

Analyze the diff and provide a concise review. For each issue found, state the line number and the violation, then suggest the correct code. If no issues are found, simply say 'No issues found based on the provided rules.'

Code diff to review:
\`\`\`diff
${diff}
\`\`\`
  `;

  // Run Ollama with the prompt piped to its stdin
  console.log(`Running review with Ollama using model: ${MODEL}...`);

  const reviewResult = execSync(
    `echo "${prompt}" | ollama run ${MODEL}`
  ).toString();

  // Output the result with a clear header
  console.log("\n--- REVIEW RESULT ---\n");
  console.log(reviewResult);
  console.log("\n---------------------\n");
} catch (error) {
  console.error("An error occurred:", error.message);
  if (error.stderr) {
    console.error("Error details:", error.stderr.toString());
  }
}

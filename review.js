// review.js
import { GoogleGenAI } from "@google/genai";
import { spawnSync } from "child_process";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const DIFF_FILE = "diff.txt";

// 1️⃣ Generate the git diff into diff.txt
spawnSync("git", ["diff", "origin/main", "--", "*.component.ts"], {
  shell: true,
  stdio: ["ignore", fs.openSync(DIFF_FILE, "w"), "inherit"]
});

// 2️⃣ Read the diff
const diffText = fs.readFileSync(DIFF_FILE, "utf8");
if (!diffText.trim()) {
  console.log("⚠️ No changes in *.component.ts files.");
  process.exit(0);
}

(async () => {
  try {
    // 3️⃣ Initialize GenAI client with your API key
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `Your task is to act as a code replacement bot. You must follow the instructions exactly and provide only the requested output.

**Step 1: Identify all lines that start with a '+' in the provided code diff.**

**Step 2: For each of these lines, check for the following patterns:**
- **Pattern A:** The native JavaScript method \`.filter(\`
- **Pattern B:** The native JavaScript method \`.map(\`
- **Pattern C:** The use of the \`any\` type

**Step 3: If you find a pattern, provide a specific, pre-defined suggestion:**
- **If Pattern A is found, your ONLY suggestion is to replace it with the Lodash method \`_filter(\`.
- **If Pattern B is found, your ONLY suggestion is to replace it with the Lodash method \`_map(\`.
- **If Pattern C is found, your ONLY suggestion is to replace it with a specific type like \`number[]\` or \`Array<number>\`.

**Step 4: Format your output for each identified issue.**
The format must be a numbered list with the following structure:
[Line Number]: The use of [pattern]. Instead, recommend [pre-defined suggestion].

**Step 5: If no patterns are found on any of the '+' lines, output only "No issues found."**

**Do not add any other commentary, and do not make up any issues that are not present in the provided diff. Be extremely literal and mechanical in your analysis.**

Code diff to review:
\`\`\`diff
${diffText}
\`\`\`
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    console.log("\n💬 Gemini Review:\n");
    console.log(response.text);
  } catch (err) {
    console.error("❌ Error reviewing code:", err);
  }
})();

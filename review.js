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

    const prompt = `You are a strict code reviewer.  
For each line of code in the provided diff, do the following:

1. If the line uses a native JavaScript array method that has a Lodash equivalent 
   (e.g., .filter, .map, .some, .find, .reduce, etc.), suggest replacing it with the Lodash version 
   (e.g., _filter, _map, _some, _find, _reduce).  

2. If the line uses the "any" type, suggest replacing it with a specific type like 
   number[], string[], or Array<T> depending on context.  

⚠️ Important:
- Only suggest the Lodash method when there is a direct equivalent.  
- Do not suggest using Lodash when there is no equivalent.  
- Do not suggest multiple options — always give one direct replacement.  

Your output should ONLY contain the specific code review suggestions with line numbers if possible.


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

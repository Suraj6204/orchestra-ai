import { getModel } from "../config/llmModels.js";
import { generatePpt } from "../utils/generatePpt.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const pptAgent = async (state) => {
  try {
    await checkAgentLimit(state.userId, "ppt");
    const llm = await getModel("ppt");
    const prompt = `You are a professional presentation designer.

Return ONLY valid JSON.

Format:

{
"title":"",
"subtitle":"",
"slides":[
{
"title":"",
"points":[
"",
"",
"",
""
]
}
]
}

Rules:

- Generate exactly 6 content slides.
- Each slide should have 4-6 concise bullet points.
- No markdown.
- No explanation.
- No code block.
- Return ONLY JSON.

Topic: ${state.prompt}`;

    const res = await llm.invoke(prompt);
    const data = JSON.parse(res.content);
    await deductCredits(state.userId, "ppt");
    const ppt = await generatePpt(data);
    const buffer = await ppt.write({
      outputType: "nodebuffer",
    });

    const filename = `ppt/ppt-${Date.now()}.pptx`;

    const path = await uploadToS3(
      filename,
      buffer,
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    );
    
    const downloadUrl = await getFromS3(path);
    console.log("Download URL:", downloadUrl);
    return {
      ...state,
      aiResponse: `# ✅ Presentation Generated

**${data.title}**

📥 [Download PPT](${downloadUrl})

_Link expires in 10 minutes._`,
    };
  } 
  catch (error) {
    console.log(error);
    return {
      ...state,
      aiResponse: error?.data?.message || "Failed to generate PPT",
    };
  }
};



// export const pptAgent = async (state) => {
//   try {
//     console.log("1️⃣ PPT Agent started");

//     await checkAgentLimit(state.userId, "ppt");
//     console.log("2️⃣ Agent limit checked");

//     const llm = await getModel("ppt");
//     console.log("3️⃣ Model loaded");

//     const prompt = `You are a professional presentation designer.

// Return ONLY valid JSON.

// Format:

// {
//   "title":"",
//   "subtitle":"",
//   "slides":[
//     {
//       "title":"",
//       "points":["","","",""]
//     }
//   ]
// }

// Rules:

// - Generate exactly 6 content slides.
// - Each slide should have 4-6 concise bullet points.
// - No markdown.
// - No explanation.
// - No code block.
// - Return ONLY JSON.

// Topic: ${state.prompt}`;

//     console.log("4️⃣ Calling LLM...");

//     const res = await llm.invoke(prompt);

//     console.log("5️⃣ LLM response received");
//     // console.log("LLM response:", res.content);

//     const data = JSON.parse(res.content);

//     console.log("6️⃣ JSON parsed successfully");
//     // console.log("PPT data:", data);

//     await deductCredits(state.userId, "ppt");

//     console.log("7️⃣ Credits deducted");

//     const ppt = await generatePpt(data);

//     console.log("8️⃣ PPT object generated");

//     const buffer = await ppt.write({
//       outputType: "nodebuffer",
//     });

//     console.log("9️⃣ PPT buffer generated");
//     // console.log("Buffer size:", buffer.length);

//     const filename = `ppt/ppt-${Date.now()}.pptx`;

//     console.log("🔟 Uploading:", filename);

//     const path = await uploadToS3(
//       filename,
//       buffer,
//       "application/vnd.openxmlformats-officedocument.presentationml.presentation"
//     );

//     console.log("1️⃣1️⃣ Uploaded to S3");

//     const downloadUrl = await getFromS3(path);
//     // const downloadUrl = await getFromS3(
//     //   filename,
//     //   // 24 * 60 * 60
//     // );

//     if(downloadUrl) {
//     console.log(`1️⃣2️⃣ Download URL: ${downloadUrl}`);
//     }
//     return {
//       ...state,
//       aiResponse: `# ✅ Presentation Generated

// **${data.title}**

// 📥 [Download PPT](${downloadUrl})

// _Link expires in 10 minutes._`,
//     };

//   } catch (error) {

//     console.error("❌ PPT AGENT ERROR");
//     console.error("Message:", error?.message);
//     console.error("Stack:", error?.stack);
//     console.error("Full error:", error);

//     return {
//       ...state,
//       aiResponse: `Failed to generate PPT: ${error?.message || "Unknown error"}`,
//     };
//   }
// };
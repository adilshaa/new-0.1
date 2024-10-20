const axios = require("axios");

async function handleError(err) {
  //   const stack = err.stack || "";
  //   const message = err.message || "Unknown error";

  //   const match =
  //     stack.match(/\((.*):(\d+):(\d+)\)/) || stack.match(/at (.*):(\d+):(\d+)/);
  //   let codeSnippet = "No code snippet available";
  //   if (match) {
  //     const [_, filePath, lineNumber] = match;
  //     const errorLineNumber = parseInt(lineNumber, 10);

  //     codeSnippet = getCodeSnippet(filePath, errorLineNumber);
  //   }

  // const prompt = `Error message: ${message}\n\nStack trace: ${stack}\n\n${codeSnippet}. Reply with only fixed code`;
  const prompt = `Write a function in Nodx.js that calculates the factorial of a number.`;

  try {
    let messages = [
      { role: "system", content: "You are an expert in programming." },
      { role: "user", content: prompt },
    ];

    axios
      .post(
        "https://nexra.aryahcr.cc/api/chat/complements",
        {
          messages: messages,
          stream: false,
          markdown: false,
          model: "gpt-4o",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          let input = response.data;
          // console.log(input.message);

          let extracted = extractAndFormatCode(input.message);

          // Separate the input string
          const separatedContent = separateTextAndCode(extracted);

          // Output the result

          // // Modify your code to remove the '_' at the end of the output
          // //   console.log(response.data);

          // const codeBlocks = [];
          // const textBlocks = [];

          // // Split input based on code block delimiter (```)
          // const parts = input.split(/```/);

          // parts.forEach((part, index) => {
          //   if (index % 2 === 1) {
          //     // Odd index means it's a code block
          //     codeBlocks.push(part.trim());
          //   } else {
          //     // Even index means it's a text block
          //     textBlocks.push(part.trim());
          //   }
          // });

          // console.log({
          //   code: codeBlocks,
          //   text: textBlocks.filter((text) => text.length > 0), // Filter out empty text blocks
          // });
        } else {
          console.log("Error");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } catch (fetchError) {
    console.log("Error sending to ChatGPT:", fetchError);
  }
}

function separateTextAndCode(input) {
  const regex = /\[Code: ([^\]]+)\]\s*([\s\S]*?)(?=\[Code:|$)/g; // Regex to match code blocks with any language
  const result = [];
  let lastIndex = 0;

  input.replace(regex, (match, language, code, offset) => {
    // Push normal text before the code block
    if (offset > lastIndex) {
      result.push({
        type: "text",
        content: input.slice(lastIndex, offset).trim(),
      });
    }

    // Push the code block with the language specified
    result.push({
      type: "code",
      language: language.trim(),
      content: code.trim(),
    });
    lastIndex = offset + match.length; // Update last index
  });

  // Push any remaining text after the last code block
  if (lastIndex < input.length) {
    result.push({
      type: "text",
      content: input.slice(lastIndex).trim(),
    });
  }

  return result;
}

const extractAndFormatCode = (responseText) => {
  // Split the response into lines
  const lines = responseText.split("\n");

  // Variable to store the formatted output
  let formattedOutput = "";
  let inCodeBlock = false;
  let language = "";

  // Loop through each line and detect code blocks
  lines.forEach((line) => {
    if (line.startsWith("```")) {
      // Toggle code block state
      if (inCodeBlock) {
        formattedOutput += "\n"; // End of code block
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        // Extract the language (if specified)
        language = line.replace("```", "");
        if (language) {
          formattedOutput += `\n[Code: ${language}] \n`;
        }
      }
    } else if (inCodeBlock) {
      // If inside a code block, append the line directly
      formattedOutput += `${line}\n`;
    } else {
      // If not in a code block, append the text as regular content
      formattedOutput += `${line}\n`;
    }
  });

  return formattedOutput;
};

// axios
//   .post(
//     "https://nexra.aryahcr.cc/api/image/complements",
//     {
//       prompt: "",
//       model: "midjourney",
//       //response: "base64"
//     },
//     {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   )
//   .then((response) => {
//     // Modify your code to remove the '_' at the end of the output
//     console.log(response.data);
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//   });

// {
//   headers: {
//     "Content-Type": "application/json",
//     "x-nexra-user": "user-108W214q462",
//     "x-nexra-secret":
//       "nx-v317m1O348u4TW0e18g1328E349yH8WXE5E24dUb665T9ggnHuT",
//   },

// function parseResponse(response) {
//   const sections = [];
//   const regexPatterns = [
//     { type: "code", pattern: /```(\w+)?\n([\s\S]*?)```/g },
//     { type: "json", pattern: /(\{[\s\S]*?\}|\[[\s\S]*?\])/g },
//     { type: "markdown-header", pattern: /(?:^|\n)(#+)\s(.+?)(?:\n|$)/g },
//     { type: "list", pattern: /(?:^|\n)([-*]|\d+\.)\s(.+?)(?:\n|$)/g },
//   ];

//   let remainingText = response;
//   let match;

//   // Combine all regex matches and extract in the order they appear
//   while (remainingText.length > 0) {
//     let earliestMatch = null;
//     let earliestType = null;

//     for (const { type, pattern } of regexPatterns) {
//       const currentMatch = pattern.exec(remainingText);
//       if (
//         currentMatch &&
//         (!earliestMatch || currentMatch.index < earliestMatch.index)
//       ) {
//         earliestMatch = currentMatch;
//         earliestType = type;
//       }
//     }

//     // If no match is found, treat the remaining text as plain text
//     if (!earliestMatch) {
//       sections.push({
//         type: "text",
//         content: remainingText.trim(),
//       });
//       break;
//     }

//     // Push any plain text that occurs before the earliest match
//     const plainText = remainingText.slice(0, earliestMatch.index).trim();
//     if (plainText.length > 0) {
//       sections.push({
//         type: "text",
//         content: plainText,
//       });
//     }

//     // Process the matched section based on its type
//     switch (earliestType) {
//       case "code":
//         sections.push({
//           type: "code",
//           language: earliestMatch[1] || "unknown",
//           content: earliestMatch[2],
//         });
//         break;
//       case "json":
//         sections.push({
//           type: "json",
//           content: earliestMatch[0], // Could try to parse if needed
//         });
//         break;
//       case "markdown-header":
//         sections.push({
//           type: "markdown-header",
//           level: earliestMatch[1].length, // Header level based on number of #
//           content: earliestMatch[2],
//         });
//         break;
//       case "list":
//         sections.push({
//           type: "list",
//           listType: isNaN(parseInt(earliestMatch[1])) ? "unordered" : "ordered",
//           content: earliestMatch[2],
//         });
//         break;
//     }

//     // Update remainingText to continue parsing after the match
//     remainingText = remainingText.slice(
//       earliestMatch.index + earliestMatch[0].length
//     );
//   }

//   return sections;
// }
// 1-------------

function parseGPTResponse(response) {
  const lines = response.split("\n");
  const result = [];
  let currentItem = null;

  lines.forEach((line) => {
    line = line.trim();

    // Handle headers (e.g., ### Header)
    const headerMatch = line.match(/^(#+)\s+(.*)$/);
    if (headerMatch) {
      if (currentItem) {
        result.push(currentItem);
      }
      const level = headerMatch[1].length; // Number of '#' indicates header level
      currentItem = {
        type: "markdown-header",
        level: level,
        content: headerMatch[2],
      };
      result.push(currentItem);
      currentItem = null;
      return;
    }

    // Handle code blocks
    if (line.startsWith("```")) {
      if (currentItem && currentItem.type === "code") {
        // Close the code block
        result.push(currentItem);
        currentItem = null;
      } else {
        // Start a new code block
        const language = line.slice(3).trim() || "unknown";
        currentItem = {
          type: "code",
          language: language,
          content: "",
        };
      }
      return;
    }

    // If inside a code block, append content
    if (currentItem && currentItem.type === "code") {
      currentItem.content += line + "\n";
      return;
    }

    // Handle normal text
    if (line.length > 0) {
      if (currentItem && currentItem.type === "text") {
        currentItem.content += " " + line;
      } else {
        if (currentItem) {
          result.push(currentItem);
        }
        currentItem = {
          type: "text",
          content: line,
        };
      }
    } else if (currentItem) {
      result.push(currentItem);
      currentItem = null;
    }
  });

  if (currentItem) {
    result.push(currentItem);
  }

  return result;
}

function checkgpt(req, res) {
  const { prompt } = req.body;
  try {
    let messages = [
      {
        role: "system",
        content: "You are an expert in programming",
      },
      { role: "user", content: prompt },
    ];

    axios
      .post(
        "https://nexra.aryahcr.cc/api/chat/complements",
        {
          messages: messages,
          stream: false,
          markdown: false,
          model: "gpt-4o",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          let input = response.data;
          if (!isObject(input)) {
            input = JSON.parse(response.data.replace(/\x1E/g, ""));
          }
          console.log(input);

          let extracted = parseGPTResponse(input.message);

          return res.status(200).json({
            status: "Success",
            res: extracted,
            responseString: JSON.stringify(extracted, null, 2),
          });
        } else {
          console.log("Error");
          return res.status(500).json({ status: "error" });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } catch (error) {
    return res.status(500).json({ status: "error" });
  }
}

module.exports = {
  // parseResponse,
  extractAndFormatCode,
  separateTextAndCode,
  parseGPTResponse,
};

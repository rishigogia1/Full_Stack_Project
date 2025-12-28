import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_API_KEY);

export const evaluateAnswer = async (question: string, answer: string) => {
  let score = 0;
  let feedback = "";
  let strengths: string[] = [];
  let improvements: string[] = [];

  if (answer.length > 20) {
    score += 4;
    strengths.push("Answer has good length");
  } else {
    improvements.push("Answer is too short");
  }

  if (answer.toLowerCase().includes("example")) {
    score += 3;
    strengths.push("Includes example");
  } else {
    improvements.push("Try adding an example");
  }

  if (answer.split(" ").length > 30) {
    score += 3;
    strengths.push("Well explained");
  } else {
    improvements.push("Can be explained in more detail");
  }

  if (score > 10) score = 10;

  feedback =
    score >= 7
      ? "Good answer overall 👍"
      : "Needs improvement. Focus on clarity and examples.";

  return {
    score,
    feedback,
    strengths,
    improvements,
  };
};

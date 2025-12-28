import axios from "axios";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

export const generateQuestions = async (topic: string, questionCount: number = 5, category: string = 'technical', difficulty: string = 'intermediate') => {
  try {
    console.log("Generating AI questions for topic:", topic, "count:", questionCount, "category:", category, "difficulty:", difficulty);

    if (!OPENROUTER_API_KEY) {
      console.warn("OPENROUTER_API_KEY not found, falling back to mock questions");
      return generateMockQuestions(topic, questionCount);
    }

    const prompt = `Generate ${questionCount} interview questions about "${topic}" for a ${difficulty} level ${category} interview.

Requirements:
- Questions should be appropriate for ${difficulty} level candidates
- Focus on ${category} concepts and practical applications
- Each question should encourage detailed, thoughtful answers
- Include a mix of conceptual and practical questions
- Questions should be clear and professional

Format your response as a JSON array of objects, where each object has:
- "question": the interview question text
- "category": "${category}"
- "difficulty": "${difficulty}"

Example format:
[
  {
    "question": "Can you explain how you would design a scalable database schema for a social media platform?",
    "category": "technical",
    "difficulty": "intermediate"
  }
]

Generate exactly ${questionCount} questions:`;

    const response = await axios.post(`${OPENROUTER_BASE_URL}/chat/completions`, {
      model: "anthropic/claude-3-haiku:beta",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
        'X-Title': 'Interview Prep Platform'
      }
    });

    const content = response.data.choices[0].message.content;
    console.log("AI Response:", content);

    // Parse the JSON response
    let questions;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      } else {
        questions = JSON.parse(content);
      }
    } catch (parseErr) {
      console.error("Failed to parse AI response as JSON:", parseErr);
      console.log("Raw content:", content);
      return generateMockQuestions(topic, questionCount, category, difficulty);
    }

    // Validate and format questions
    if (!Array.isArray(questions) || questions.length === 0) {
      console.warn("AI returned invalid format, using fallback");
      return generateMockQuestions(topic, questionCount, category, difficulty);
    }

    const formattedQuestions = questions.slice(0, questionCount).map((q: any, index: number) => ({
      question: q.question || `Question ${index + 1} about ${topic}`,
      category: q.category || category,
      difficulty: q.difficulty || difficulty,
      answer: "" // Expected answer will be generated later if needed
    }));

    console.log("Generated", formattedQuestions.length, "AI questions");
    return formattedQuestions;

  } catch (err: any) {
    console.error("Error generating AI questions:", err.response?.data || err.message);

    // Fallback to mock questions
    console.log("Falling back to mock questions");
    return generateMockQuestions(topic, questionCount, category, difficulty);
  }
};

// Fallback function for mock questions
const generateMockQuestions = (topic: string, questionCount: number = 5, category: string = 'technical', difficulty: string = 'intermediate') => {
  console.log("Generating mock questions for topic:", topic);

  const questionTemplates = {
    technical: {
      beginner: [
        "Can you explain the basic concept of {topic}?",
        "What are the main components of {topic}?",
        "How would you get started with {topic}?",
        "What are some common use cases for {topic}?",
        "Can you describe a simple example of {topic} in action?"
      ],
      intermediate: [
        "How would you implement {topic} in a real-world scenario?",
        "What are the advantages and disadvantages of {topic}?",
        "Can you explain the architecture of {topic}?",
        "How does {topic} compare to similar technologies?",
        "What are some best practices when working with {topic}?"
      ],
      advanced: [
        "How would you optimize {topic} for high-performance scenarios?",
        "What are the security considerations when implementing {topic}?",
        "Can you discuss the scalability challenges of {topic}?",
        "How would you troubleshoot complex issues with {topic}?",
        "What are the latest developments and trends in {topic}?"
      ]
    },
    behavioral: {
      beginner: [
        "Can you tell me about a time when you learned something new?",
        "How do you handle working with a difficult team member?",
        "Describe your approach to problem-solving.",
        "How do you prioritize your tasks?",
        "What motivates you in your work?"
      ],
      intermediate: [
        "Can you describe a challenging project you worked on?",
        "How do you handle conflicting priorities?",
        "Tell me about a time you received critical feedback.",
        "How do you approach learning new technologies?",
        "Describe your experience working in a team environment."
      ],
      advanced: [
        "How have you handled leading a team through a major change?",
        "Can you discuss a time when you had to make a difficult decision?",
        "How do you mentor and develop junior team members?",
        "Describe your experience with cross-functional collaboration.",
        "How do you stay current with industry trends and technologies?"
      ]
    }
  };

  const templates = questionTemplates[category as keyof typeof questionTemplates]?.[difficulty as keyof typeof questionTemplates.technical] || questionTemplates.technical.intermediate;

  const questions = [];
  for (let i = 0; i < questionCount; i++) {
    const template = templates[i % templates.length];
    const question = template.replace('{topic}', topic);

    questions.push({
      question,
      category,
      difficulty,
      answer: ""
    });
  }

  return questions;
};

const OpenAI = require('openai');

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateSummary(text, filename, options = {}) {
    try {
      const {
        maxTokens = 1000,
        temperature = 0.3,
        model = "gpt-4o-mini"
      } = options;

      const prompt = `Please analyze the following document and provide:

1. A comprehensive summary (2-3 paragraphs)
2. Key points (5-7 bullet points)
3. Action items (3-5 specific actionable tasks)

Document: "${filename}"
Content: ${text.substring(0, 4000)}...

Please format your response as JSON with the following structure:
{
  "summary": "...",
  "keyPoints": ["...", "..."],
  "actionItems": ["...", "..."]
}`;

      const completion = await this.openai.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: "You are an expert document analyzer. Provide clear, concise summaries and actionable insights from business documents."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature
      });

      const response = completion.choices[0].message.content;
      
      try {
        return JSON.parse(response);
      } catch (parseError) {
        return {
          summary: response,
          keyPoints: ["Analysis completed - see summary for details"],
          actionItems: ["Review the generated summary", "Share with relevant team members"]
        };
      }
    } catch (error) {
      console.error('AI Summary generation error:', error);
      throw new Error('Failed to generate summary');
    }
  }

  async generateFAQs(documents, category = 'General', options = {}) {
    try {
      const {
        maxTokens = 1500,
        temperature = 0.3,
        model = "gpt-4o-mini"
      } = options;

      const combinedText = Array.isArray(documents) ? documents.join('\n\n') : documents;

      const prompt = `Based on the following documentation, generate 5-8 frequently asked questions and their comprehensive answers. Focus on common customer concerns and practical information.

Documentation:
${combinedText.substring(0, 3000)}

Please format your response as JSON with the following structure:
{
  "faqs": [
    {
      "question": "...",
      "answer": "...",
      "category": "${category}"
    }
  ]
}`;

      const completion = await this.openai.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: "You are a customer support expert. Generate helpful FAQs that address common customer questions based on the provided documentation."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature
      });

      const response = completion.choices[0].message.content;
      
      try {
        return JSON.parse(response);
      } catch (parseError) {
        return {
          faqs: [
            {
              question: "How can I get help with your product?",
              answer: "You can contact our support team through the chat widget or email us directly. We're here to help!",
              category: category
            }
          ]
        };
      }
    } catch (error) {
      console.error('AI FAQ generation error:', error);
      throw new Error('Failed to generate FAQs');
    }
  }

  async generateSalesEmail(emailType, customerData, options = {}) {
    try {
      const {
        maxTokens = 800,
        temperature = 0.7,
        model = "gpt-4o-mini"
      } = options;

      const {
        customerName,
        customerCompany,
        industry,
        painPoint,
        productInterest
      } = customerData;

      let prompt = '';
      
      switch (emailType) {
        case 'cold':
          prompt = `Write a professional cold email for B2B sales. Details:
- Customer: ${customerName} at ${customerCompany}
- Industry: ${industry || 'business'}
- Pain point: ${painPoint || 'operational efficiency'}
- Product interest: ${productInterest || 'AI automation tools'}

The email should:
1. Be personalized and relevant
2. Highlight specific benefits
3. Include social proof
4. Have a clear call-to-action
5. Be concise (under 200 words)

Format as JSON: {"subject": "...", "content": "..."}`;
          break;

        case 'follow-up':
          prompt = `Write a professional follow-up email. Details:
- Customer: ${customerName} at ${customerCompany}
- Industry: ${industry || 'business'}
- Previous discussion about: ${painPoint || 'business challenges'}
- Solution offered: ${productInterest || 'AI automation'}

The email should:
1. Reference previous conversation
2. Provide additional value
3. Include a case study or testimonial
4. Suggest next steps
5. Be respectful of their time

Format as JSON: {"subject": "...", "content": "..."}`;
          break;

        case 'proposal':
          prompt = `Write a professional proposal email. Details:
- Customer: ${customerName} at ${customerCompany}
- Industry: ${industry || 'business'}
- Challenge to solve: ${painPoint || 'operational efficiency'}
- Proposed solution: ${productInterest || 'AI automation platform'}

The email should:
1. Summarize their needs
2. Present a structured solution
3. Include timeline and phases
4. Mention expected outcomes
5. Include pricing framework

Format as JSON: {"subject": "...", "content": "..."}`;
          break;

        default:
          throw new Error('Invalid email type');
      }

      const completion = await this.openai.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: "You are an expert sales copywriter. Write compelling, professional B2B emails that convert prospects into customers."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature
      });

      const response = completion.choices[0].message.content;
      
      try {
        return JSON.parse(response);
      } catch (parseError) {
        return {
          subject: `Partnership Opportunity - ${customerCompany}`,
          content: response
        };
      }
    } catch (error) {
      console.error('AI Sales email generation error:', error);
      throw new Error('Failed to generate sales email');
    }
  }

  async generateSupportResponse(message, faqContext = '', options = {}) {
    try {
      const {
        maxTokens = 500,
        temperature = 0.7,
        model = "gpt-4o-mini"
      } = options;

      const prompt = `You are a helpful customer support assistant. Use the following FAQ knowledge base to answer customer questions. If the answer isn't in the knowledge base, provide a helpful general response and suggest contacting support.

Knowledge Base:
${faqContext}

Customer Question: ${message}

Please provide a helpful, professional response.`;

      const completion = await this.openai.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: "You are a professional customer support assistant. Be helpful, concise, and friendly."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('AI Support response generation error:', error);
      throw new Error('Failed to generate support response');
    }
  }
}

module.exports = new AIService();
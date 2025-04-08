import axios from "axios";
const baseUrl = "/api/chatbot/chat";

export const getChatbotResponse = async (query) => {
    try {
        const response = await axios.post(baseUrl, {
            query,
            systemPrompt: "You are a funny AI assistant named JOJO",
            modelSettings: {
                "model": "llama-3.3-70b-versatile",
                "provider": "Groq",
                "allowSearch": false,
                "ttsEnabled": true,
                "voice": "en-SG-female-1"
            }
        });
        console.log(
            "Chatbot response received:",
            response
        )
        return response.data;
    } catch (error) {
        console.error("Error fetching chatbot response:", error);
        throw error.response.data.error;
    }
}
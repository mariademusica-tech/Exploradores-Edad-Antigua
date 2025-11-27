import { GoogleGenAI, Type } from "@google/genai";
import { MissionContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMissionContent = async (topic: string, ageGroup: string = "9-11 años"): Promise<MissionContent> => {
  const model = "gemini-2.5-flash";
  
  const systemInstruction = `Eres Aristóteles, un robot guía educativo experto en historia para niños de ${ageGroup}. 
  Tu tono es motivador pero riguroso.
  
  OBJETIVO: Crear un cuestionario de 5 preguntas para evaluar el conocimiento sobre "${topic}".
  
  REGLAS ESTRICTAS DE CONTENIDO:
  1. Si el tema trata sobre civilizaciones, limítate EXCLUSIVAMENTE a: Mesopotamia, Egipto, Grecia y Roma. No incluyas otras culturas (como China o India) a menos que se pida explícitamente.
  2. Genera exactamente 5 preguntas.
  3. Las preguntas NO deben ser obvias. Deben requerir pensar.
  4. Los distractores (respuestas incorrectas) deben ser PLAUSIBLES históricamente.
  
  REGLAS DE ALEATORIEDAD (MUY IMPORTANTE):
  1. La respuesta correcta NO puede ser siempre la opción B (índice 1).
  2. Debes distribuir la respuesta correcta aleatoriamente entre el índice 0, 1 y 2.
  3. Ejemplo de distribución deseada en 5 preguntas: [0, 2, 1, 0, 2] o [1, 0, 2, 1, 0].
  
  Devuelve SOLO JSON.`;

  const prompt = `
    Genera contenido para la misión: "${topic}".
    
    Estructura requerida:
    1. Un título de introducción y un texto explicativo general (máx 60 palabras).
    2. Un dato curioso ("Sabías que...").
    3. 5 Preguntas de opción múltiple.
    4. Para cada pregunta, incluye una breve explicación de 1 frase que aclare la respuesta correcta.
    5. Asegúrate de que el 'correctAnswerIndex' sea variado (0, 1, o 2) entre las preguntas.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            introTitle: { type: Type.STRING, description: "Título corto del tema" },
            introText: { type: Type.STRING, description: "Explicación general del tema" },
            funFact: { type: Type.STRING, description: "Dato curioso" },
            questions: {
              type: Type.ARRAY,
              description: "Lista de 5 preguntas",
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING, description: "La pregunta" },
                  options: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: "3 opciones de respuesta (1 correcta, 2 plausibles)" 
                  },
                  correctAnswerIndex: { type: Type.INTEGER, description: "Índice de la respuesta correcta (0, 1, o 2). ALEATORIZAR ESTE VALOR." },
                  explanation: { type: Type.STRING, description: "Breve explicación educativa de la respuesta correcta" }
                },
                required: ["text", "options", "correctAnswerIndex", "explanation"]
              }
            }
          },
          required: ["introTitle", "introText", "funFact", "questions"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text from Gemini");
    
    return JSON.parse(text) as MissionContent;

  } catch (error) {
    console.error("Error generating mission content:", error);
    // Fallback data para que la app no se rompa si falla la API
    return {
      introTitle: "La Edad Antigua",
      introText: "La Edad Antigua comienza con la invención de la escritura y termina con la caída del Imperio Romano. Fue una época de grandes imperios.",
      funFact: "Los egipcios inventaron el calendario de 365 días.",
      questions: [
        {
          text: "¿Qué evento marca el inicio de la Edad Antigua?",
          options: ["La caída de Roma", "La invención de la escritura", "El descubrimiento del fuego"],
          correctAnswerIndex: 1, 
          explanation: "La escritura permitió registrar la historia, separándola de la prehistoria."
        },
        {
          text: "¿Qué civilización se desarrolló entre los ríos Tigris y Éufrates?",
          options: ["Egipto", "Grecia", "Mesopotamia"],
          correctAnswerIndex: 2, 
          explanation: "Mesopotamia significa 'tierra entre ríos' en griego."
        },
        {
          text: "¿Cuál era la función principal de las pirámides de Egipto?",
          options: ["Eran tumbas para los faraones", "Eran palacios para vivir", "Eran templos para rezar"],
          correctAnswerIndex: 0, 
          explanation: "Servían para proteger el cuerpo del faraón y sus tesoros para la otra vida."
        },
        {
          text: "¿Qué sistema político nació en Atenas, Grecia?",
          options: ["La Democracia", "El Imperio", "La Teocracia"],
          correctAnswerIndex: 0, 
          explanation: "En Atenas los ciudadanos podían votar, dando origen a la democracia."
        },
        {
          text: "¿Qué idioma hablaban los antiguos romanos?",
          options: ["Romano", "Griego", "Latín"],
          correctAnswerIndex: 2, 
          explanation: "El latín es la lengua madre de idiomas como el español, francés e italiano."
        }
      ]
    };
  }
};

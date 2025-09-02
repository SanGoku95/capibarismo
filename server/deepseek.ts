const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(express.json());

app.post('/api/deepseek', async (req, res) => {
    const { prompt } = req.body;
    const apiKey = process.env.AI_GATEWAY_API_KEY;
    const gatewayUrl = 'https://ai-gateway.vercel.com/api/chat/completions';

    const payload = {
        model: "deepseek/deepseek-v3.1",
        messages: [
            {
                role: "system",
                content: "Eres un asistente experto en política, especializado en el análisis de noticias y en la identificación de sentimientos y posibles impactos en el Perú."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        stream: false
    };

    try {
        const response = await fetch(gatewayUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gateway error:', errorText);
            return res.status(500).json({ answer: 'Error al consultar DeepSeek.' });
        }

        const data = await response.json();
        const answer = data.choices?.[0]?.message?.content || 'Sin respuesta.';
        res.status(200).json({ answer });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ answer: 'Error interno del servidor.' });
    }
});

app.listen(3001, () => {
    console.log('API server running on http://localhost:3001');
});
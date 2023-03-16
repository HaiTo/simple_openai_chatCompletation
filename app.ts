import express, { Request, Response } from 'express';
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();
app.use(express.json());

const basicAuth = (req: Request) => {
    const authHeader = req.header('Authorization') || '';
    const [type, credentials] = authHeader.split(' ');

    if (type === 'Basic') {
        const encodedCredentials = Buffer.from(credentials, 'base64').toString();
        const [username, password] = encodedCredentials.split(':');
        if (
            username === process.env.AUTH_USERNAME &&
            password === process.env.AUTH_PASSWORD
        ) {
            return true;
        }
    }
    return false;
};

app.post('/complete', async (req: Request, res: Response) => {
    if (!basicAuth(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { message } = req.body;

    console.log(`message: ${message}`);

    try {
        const resp = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message }],
        });

        console.log(resp.data);

        const completion = resp.data.choices[0]?.message?.content;
        res.json({ completion });

    } catch (error) {
        // @ts-ignore
        console.error(error.response.data);

        res.status(500).json({ error: 'Error calling OpenAI API' });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

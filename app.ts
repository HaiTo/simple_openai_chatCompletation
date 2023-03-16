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

    try {
        const resp = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: message,
        });

        const completion = resp.data.choices[0].text;
        res.json({ completion });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error calling OpenAI API' });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

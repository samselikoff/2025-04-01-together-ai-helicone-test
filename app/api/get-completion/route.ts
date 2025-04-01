import { HeliconeManualLogger } from '@helicone/helpers';
import { after } from 'next/server';
import Together from 'together-ai';

const together = new Together();

const helicone = new HeliconeManualLogger({
  apiKey: process.env.HELICONE_API_KEY!,
  loggingEndpoint: 'https://api.worker.helicone.ai/oai/v1/log',
  headers: {
    'Helicone-Property-appname': 'logbuilder-test',
    'Helicone-Property-environment':
      process.env.VERCEL_ENV === 'production' ? 'prod' : 'dev',
  },
});

export async function POST(request: Request) {
  const { question } = await request.json();

  const completionData = {
    model: 'deepseek-ai/DeepSeek-R1',
    messages: [{ role: 'user', content: question }],
    stream: true,
  };

  const heliconeLogBuilder = helicone.logBuilder(completionData);

  const res = await together.chat.completions.create({
    model: 'deepseek-ai/DeepSeek-R1',
    messages: [{ role: 'user', content: question }],
    stream: true,
  });

  after(async () => {
    await heliconeLogBuilder.sendLog();
  });

  return new Response(res.toReadableStream());
}

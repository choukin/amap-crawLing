const { OpenAIClient, AzureKeyCredential } = require('@azure/openai');
const endpoint = 'https://ld01.openai.azure.com'; //process.env['AZURE_OPENAI_ENDPOINT'];
const azureApiKey = 'df8337f7dfce4f2481e561e178355e76'; //process.env['AZURE_OPENAI_KEY'];

const messages = [
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: 'Does Azure OpenAI support customer managed keys?' },
  {
    role: 'assistant',
    content: 'Yes, customer managed keys are supported by Azure OpenAI',
  },
  { role: 'user', content: 'msiai 的 api version 有什么用' },
];

async function main() {
  console.log('== Chat Completions Sample ==');

  const client = new OpenAIClient(
    endpoint,
    new AzureKeyCredential(azureApiKey),
  );
  const deploymentId = 'gpt-35-turbo';
  const result = await client.getChatCompletions(deploymentId, messages);

  for (const choice of result.choices) {
    console.log(`🚀 ~ main ~ choice:`);

    console.log(choice.message);
  }
}

main().catch((err) => {
  console.error('The sample encountered an error:', err);
});

module.exports = { main };

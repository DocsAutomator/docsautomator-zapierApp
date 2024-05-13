const zapier = require('zapier-platform-core');

// Use this to make test calls into your app:
const App = require('../../index');
const appTester = zapier.createAppTester(App);
// read the `.env` file into the environment, if available
zapier.tools.env.inject();

describe('creates.create_document', () => {
  it('should run', async () => {
    const bundle = {
      inputData: {
        docId: process.env.DOCID,
        documentName: 'test',
        client_name: 'test',
      },
    };

    const results = await appTester(
      App.creates['create_document'].operation.perform,
      bundle
    );

    expect(results.message).toBe('success');
    expect(results.pdfUrl).toBeTruthy();
  });
});

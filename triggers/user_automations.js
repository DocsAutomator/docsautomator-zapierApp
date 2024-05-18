const perform = (z, bundle) => {
  // Retrieve API key from bundle or environment
  const apiKey = bundle.authData.api_key || process.env.API_KEY;

  return z
    .request({
      url: 'https://api.docsautomator.co/zapierAutomations',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
    .then((response) => {
      return z.JSON.parse(response.content); // Parsing the JSON response to return an array of items.
    });
};

module.exports = {
  operation: {
    perform,
    type: 'polling',
    canPaginate: true,
    sample: {
      id: '64bbc8eec756ddddcd4e73fc',
      title: 'Invoices 2024',
      dataSourceName: 'Airtable',
    },
    outputFields: [
      { key: 'id', label: 'ID', type: 'string' },
      { key: 'title', label: 'Title', type: 'string' },
    ],
  },
  display: {
    description:
      'Fetches all available user automations that have a data source that is suitable for use in the "Create Document" action.',
    hidden: true,
    label: 'Automations',
  },
  key: 'user_automations',
  noun: 'Automation',
};

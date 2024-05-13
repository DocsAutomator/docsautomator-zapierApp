module.exports = {
  type: 'custom',
  test: {
    headers: {
      Authorization: 'Bearer {{bundle.authData.api_key}}',
    },
    method: 'POST',
    url: 'https://api.docsautomator.co/zapierAuthTest',
  },
  fields: [
    {
      computed: false,
      key: 'api_key',
      required: true,
      label: 'API Key',
      type: 'password',
      helpText:
        'You find your API key on the [settings page](https://app.docsautomator.co/settings) in your DocsAutomator account.',
    },
  ],
  customConfig: {},
  connectionLabel: '{{name}} - {{email}}',
};

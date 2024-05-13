const primaryFields = async (z, bundle) => {
  const options = {
    url: 'https://api.docsautomator.co/zapierListPlaceholders',
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    params: {
      docId: bundle.inputData.docId,
    },
  };

  const response = await z.request(options);

  const results = response.data;

  const fields = results
    .filter((placeholder) => !placeholder.includes('line_items_'))
    .map((placeholder) => ({
      key: placeholder,
      label: `{{${placeholder}}}`,
      type: 'string',
      required: false,
      helpText: `Enter the value for ${placeholder}`,
    }));

  return fields;
};

const lineItemFields = async (z, bundle) => {
  const options = {
    url: 'https://api.docsautomator.co/zapierListPlaceholders',
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    params: {
      docId: bundle.inputData.docId,
    },
  };

  const response = await z.request(options);

  const results = response.data;

  const lineItemGroups = results.filter((placeholder) =>
    placeholder.startsWith('line_items_')
  );

  // Group by the number following 'line_items_' (assuming a consistent naming pattern)
  const groupMap = new Map();
  lineItemGroups.forEach((placeholder) => {
    const match = placeholder.match(/line_items_(\d+)/);
    const groupKey = match ? `line_items_${match[1]}` : 'line_items';
    if (!groupMap.has(groupKey)) {
      groupMap.set(groupKey, []);
    }
    groupMap.get(groupKey).push({
      key: placeholder,
      label: `{{${placeholder}}}`,
      type: 'string',
      required: false,
      helpText: `Enter the value for ${placeholder}`,
    });
  });

  // Convert the map to an array of grouped field objects
  return Array.from(groupMap).map(([key, children]) => ({
    key,
    children,
  }));
};

const perform = async (z, bundle) => {
  const apiKey = bundle.authData.api_key || process.env.API_KEY; // Use API key from bundle or fallback to environment variable

  const options = {
    url: 'https://api.docsautomator.co/createDocument',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`, // Include the API key in the Authorization header
    },
    body: bundle.inputData,
  };

  return z.request(options).then((response) => {
    const results = response.json;
    return results;
  });
};

module.exports = {
  display: {
    description: 'Create a document from a template.',
    hidden: false,
    label: 'Create Document',
  },
  key: 'create_document',
  noun: 'document',
  operation: {
    inputFields: [
      {
        key: 'docId',
        label: 'Automation',
        type: 'string',
        dynamic: 'user_automations.id.title',
        helpText:
          'Please select your automation. Note that only automations with data source "API" will be shown here.',
        required: true,
        list: false,
        altersDynamicFields: true,
      },
      {
        key: 'documentName',
        label: 'Document Name',
        type: 'string',
        helpText:
          'Please define a name for generated documents. Of course you can select data from previous steps.',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      primaryFields,
      lineItemFields,
    ],
    perform: perform,
    sample: {
      docId: '64bbc8eec756ddddcd4e73fc',
      documentName: 'Invoices 2024',
      key1: 'value1',
      key2: 'value2',
      line_items: [
        {
          line_items_key1: 'line_items_value1',
          line_items_key2: 'line_items_value2',
        },
        {
          line_items_key1: 'line_items_value3',
          line_items_key2: 'line_items_value4',
        },
      ],
    },
  },
};

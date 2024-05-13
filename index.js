const authentication = require('./authentication');
const userAutomationsTrigger = require('./triggers/user_automations.js');
const createDocumentCreate = require('./creates/create_document.js');
const zapier = require('zapier-platform-core');
zapier.tools.env.inject();

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: authentication,
  requestTemplate: {
    params: {},
    headers: { Authorization: 'Bearer {{bundle.authData.api_key}}' },
  },
  creates: { [createDocumentCreate.key]: createDocumentCreate },
  searches: {},
  triggers: { [userAutomationsTrigger.key]: userAutomationsTrigger },
};

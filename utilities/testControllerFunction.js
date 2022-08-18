const sinon = require('sinon');

const DEFAULT_REQUEST = {
  body: undefined,
  params: {},
  headers: {},
};

const testControllerFunction = async (callback, request = DEFAULT_REQUEST) => {
  const result = {
    json: undefined,
    status: undefined,
  };

  const response = {
    json: (objectResult) => {
      result.json = objectResult;
      return null;
    },
    status: (code) => {
      result.status = code;
      return response;
    },
  };

  const jsonSpy = sinon.spy(response, 'json');
  const statusSpy = sinon.spy(response, 'status');

  await callback(request, response);
  return { ...result, spies: { json: jsonSpy, status: statusSpy } };
};

module.exports = testControllerFunction;

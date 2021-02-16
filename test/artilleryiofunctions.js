const { v4: uuidv4 } = require("uuid");

module.exports = { setupData };

function setupData(userContext, events, done) {
  const packages = [];
  // Create package uuids which in the real world would be generated somewhere else
  for (var i = 0; i < 100; i++) {
    packages.push(uuidv4());
  }

  userContext.vars.packages = { packages: packages };
  return done();
}

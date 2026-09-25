const cds = require('@sap/cds');

module.exports = cds.service.impl(function () {

  if (this.name === 'FilteredUserMappingService') {
    this.before(['CREATE', 'UPDATE', 'DELETE'], 'UserMapping', req => {
      req.reject(405, 'This service is read-only.');
    });
  }

});
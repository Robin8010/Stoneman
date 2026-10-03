const cds = require('@sap/cds');

module.exports = cds.service.impl(function () {

    // FilteredUserMappingService
    if (this.name === 'FilteredUserMappingService') {

        this.before(
            ['CREATE', 'UPDATE', 'DELETE'],
            'UserMapping',
            req => {
                req.reject(405, 'This service is read-only.');
            }
        );
    }


    // GMCHeader
    this.before(['CREATE', 'UPDATE'], 'GMCHeader', async req => {

        const creater = req.data.Creater;

        // Creator must not be blank
        if (
            creater === undefined ||
            creater === null ||
            String(creater).trim() === ''
        ) {
            req.reject(400, 'Creater cannot be blank.');
            return;
        }

        // Remove leading/trailing spaces
        req.data.Creater = String(creater).trim();
    });

});
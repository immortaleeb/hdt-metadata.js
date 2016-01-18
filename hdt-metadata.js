'use strict';

const hdt = require('hdt'),
      HdtDocumentWithMetadata = require('./lib/HdtDocumentWithMetadata');

module.exports = {
  fromFile(documentPath, metadataPath, callback) {
    if (!callback) {
      callback = metadataPath;
      metadataPath = documentPath + '.metadata';
    }

    // Try to load the document
    hdt.fromFile(documentPath, (error, document) => {
      if (error) return callback(error);
      
      // Try to load the metadata document
      hdt.fromFile(metadataPath, (error, metadataDocument) => {
        if (error) return callback(error);

        callback(error, new HdtDocumentWithMetadata(document, metadataDocument));
      });
    });
  }
};

'use strict';

const hdt = require('hdt'),
      HdtDocumentWithMetadata = require('./lib/HdtDocumentWithMetadata');

module.exports = {
  fromFile(documentPath, metadataPath, callback, self) {
    if (typeof metadataPath === 'function') {
      self = callback;
      callback = metadataPath;
      metadataPath = documentPath + '.metadata';
    }

    // Try to load the document
    hdt.fromFile(documentPath, (error, document) => {
      if (error) return callback.call(self, error);
      
      // Try to load the metadata document
      hdt.fromFile(metadataPath, (error, metadataDocument) => {
        if (error) return callback.call(self, error);
        callback.call(self, error, new HdtDocumentWithMetadata(document, metadataDocument));
      });
    });
  }
};

'use strict';

/**
 * An wrapper around an hdt document that can return extra metadata when searching triples.
 * It fetches this metadata from another hdt document which contains the metadata for the wrapped document.
 */
class HdtDocumentWithMetadata {
  constructor(document, metadataDocument) {
    this._document = document;
    this._metadataDocument = metadataDocument;
  }

  // Translates the predicate in a metadata file to a proper name
  _metadataPredicateToName(predicate) {
    let split = predicate.split('#');
    return split[1];
  }

  // Returns triples and metadata in the callback
  searchTriples(subject, predicate, object, options, callback) {
    console.log('searchTriples', subject, predicate, object, options, callback);
    if (!callback) {
      callback = options;
      options = {};
    }

    this._document.searchTriples(subject, predicate, object, options, (error, triples, totalCount) => {
      if (error) return callback(error);
      if (triples.length == 0) return callback(error, triples, { totalCount });

      // Will hold all fetched metadata
      let metadata = { totalCount };

      // Fetch the metadata for the predicate if one was given
      if (predicate) {
        this._metadataDocument.searchTriples(predicate, null, null, (error, metadataTriples) => {
          if (error) return callback(error);
          
          // Add metadata to the metadata object
          metadataTriples.forEach(metaTriple => {
            metadata[this._metadataPredicateToName(metaTriple.predicate)] = metaTriple.object;
          });

          // Return the results
          callback(error, triples, metadata);
        });
      } else {
        callback(error, triples, metadata);
      }
    });
  }

  // closes the document and metadata document
  close() {
    this._document.close();
    this._metadataDocument.close();
  }
}

// Add aliases for deprecated method names
HdtDocumentWithMetadata.prototype.search = HdtDocumentWithMetadata.prototype.searchTriples;

module.exports = HdtDocumentWithMetadata;

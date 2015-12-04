(function() {
  'use strict';

  var mongoose  = require('mongoose'),
      Schema    = mongoose.Schema;

  var BroadcastSchema = new mongoose.Schema({
    uniqueAddressToken  : String,
    data                : {}
  });

  module.exports = mongoose.model('Broadcast', BroadcastSchema);
}());

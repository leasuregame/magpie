// Generated by CoffeeScript 1.6.3
var Manager, playerEvent;

playerEvent = require('./playerEvent');

Manager = module.exports;

Manager.addEventToPlayer = function(player) {
  return playerEvent.addEvents(player);
};

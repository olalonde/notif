var notif = require('../');

var oli = {
    username: 'olalonde'
  },
  bobby = {
    username: 'bobby'
  };

notif.register(function (n, cb) {
  console.log(n.actor.username + ' ' + n.verb + ' ' + ((n.object && n.object.username) ? n.object.username : ''));
  console.log('save notif to db...');
  cb();
});

notif.register({ only: ['registered', 'deleted account'] }, function (n, cb) {
  console.log('Send an email because ' + n.actor.username + ' ' + n.verb);
});

notif.register({ except: ['deleted account'] }, function (n, cb) {
  console.log(n.verb + ' === good news!');
});

notif.send(bobby, 'registered');
notif.send(bobby, 'followed', oli);
notif.send(bobby, 'deleted account');

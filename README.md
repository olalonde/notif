# Usage

```javascript
notif.send(actor, verb, object);
```

Example:

```javascript
notif.send({ username: 'olalonde' }, 'followed', { username: 'bobby' });
```

Every notification is internally represented by an object containing the following
properties:

`notification`:

- `time` : {Object} Date() object that is automatically assigned when notification is created.
- `actor` : {Object} A generic object that identifies the user or entity that performed the activity.
- `verb` : {String} A verb that identifies the action of the activity.
- `object` : (optional) {Object} The primary object of the activity.

Note: This library follows the [Atom Activity Streams nomenclature](http://activitystrea.ms/specs/atom/1.0/).

# Registering verb handlers

```javascript
notif.registerVerb('followed', function (notification) {
  // we assume that the notification object looks like this 
  // after bob followed oli:
  //
  // {
  //   actor: bob
  //   verb: 'followed'
  //   object: oli
  // }

  // let's notify oli that he just got followed
  // and an activity to bob's activity stream 
  // but not in his notification center

  var activity = new Activity();

  // specify on whose stream we want the notification to show up
  activity._user = notification.object._id;
  activity._actor = notification.actor._id;
  activity._object = notification.object._id;
  activity.createdAt = notification.time; 
  // for example: private, public, notification center
  activity.setPrivacyLevel('followers');  
  //activity.markRead(); 
  activity.save(function (err) {
    if (err) console.error(err);
  });
});

notify.registerVerb('logged in', function (notification) {

});

notify.registerVerb({ except: ['ignored user'] }, function (notification) {
  // save to database
});

notify.registerVerb({ only: ['registered'] }, function (notification) {
  // send email...
});

notify.registerAllVerbs(function (notification) {
  console.log(notification.toString());
  //console.log(notification.actor + ' ' + notification.verb + ' ' + notifications.object);
});
```

# References

http://nodejs.org/api/events.html

https://github.com/flatiron/winston

https://github.com/brantyoung/django-notifications

https://github.com/jtauber/django-notification/blob/master/docs/usage.txt

http://activitystrea.ms/

http://stackoverflow.com/questions/5616614/how-would-you-create-a-notification-system-like-on-so-or-facebook-in-ror


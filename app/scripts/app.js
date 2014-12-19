(function(window, $, undefined) {
  'use strict';

  console.log('Hello, workshop tutorial!');

  
  var appContext = $('[data-app-name="workshop-tutorial"]');

  //STEP 3: Uncomment the following code down to "STEP 3: FINISHED uncommenting here"
  // jshint unused: false
  // jshint camelcase: false
  // Wait for Agave to Bootstrap before executing our code.
  window.addEventListener('Agave::ready', function() {
    var Agave = window.Agave;  
    var successFunction = function(response) { 
    
      if(response.obj.status !== 'success') { 
        console.log('There was a problem: ' + 
          response.obj.message);
      } else { 
        var profile = response.obj.result;
        console.log(JSON.stringify(profile, null, 2));
        $('.profile-name', appContext).text(profile.username);
        
          var vcard = $('.vcard', appContext);
          vcard.find('.fn').text(profile.full_name);
          vcard.find('.email').text(profile.email);
          vcard.find('.tel-primary').text(profile.phone || 'not specified');
          vcard.find('.tel-secondary').text(profile.mobile_phone || 'not specified');

          // do some date parsing
          var parsedDate = profile.create_time.replace(
            /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
            '$1-$2-$3T$4:$5:$6'
          );
          vcard.find('.note').text(new Date(parsedDate).toLocaleString());

          vcard.removeClass('hide');        
        
      } 
    };
    var failFunction = function(err) {
      //do failure stuff!
      console.log('Failure! ', err);
    };

    Agave.api.profiles.me(
	  null, //no input needed here
	  successFunction,
	  failFunction
    );
  });
  //STEP 3: FINISHED uncommenting here
  

})(window, jQuery);

(function() {
  'use strict';

  var messageVal  = $("#message").val();
  var sendBtn     = $("#send");
  var querystring = window.location.search;
  querystring = querystring.substring(1).split('=')[1];

  /*initial state*/
  if (querystring) {
    $('#start-conferencing').hide();
  }

  sendBtn.on('click', function() {
    messageVal = $("#message").val();
    var userName = null;
    console.log(querystring);
    if (querystring) {
      var name     = $("#name");
      console.log(name.val());
      if (name.val() !== '') {
        userName = name.val();
        console.log(userName);
      } else {
        return;
      }
    } else {
      console.log(broadcasterName);
      userName = broadcasterName;
    }

    var user = 'you';
    global_socket.emit('chatMessage', {message : messageVal, uniqueAddressToken: uniqueAddressToken, user: user, name: userName});
    htmlBuilder({message : messageVal, uniqueAddressToken: uniqueAddressToken, user: user, name: userName});
  })

  global_socket.on('chatMessage', function(data) {
    console.log(data);
    htmlBuilder(data);
  });

  function htmlBuilder(data) {
    var element = $('.chat-box');
    var top = element.prop('scrollHeight');
    var html;
    if (data.user === 'you') {
      html   = '<li class="me">';
      html  +=    '<div class="avatar-icon">';
      html  +=    '</div>';
      html  +=    '<div class="messages">';
      html  +=      '<p><strong>' + data.name + '</strong></p>';
      html  +=      '<p>' + data.message + '</p>';
      html  +=    '</div>';
      html  += '</li>';
    } else {
      html   = '<li class="another">';
      html  +=    '<div class="avatar-icon">';
      html  +=    '</div>';
      html  +=    '<div class="messages">';
      html  +=      '<p><strong>' + data.name + '</strong></p>';
      html  +=      '<p>' + data.message + '</p>';
      html  +=    '</div>';
      html  +=  '</div>';
    }

    element.html(element.html() + html);
    element.scrollTop(top);
    $("#message").val('');
    $("#message").focus();
  }
}());

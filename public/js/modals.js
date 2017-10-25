function signin() {
  var email = $('#login-user').val(),
      password = $('#login-password').val();

  $.ajax({
    url: '/signin',
    method: 'POST',
    data: {email: email, password: password}
  }).success(function(response) {
    $(location).attr('href', '/store_info');
  }).error(function(error) {
    var jsonError = JSON.parse(error.responseText);
    $('#messageLogin').text(jsonError.error);
    $('#messageLogin-container').attr("style", "display: inline-grid;");
    setTimeout(function() {
      $('#messageLogin-container').attr("style", "display: none");
    }, 5000);
  });
}

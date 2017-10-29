$(function() {
  // Aquí añadiremos nuestro código
  $.ajax({
    method: 'GET',
    url: '/store_info/currentCharges',
    dataType: 'html',
    success: function(data){
        //$('#users_list').html(data);
        console.log(data);
     },
     error : function(xhr, status) {
        console.log('Ha ocurrido un error: lo sentimos (:');
    }
  });
  timer = setInterval("recargar()", 2000);
});

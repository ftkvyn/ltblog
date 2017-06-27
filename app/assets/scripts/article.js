$(function() {
	var id = $('#art-id').val();
	$.get('/relates/' + id, function(data){
		$('#relates').html(data);
	});
})
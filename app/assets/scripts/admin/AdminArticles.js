$("body").on("submit",".hidePublish", function() {
	var thisForm = $(this);
	var isPublish = $(this).is('.publish-form');
	var id = (thisForm).children('[name=id]').val();
	var formData = {
		id: id,
	};
	if (!id) {
		alert('code error (can not find article id), send this message to admin');
		return false;
	}
	else{
		var link = '/api/articles/hide'; 
		if (isPublish) {
			link = '/api/articles/publish'; 
		}
		var posting = $.post(link, formData)
		posting.fail(function (data){
			alert(data.message);
			alert('fail');
		});
		posting.done(function(data) {
			(thisForm).parent('.editbox').children('.publish-form', '.hidePublish').toggle();
			(thisForm).parent('.editbox').children('.hide-form', '.hidePublish').toggle(); 
		});
	}
	return false;
});

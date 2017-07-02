function FilledFields( formData ) {
	var filled = false;
	if (formData.name !== '' &&
		formData.profilePicSmall !== '' &&
		formData.profilePicLarge !== '' &&
		formData.login !== '' &&
		formData.url !== '' &&
		formData.password !== '') {
		filled = true;
	}
	return filled;
}

$("h3").click(function(){
	$(".new-user-form").toggle();
});
$(".new-user-form").submit(function() {
	var formData = {
		name: $("#name").val(),
		profilePicSmall: $("#profilePicSmall").val(),
		profilePicLarge: $("#profilePicLarge").val(),
		login: $("#login").val(),
		password: $("#password").val(),
		url: $("#url").val(),
		isAdmin: $("#isAdmin").prop("checked")
	};
	if (!FilledFields( formData )) {
		alert('filled all fields');
	}
	else {
		var posting = $.post("/admin/addUser", formData)
		posting.fail(function (data){
			alert(data.message);
		});
		posting.done(function(data) {
			if (!data.success) {
				alert(data.message);
			}
			location.reload();
		});
	}
	return false;
});
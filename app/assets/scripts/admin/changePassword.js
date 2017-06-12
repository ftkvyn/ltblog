function FilledFields( passwordData ) {
	var filled = false;
	if (passwordData.currentPassword !== '' &&
		passwordData.newPassword !== '') {
		filled = true;
	}
	return filled;
}

$(".change-password-form").submit(function() {
	var passwordData = {
		currentPassword: $("#currentPassword").val(),
		newPassword: $("#newPassword").val(),
	};
	if (!FilledFields( passwordData )) {
		alert('filled all fields');
	}
	else {
		var posting = $.post("/api/changePasswords", passwordData)
		posting.fail(function (data){
			alert(data.message);
		});
		posting.done(function(data) {
			if (!data.success) {
				alert(data.message);
			}
			else if (data.success) {
				location.reload();
				alert('Password successfully changed!');
			}
		});
	}
	return false;
});
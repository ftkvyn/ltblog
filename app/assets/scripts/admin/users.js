function FilledFields( formData ) {
	var filled = false;
	if (formData.name !== '' &&
		formData.profilePicSmall !== '' &&
		formData.profilePicLarge !== '' &&
		formData.login !== '' &&
		formData.url !== '' &&	
		( ($("input").is("#EditUserId")) || formData.password !== '')) {
		filled = true;
	}
	return filled;
}

$("h3").click(function(){
	$(".new-user-form").toggle();
});

$(".new-user-form").submit(function() {
	var id;
	var password;
	if(($("input").is("#EditUserId"))) {
		id = $("#EditUserId").val();
	} else {
		password = $("#password").val();
	}
	var formData = {
		name: $("#name").val(),
		profilePicSmall: $("#profilePicSmall").val(),
		profilePicLarge: $("#profilePicLarge").val(),
		login: $("#login").val(),
		
		url: $("#url").val(),
		about: $("#about").val(),
		isAdmin: $("#isAdmin").prop("checked"),
		id: id,
		password: password
	};
	
	if (!FilledFields( formData )) {
		alert('filled all fields');
	}
	else if(($("input").is("#EditUserId"))){
		var posting = $.post("/api/saveUser", formData)
		posting.fail(function (data){
			alert(data.message);
		});
		posting.done(function(data) {
			if (!data.success) {
				alert(data.message);
			}
			location.reload();
			alert("user's data successfully changed");
		});
	}else{
		var posting = $.post("/api/addUser", formData)
		posting.fail(function (data){
			alert(data.message);
		});
		posting.done(function(data) {
			if (!data.success) {
				alert(data.message);
			}else{
				location.reload();
			};
		});
	}
	return false;
});


$(".edit-user-form").submit(function() {
	var userData = {
		id: $(this).children("#id").val(),
	}; 

	var get = $.get("/api/getUserData/" + userData.id)
	get.fail(function (data){
		alert(data.message);
	});
	get.done(function(data) {
		if (!data.success) {
			alert(data.message);
		}
		$(".new-user-form").css("display", "block");
		$("h3").text("Edit user:" + " " + data.editUser.login);
		$("#password").css("display", "none");
		$('[for=password]').css("display", "none");
		$('.new-user-form').prepend('<input type="hidden" id="EditUserId" value="">'); 
		$("#EditUserId").attr("value", data.editUser.id); 
		if (data.editUser.isAdmin) {
			$("#isAdmin").attr("checked", "checked");
		}
		for(var key in data.editUser){
			$('#' + key).val(data.editUser[key]);
		}
		$('.new-user-form').append('<button type="button" id="reset" class="btn btn-danger">Reset</button>');
		$('.edit-user-form').css("display", "none");
		$('.delete-user-form').css("display", "none");
	});
	return false;
});

$(document).on('click', '#reset', function() {
   location.reload();
});


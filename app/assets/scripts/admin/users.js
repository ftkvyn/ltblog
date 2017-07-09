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
if (false) { /* тонки, это заглушка, чтобы edit норм работал, я не знаю, какое 
надо сюда условие, чтобы при edit было false, при create- true */

/*конечно есть идея спрятать обычнуб кнопку, при edit добавить 
другую и повесить обработку формы на клик по кнопке, но я даже хз */
	$(".new-user-form").submit(function() {
		var formData = {
			name: $("#name").val(),
			profilePicSmall: $("#profilePicSmall").val(),
			profilePicLarge: $("#profilePicLarge").val(),
			login: $("#login").val(),
			password: $("#password").val(),
			url: $("#url").val(),
			about: $("#about").val(),
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
				}else{
					location.reload();
				};
			});
		}
		return false;
	});
};

$(".edit-user-form").submit(function() {
	var userData = {
		id: $(this).children("#id").val(),
	}; 

	var get = $.get("/admin/editUser/" + userData.id)
	get.fail(function (data){
		alert(data.message);
	});
	get.done(function(data) {
		if (!data.success) {
			alert(data.message);
		}
		console.log(data);
		$(".new-user-form").css("display", "block");
		$("h3").text("Edit user:" + " " + data.editUser.login);
		$("#password").css("display", "none");
		$('[for=password]').css("display", "none");
		$("#EditUserId").attr("value", data.editUser.id);
		if (data.editUser.isAdmin) {
			$("#isAdmin").attr("checked", "checked");
		}
		for(var key in data.editUser){
			$('#' + key).val(data.editUser[key]);
		}
		$(".new-user-form").submit(function() {

			var formData = {
				name: $("#name").val(),
				profilePicSmall: $("#profilePicSmall").val(),
				profilePicLarge: $("#profilePicLarge").val(),
				login: $("#login").val(),
				url: $("#url").val(),
				about: $("#about").val(),
				id: $("#EditUserId").val(),
				isAdmin: $("#isAdmin").prop("checked"),
			};
			if (!FilledFields( formData )) {
				alert('filled all fields');
			}
			else {
				var posting = $.post("/admin/saveEditingUser", formData)
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
			}
			return false;
		});
		
	});
	return false;
});

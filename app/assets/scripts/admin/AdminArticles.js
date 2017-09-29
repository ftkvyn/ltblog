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


$("body").on("submit",".find-form", function() {
	var Findform = $(this);

	var title = (Findform).children().children('[name=find-title]').val();
	var description = (Findform).children().children('[name=find-descr]').val();
	var author = $('.find-form select').val();
	console.log(author);

	var formData = {

	};
	if (title != "") {
		formData.title = title;
	}
	if (description != "") {
		formData.description = description;
	}
	if (author != "") {
		formData.author = author;
	}
	var count = 0;
	for (key in formData) {
		count++;
	}
	if (count == 0) {
		alert("Filled search field/fields");
	}
	else {
		var link = "/admin/articles?"
		var Count = 0;
		for (var a in formData) {
			if (Count != 0) {
				link = link + '&';
			}
			link = link + a +'=' + encodeURIComponent(formData[a]);
			Count++;
		}
		console.log(link);
		window.location = link;
	}

	return false;
});
//var dateData;
//var dateId;

//$(document).ready(function(){
//	$("body").on("click",".date-edit-input", function() {
//		var input = $(this);
//		var id = $(this).attr("data-id");
//		dateId = '[id= ' + id + ']';
//		dateData = $(this).siblings("#date-id").val();
//	});
//})
//$("body").on("click",".pick-submit", function() {
//		
//		var mounth = $(dateId).children().children(".pick-m").children(".pick-sl").val(); 
//		var year = $(dateId).children().children(".pick-y").children(".pick-sl").val();
//		var day = $(dateId).children().children(".pick-d").children(".pick-sl").val();
//		var date = year + '-' + mounth + '-' + day +'T00:00:00.000Z';
//
//		var id = +dateData;
//		var formData = {
//			id: id,
//			createdAt: date,
//			updatedAt: date
//		}
//		var posting = $.post('/admin/articles/changeDate', formData)
//		posting.fail(function (data){
//			alert(data.message);
//			alert('fail');
//		});
//		posting.done(function(data) {
//			window.location.reload();
//		});
//	});

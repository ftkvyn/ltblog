$(function() {
	var id = $('#art-id').val();
	$.get('/relates/' + id, function(data){
		$('#relates').html(data);
	});
})

var purl = $(("[property^=\"og\"]")&&("[property$=\"url\"]")).attr("content"); 
var ptitle = $(("[property^=\"og\"]")&&("[property$=\"title\"]")).attr("content"); 
var pimg = $(("[property^=\"og\"]")&&("[property$=\"image\"]")).attr("content");
var pdescr = $(("[property^=\"og\"]")&&("[property$=\"description\"]")).attr("content");
Share = {
	vkontakte: function() {
		url  = 'https://vk.com/share.php?';
		url += 'url='          +  encodeURIComponent('http://www.livingthing.me/');
		url += '&title='       +  encodeURIComponent(ptitle);
		url += '&description=' +  encodeURIComponent(pdescr);
		url += '&image='       +  encodeURIComponent('http://www.livingthing.me/images/andrei.jpg');
		url += '&noparse=true';
		Share.popup(url);
	},
	/*odnoklassniki: function(purl, text) {
		url  = 'http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1';
		url += '&st.comments=' + encodeURIComponent(text);
		url += '&st._surl='    + encodeURIComponent(purl);
		Share.popup(url);
	},*/
	facebook: function() {
		url  = 'https://www.facebook.com/sharer/sharer.php?';
		url += '&u='     + encodeURIComponent('http://www.livingthing.me/');
		url += '&t='     + encodeURIComponent('The Living Thing');
		Share.popup(url);
	},
	twitter: function(purl, ptitle) {
		url  = 'https://twitter.com/share?';
		url += '&url='      + encodeURIComponent('http://www.livingthing.me/');
		Share.popup(url);
	},
	/*mailru: function(purl, ptitle, pimg, text) {
		url  = 'http://connect.mail.ru/share?';
		url += 'url='          + encodeURIComponent(purl);
		url += '&title='       + encodeURIComponent(ptitle);
		url += '&description=' + encodeURIComponent(text);
		url += '&imageurl='    + encodeURIComponent(pimg);
		Share.popup(url)
	},*/
	popup: function(url) {
		window.open(url,'','toolbar=0,status=0,width=626,height=436');
	}
};

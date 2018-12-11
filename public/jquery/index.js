//jquery
$(document).ready(function(){
	var pathname = window.location.pathname;
	console.log(pathname);

	if(pathname == '/invalidU'){
		$('#createAccountForm .infoError').text('Account Already Exists');
		$('#accessAccountForm h3').css('margin-bottom', '60px');
	}

	else if(pathname == '/invalidI'){
		$('#accessAccountForm .infoError').text('Username/Password Combination Does Not Exist');
		$('#createAccountForm h3').css('margin-bottom', '63px');
	}
});
var urlBase = 'http://cop4331.us/APIS';
var extension = 'php';

//onclick="doLogin();"

var userId = 0;
var firstName = "";
var lastName = "";

function doLogin()
{	
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	var hash = md5( password ); 


    
	document.getElementById("loginResult").innerHTML = "";

	var jsonPayload = '{"Username" : "' + username + '", "Password" : "' + hash + '"}';
	var url = urlBase + '/Login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{  
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse( xhr.responseText );
		
		userId = jsonObject.UserID;
		
		if( userId < 1 )
		{
			document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
			return;
		}
		
		firstName = jsonObject.Firstname;
		lastName = jsonObject.Lastname;

		saveCookie();
	
		window.location.href = "contact.html";
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function createUser() 
{
	var firstName = document.getElementById("firstName").value;
	var lastName = document.getElementById("lastName").value;
	var username = document.getElementById("newUsername").value;
	var password = document.getElementById("newPassword").value;
	var hash = md5( password );

	document.getElementById("createResult").innerHTML = "";

	var jsonPayload = '{"Firstname" :"'+ firstName + '", "Lastname" : "' + lastName + '", "Username" : "' + username + '", "Password" : "' + hash + '"}';
	var url = urlBase + '/AddUser.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{  
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse( xhr.responseText );
		
		var response = jsonObject.success;
		
		if( response != "CREATED")
		{
			document.getElementById("createResult").innerHTML = "Error Occurred during account creation. Please check data and try again.";
			return;
		}
	}
	catch(err)
	{
		document.getElementById("createResult").innerHTML = err.message;
	}
	document.getElementById("createResult").innerHTML = "Account Created! Please log in.";
}
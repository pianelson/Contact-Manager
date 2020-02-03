var urlBase = 'http://cop4331.us/APIS';
var extension = 'php';

var userId = 0;
var contactId = 0;
var firstName = "";
var lastName = "";

function doLogin()
{	
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	var hash = md5( password );  // Hash the password

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
		
		// If user ID is less than 1 no user exists with given credentials
		if( userId < 1 )
		{
			document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
			return;
		}
		
		firstName = jsonObject.Firstname;
		lastName = jsonObject.Lastname;

		// Store the credentials in a cookie
		saveCookie();
	
		// Open the next contacts page
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
	document.cookie = "userId=" + userId + ", contactId=" + contactId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	// Read the userId and contactId (if any) from cookie
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] === "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
		if( tokens[0] === "contactId" )
		{
			contactId = tokens[1];
		}
	}
	
	// If userId is 0 return to log in
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
}

function doLogout()
{
	// Reset the cookie and stored values and return to log in
	userId = 0;
	contactId = 0;
	document.cookie = "userId= ,contactId= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
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
		
		if( response !== "CREATED")
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

function createContact() 
{
	var firstName = document.getElementById("addFirstName").value;
	var lastName = document.getElementById("addLastName").value;
	var phone = document.getElementById("addPhone").value;
	readCookie();
	
	// Reload the page so that the list is cleared out for new list or no list if invalid search
	location.reload();

	var jsonPayload = '{"UserID" : "' + userId + '", "Firstname" :"'+ firstName + '", "Lastname" : "' + lastName + '", "Phone" : "' + phone + '"}';
	var url = urlBase + '/AddContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{  
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse( xhr.responseText );
		
		var response = jsonObject.success;
		
		if( response !== "ADDED")
		{
			document.getElementById("addError").innerHTML = "Error Occurred during contact creation. Please check data and try again.";
			return;
		}
	}
	catch(err)
	{
		document.getElementById("addError").innerHTML = err.message;
	}
	document.getElementById("addError").innerHTML = "Contact Created!";
}

function searchContact() 
{
	var firstName = document.getElementById("firstName").value;
	var lastName = document.getElementById("lastName").value;
	var phone = document.getElementById("phone").value;

	// Read the cookie for userId to search through this User's contacts
	readCookie();

	var jsonPayload = '{"UserID" : "' + userId + '", "Firstname" :"'+ firstName + '", "Lastname" : "' + lastName + '", "Phone" : "' + phone + '"}';
	var url = urlBase + '/SearchContact.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{  
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse( xhr.responseText );
		
		if( jsonObject.error === "No Records Found")
		{
			document.getElementById("searchError").innerHTML = "No Contacts found.";
			return;
		}
		else {
			var element = '';
			for( var i=0; i<jsonObject.results.length; i++ )
			{
				// Create the elements with the checkboxes and information for contacts page
				element += '\
				<tr> \
					<td> \
						<span class="custom-checkbox"> \
							<input class="checks" type="checkbox" id="checkbox' + (i+1) + '" name="options[]" value="' + jsonObject.results[i].ContactID + '"> \
							<label for="checkbox' + (i+1) + '"></label> \
						</span> \
					</td> \
					<td>' + jsonObject.results[i].Firstname + '</td> \
					<td>' + jsonObject.results[i].Lastname + '</td> \
					<td>'+ jsonObject.results[i].Phone +'</td> \
					<td> \
						<a href="#editContact"  data-toggle="modal"><i data-toggle="tooltip" title="" data-original-title="Edit"></i>Edit</a> \
					</td> \
				</tr>';
			}
			document.getElementsByTagName("tbody")[0].innerHTML = element;
		}
	}
	catch(err)
	{
		document.getElementById("searchError").innerHTML = err.message;
	}
}

function showAllContacts() 
{
	// Same as search contacts but with an empty search string in order to grab all contacts
	readCookie();

	var jsonPayload = '{"UserID" : "' + userId + '", "Firstname" :"'+'", "Lastname" : "'+'", "Phone" : "'+'"}';
	var url = urlBase + '/SearchContact.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{  
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse( xhr.responseText );
		
		if( jsonObject.error === "No Records Found")
		{
			document.getElementById("searchError").innerHTML = "No Contacts found.";
			return;
		}
		else {
			var element = '';
			for( var i=0; i<jsonObject.results.length; i++ )
			{
				element += '\
				<tr> \
					<td> \
						<span class="custom-checkbox"> \
							<input class="checks" type="checkbox" id="checkbox' + (i+1) + '" name="options[]" value="' + jsonObject.results[i].ContactID + '"> \
							<label for="checkbox' + (i+1) + '"></label> \
						</span> \
					</td> \
					<td>' + jsonObject.results[i].Firstname + '</td> \
					<td>' + jsonObject.results[i].Lastname + '</td> \
					<td>'+ jsonObject.results[i].Phone +'</td> \
					<td> \
						<a href="#editContact" onClick="storeContactId(document.getElementById(&quot;checkbox' + (i+1) + '&quot;).value);" data-toggle="modal"><i data-toggle="tooltip" title="" data-original-title="Edit"></i>Edit</a> \
					</td> \
				</tr>';
			}
			document.getElementsByTagName("tbody")[0].innerHTML = element;
		}
	}
	catch(err)
	{
		document.getElementById("searchError").innerHTML = err.message;
	}
}

function removeContact() 
{
	var checks = document.getElementsByClassName('checks');
	var str = '';

	for(i = 0; i < checks.length; i++)
	{
		if (checks[i].checked === true) 
		{
			var jsonPayload = '{"ContactID" :"'+ checks[i].value + '"}';
			var url = urlBase + '/RemoveContact.' + extension;

			var xhr = new XMLHttpRequest();
			xhr.open("POST", url, false);
			xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
			try
			{  
				xhr.send(jsonPayload);
				var jsonObject = JSON.parse( xhr.responseText );
				
				var response = jsonObject.success;
				
				if( response !== "REMOVED")
				{
					document.getElementById("").innerHTML = "Error removing contact, please refresh and try again";
					return;
				}
			}
			catch(err)
			{
				document.getElementById("").innerHTML = err.message;
			}
		}
	}
	// Reload the page to show all contacts after removal
	location.reload();
}

function storeContactId(newContactID) 
{
	// Read the cookie to grab the userId value 
	// then store them again but with the contactId that will be updated
	readCookie();
	contactId = newContactID;
	saveCookie();
}


function updateContact() 
{
	readCookie();

	var firstName = document.getElementById("editFirstName").value;
	var lastName = document.getElementById("editLastName").value;
	var phone = document.getElementById("editPhone").value;

	var jsonPayload = '{"ContactID" : "' + contactId + '", "Firstname" :"'+ firstName + '", "Lastname" : "' + lastName + '", "Phone" : "' + phone + '"}';
	var url = urlBase + '/UpdateContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{  
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse( xhr.responseText );
		
		var response = jsonObject.success;
		
		if( response !== "UPDATED")
		{
			document.getElementById("").innerHTML = "Error while updating contact. Please refresh and try again.";
			return;
		}
	}
	catch(err)
	{
		document.getElementById("").innerHTML = err.message;
	}
	document.getElementById("").innerHTML = "Contact Updated!";
}

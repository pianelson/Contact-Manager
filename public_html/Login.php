<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$firstname = "";
	$lastname = "";

	$conn = new mysqli("localhost", "AdminUser", "ForProject1!", "ContactManager");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// Create form to search database for the user with the provided information
		$sql = "SELECT UserID,Firstname,Lastname FROM Users where Username='" . $inData["Username"] . "' and Password='" . $inData["Password"] . "'";
		$result = $conn->query($sql);
		if ($result->num_rows > 0)
		{
			// Gather the returned information
			$row = $result->fetch_assoc();
			$firstname = $row["Firstname"];
			$lastname = $row["Lastname"];
			$id = $row["UserID"];
			
			returnWithInfo($firstname, $lastname, $id );
		}
		else
		{
			returnWithError( "No Records Found" );
		}
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"UserID":0,"Firstname":"","Lastname":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstname, $lastname, $id )
	{
		$retValue = '{"UserID":' . $id . ',"Firstname":"' . $firstname . '","Lastname":"' . $lastname . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";

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
			$firstName = $row["Firstname"];
			$lastName = $row["Lastname"];
			$id = $row["UserID"];
			
			returnWithInfo($firstName, $lastName, $id );
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
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"UserID":' . $id . ',"Firstname":"' . $firstName . '","Lastname":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
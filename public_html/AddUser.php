<?php
	$inData = getRequestInfo();
    
    $firstname = $inData["Firstname"];
	$lastname = $inData["Lastname"];
	$username = $inData["Username"];
    $password = $inData["Password"];
    
	$conn = new mysqli("localhost", "AdminUser", "ForProject1!", "ContactManager");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	// If any of the fields are missing bail
	if ($firstname == '' || $lastname == '' || $username == '' || $password == '')
	{
		returnWithError('INCOMPLETE DATA');
	}
	else
	{
		// Create sql form to add new user
        $sql = "insert into Users (Firstname,Lastname,Username,Password) 
        VALUES ('" . $firstname . "','" . $lastname ."','" . $username . "','" . $password . "')";
		if( $result = $conn->query($sql) != TRUE )
		{
			returnWithError( $conn->error );
        }
        else 
        {
            returnWithSuccess('CREATED');
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
    
    function returnWithSuccess( $success )
	{
		$retValue = '{"success":"' . $success . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>
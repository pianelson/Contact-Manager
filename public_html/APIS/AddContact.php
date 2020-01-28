<?php
	$inData = getRequestInfo();
    
    $firstName = $inData["Firstname"];
	$lastName = $inData["Lastname"];
	$phone = $inData["Phone"];
    $userId = $inData["UserID"];
    
	$conn = new mysqli("localhost", "AdminUser", "ForProject1!", "ContactManager");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// If no UserID is provided bail since every contact has to have it's unique user
		if ($userId != '') 
		{
			// Create the form to add a new contact with given information
			$sql = "insert into Contacts (Firstname,Lastname,UserId,Phone) 
			VALUES ('" . $firstName . "','" . $lastName ."','" . $userId . "','" . $phone . "')";
			if( $result = $conn->query($sql) != TRUE )
			{
				returnWithError( $conn->error );
			}
			else 
			{
				returnWithSuccess('ADDED');
			}
		}
		else 
		{
			returnWithError('NO ID');
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
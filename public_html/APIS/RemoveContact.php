<?php
	$inData = getRequestInfo();
    
    $userId = $inData["UserID"];
    $contactId = $inData["ContactID"];
    
	$conn = new mysqli("localhost", "AdminUser", "ForProject1!", "ContactManager");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// Create sql form to delete the Contact with the given unique ContactID
        $sql = "DELETE FROM `Contacts` WHERE `ContactID`=" . $contactId;
		if( $result = $conn->query($sql) != TRUE )
		{
			returnWithError( $conn->error );
        }
        else 
        {
            returnWithSuccess('REMOVED');
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
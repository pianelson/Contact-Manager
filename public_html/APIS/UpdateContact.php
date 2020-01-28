<?php
	$inData = getRequestInfo();
	
	$contactId = $inData["ContactID"];
    $firstName = $inData["Firstname"];
	$lastName = $inData["Lastname"];
	$phone = $inData["Phone"];
	
	$conn = new mysqli("localhost", "AdminUser", "ForProject1!", "ContactManager");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        $sql = "UPDATE `Contacts` SET";

		$alreadySet = FALSE;

		// If no unique contact ID bail
        if ($contactId != '') 
        {
			if ($firstName != '') 
			{
				$sql .= "`Firstname` = '" . $firstName . "'";
				$alreadySet = TRUE;
			}
			if ($lastName != '') 
			{
				// If there is a value before this add a comma
				if ($alreadySet) {
					$sql .= ",";
				}
				$sql .= " `Lastname` = '" . $lastName . "'";
				$alreadySet = TRUE;
			}
			if ($phone != '') 
			{
				// If there is a value before this add a comma
				if ($alreadySet) {
					$sql .= ",";
				}
				$sql .= " `Phone` = '" . $phone . "'";
			}
			$sql .= "WHERE `ContactID` = " . $contactId;
        }
        else {
			// Return descriptive error
            returnWithError('NO ContactID');
        }
		if( $result = $conn->query($sql) != TRUE )
		{
			// Return connection error
			returnWithError( $conn->error );
        }
        else 
        {
			// Return success acknowledgement
            returnWithSuccess('UPDATED');
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
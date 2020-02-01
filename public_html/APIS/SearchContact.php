<?php
	$inData = getRequestInfo();
    
    $userId = $inData["UserID"];
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
		// Create an sql form to send to databse
        $sql = "select * from `Contacts`" ;

		// UserID is required in order to search the current user's contacts
        if ($userId != '') 
        {
            $sql .= "where `UserID` =" . $userId;
        }
        else 
        {
            returnWithError('NO ID');
		}
		
		// Fill out the rest of the form with the present information
        if ($firstName != '') 
        {
            $sql .= " and `Firstname` like '" . $firstName . "'";
        }
        if ($lastName != '') 
        {
            $sql .= " and `Lastname` like '" . $lastName . "'";
        }
        if ($phone != '') 
        {
            $sql .= " and `Phone` like '" . $phone . "'";
        }
        
        $result = $conn->query($sql);
		if ($result->num_rows > 0)
		{
			// Create a JSON friendly response to send back to client-side with requested info
			while($row = $result->fetch_assoc())
			{
				if( $searchCount > 0 )
				{
					$searchResults .= ",";
				}
				$searchCount++;
				$searchResults .= '{"ContactID": ' . $row["ContactID"] . ', "UserID": '. $row["UserID"] . 
					', "Firstname": "' . $row["Firstname"] . '", "Lastname": "' . $row["Lastname"] . '", "Phone": "' . $row["Phone"] . '"}';
            }
            
            returnWithInfo( $searchResults );
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
    
    function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"err":""}';
		sendResultInfoAsJson( $retValue );
	}
?>
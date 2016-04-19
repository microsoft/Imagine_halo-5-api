// Helper function to construct a URL for the proxy server. The Halo API resource will be sent as a URI component.
function constructURL( resource )
{
    return "/halo?resource=" + encodeURIComponent( resource );
};

// Helper function to load metadata from the Halo server.
function loadMetadata()
{
    var resource = "/metadata/h5/metadata/team-colors";
    $.getJSON( constructURL( resource ), function ( response )
    {
        if ( !response.statusCode )
        {
            setTeamData( response );
        }
    } );
}

// Function to search for player info given the gamertag.
function searchGamertag( gamertag, gameMode )
{
    // *** Add your source code here ***
}

// Function to search for match results given the match ID.
function searchMatch( matchID, gameMode )
{
    // *** Add your source code here ***
}
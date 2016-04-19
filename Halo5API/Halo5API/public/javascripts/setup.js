// Wait for the document to finish loading before running any logic.
$( document ).ready( function ()
{
    // Load metadata right away when page is ready.
    ( function ()
    {
        loadMetadata();
    } )();
    
    // Click event listener for gamertag search button
    $( "#btnSearchGamertag" ).click( function ()
    {
        // Clear any old content
        $( "#content" ).empty();
        
        // *** Add your source code here ***
    } );
    
    // Click event listener for match ID search button
    $( "#btnSearchMatchID" ).click( function ()
    {
        // Clear any old content
        $( "#content" ).empty();
        
        // *** Add your source code here ***
    } );
} )
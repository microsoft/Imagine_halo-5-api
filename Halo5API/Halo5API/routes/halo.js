var express = require( 'express' );
var https = require( 'https' );
var querystring = require( 'querystring' );

var router = express.Router();

// *** Add your source code here ***
var key = "<your-primary-key-here>";

function getHaloAPIResource( resource, response )
{
    var options = {
        hostname: "www.haloapi.com",
        path: encodeURI( resource ),
        method: "GET",
        headers: { "Ocp-Apim-Subscription-Key": key }
    }
    
    var haloAPIRequest = https.request( options, function ( haloAPIResponse )
    {
        console.log( "STATUS: " + response.statusCode );
        console.log( "HEADERS: " + JSON.stringify( response.headers ) );
        
        haloAPIResponse.setEncoding( 'utf-8' );
        
        var responseString = "";
        
        haloAPIResponse.on( 'data', function ( chunk )
        {
            responseString += chunk;
        } );
        
        haloAPIResponse.on( 'end', function ()
        {
            if ( responseString != "" )
            {
                console.log( "BODY: " + responseString );
                response.status( 200 ).send( JSON.parse( responseString ) );
            }
            else if ( haloAPIResponse.statusCode == 302 )
            {
                console.log( "BODY: -" );
                response.status( 200 ).send( { "imgSrc": haloAPIResponse.headers.location } );
            }
            else
            {
                response.status( 200 ).send( { statusCode: haloAPIResponse.statusCode, message: haloAPIResponse.statusMessage } );
            }
        } );
    } );
    
    haloAPIRequest.on( 'error', function ( e )
    {
        var errorMessage = "Problem with request: " + e.message;
        console.log( errorMessage );
        response.status( 500 ).send( errorMessag );
    } );
    
    haloAPIRequest.end();
}

router.get( '/', function ( req, res )
{
    getHaloAPIResource( req.query.resource, res );
} );

module.exports = router;
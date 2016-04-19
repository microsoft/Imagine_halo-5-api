var express = require( 'express' );
var router = express.Router();

/* GET home page. */
router.get( '/', function ( req, res )
{
    res.render( 'index', { title: 'Halo 5 Statistics Search', year: new Date().getFullYear() } );
} );

module.exports = router;
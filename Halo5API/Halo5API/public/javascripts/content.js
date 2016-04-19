// Default team name and color. These will be updated with metadata from the Halo server when the main page loads.
var teamData = [
    { name: "Red Team", color: "#b00000" },
    { name: "Blue Team", color: "#178dd8" },
    { name: "Yellow Team", color: "#e1d002" },
    { name: "Green Team", color: "#027d1a" },
    { name: "Purple Team", color: "#533377" },
    { name: "Magenta Team", color: "#e30ab1" },
    { name: "Orange Team", color: "#9f4e19" },
    { name: "Cyan Team", color: "#0995a2" }
];

// Helper function to add a table row with "numColumns" number of columns. Each column has id "#column{index + offset}".
function addRow( numColumns, offset )
{
    var row = $( "<div>" ).attr( { "class": "row" } );
    for ( var i = 0; i < numColumns; ++i )
    {
        // We are using Bootstrap style so each row contains 12 columns by default. We will evenly distribute them
        // based on "numColumns".
        var columnIndex = i + ( offset || 0 );
        var columnSize = Math.floor( 12 / numColumns );
        var column = $( "<div>" ).attr( { "id": "column" + columnIndex, "class": "col-md-" + columnSize } );
        row.append( column );
    }
    $( "#content" ).append( row );
}

// Helper function to add text. You can specify the "parent" element to attach the text to, as well as the CSS class
// and the actual display text value.
function addText( parent, text, cls )
{
    var element = $( "<div>" ).text( text );
    if ( cls )
    {
        element.attr( { "class": cls } );
    }
    $( parent ).append( element );
}

// Helper function to add an image. You can specify the "parent" element to attach the image to.
function addImage( parent, src )
{
    var image = $( "<img>" ).attr( { "src": src } );
    var element = $( "<div>" ).append( image );
    $( parent ).append( element );
}

// Helper function to add a <br> to "parent" element.
function addBreak( parent )
{ 
    var element = $( "<br>" );
    $( parent ).append( element );
}

// Helper function to convert ISO 8601 duration to HH:MM:SS format.
function getHMS( isoDuration )
{
    var pad2 = function( number )
    {
        return ( number < 10 ? '0' : '' ) + number;
    }

    var duration = moment.duration( isoDuration );
    var hms = "";
    if ( duration.hours() > 0 )
    {
        hms = pad2( duration.hours() ) + ":";
    }
    return hms + pad2( duration.minutes() ) + ":" + pad2( duration.seconds() );
}

// Helper function to set the team name and color from metadata from the Halo server.
function setTeamData( response )
{
    if ( response )
    {
        response.sort( function ( a, b )
        {
            return (a.id - b.id);
        } );

        teamData.length = response.length;
        response.forEach( function ( data, index )
        {
            teamData[index].name = data.name;
            teamData[index].color = data.color;
        } );
    }
}

// Helper function to display basic statistics for the player.
function addBasicStats( stats )
{
    addText( "#column1", "Time Played in Selected Game Mode: " + getHMS( stats.TotalTimePlayed ) );

    addBreak( "#column1" );

    addText( "#column1", "Games Completed: " + stats.TotalGamesCompleted );
    addText( "#column1", "Games Won: " + stats.TotalGamesWon );
    addText( "#column1", "Games Lost: " + stats.TotalGamesLost );
    addText( "#column1", "Games Tied: " + stats.TotalGamesTied );

    addBreak( "#column1" );

    addText( "#column1", "Kills: " + stats.TotalKills );
    addText( "#column1", "Deaths: " + stats.TotalDeaths );
    addText( "#column1", "Assists: " + stats.TotalAssists );

    addBreak( "#column1" );

    addText( "#column1", "Total Headshots: " + stats.TotalHeadshots );
    addText( "#column1", "Total Assassinations: " + stats.TotalAssassinations );
}

// Helper function to display player statistics based on game mode.
function showPlayerStats( stats )
{
    addRow( 3 );
    
    addBreak( "#column1" );
    
    // *** Add your source code here ***
}

// Helper function to show error response from the proxy server along with the status code.
function showError( response )
{
    addText( "#content", "Status Code: " + response.statusCode );
    addText( "#content", response.message );
};

// Helper function to display the match IDs of the most recently played match by the player.
// The match IDs are hyperlinks and the user can click on them to see match results.
function showMatchPlayed( stats )
{
    addBreak( "#column2" );

    addText( "#column2", "Last Played Matches:", "matches-played-style" );

    var gameMode = $( "#selectGameMode" ).val();
    
    var table = $( "<table>" ).attr( "class", "table-striped table-match-played" );
    $( "#column2" ).append( table );

    stats.forEach( function ( matchStats )
    {
        var matchID = matchStats.Id.MatchId;
        
        var onClick = function ()
        {
            var select = getSelection().toString();
            if ( !select )
            {
                // Clear any old content
                $( "#content" ).empty();
                
                // Search and display match results
                searchMatch( matchID, gameMode );
            }
            return false;
        };
        
        var row = $( "<tr>" );
        table.append( row );
        
        var col = $( "<td>" );
        row.append( col );

        var matchLink = $( "<a>" ).attr( { "href": "#" } ).text( matchID ).click( onClick );
        col.append( matchLink );
    } );
}

// Helper function to show the match results. This function will dynamically generate one table
// per team and sort them based on rank.
function showMatchResult( result )
{
    addText( "#content", "Game Duration: " + getHMS( result.TotalDuration ) );
    
    addBreak( "#content" );
    
    var teams = [];
    teams.length = result.TeamStats.length;
    
    // Copy team name and color.
    for ( var i = 0; i < teams.length; ++i )
    {
        teams[i] = {};
        teams[i].name = teamData[i].name;
        teams[i].color = teamData[i].color;
        teams[i].players = new Array();
    }
    
    // Add team rank.
    result.TeamStats.forEach( function ( teamStat )
    {
        teams[teamStat.TeamId].rank = teamStat.Rank;
    } );
    
    // Add player stats for each team.
    result.PlayerStats.forEach( function ( playerStat )
    {
        var stats = {
            gamertag: playerStat.Player.Gamertag,
            K: playerStat.TotalKills,
            D: playerStat.TotalDeaths,
            A: playerStat.TotalAssists
        };
        
        teams[playerStat.TeamId].players.push( stats );
    } );
    
    // Sort the teams based on their rank.
    teams.sort( function ( a, b )
    {
        return ( a.rank - b.rank );
    } );
    
    // Add table rows and columns based on the number of teams we have.
    if ( teams.length <= 2 )
    {
        addRow( teams.length );
    }
    else
    {
        for ( var i = 0; i < teams.length; i += 4 )
        {
            addRow( 4, i );
            addBreak( "#content" );
        }
    }
    
    // Populate stats table.
    teams.forEach( function ( team, index )
    {
        var column = $( "#column" + index );
        
        var headerTable = $( "<table>" ).attr( { "class": "table-match-result-header" } );
        column.append( headerTable );
        
        var headerBar = $( "<tr>" );
        headerTable.append( headerBar );
        headerBar.append( $( "<th>" ).attr( { "bgcolor": team.color } ).text( team.name + " #" + team.rank ) );
        headerBar.append( $( "<th>" ).attr( { "bgcolor": team.color } ) );
        headerBar.append( $( "<th>" ).attr( { "bgcolor": team.color } ) );
        
        var table = $( "<table>" ).attr( { "class": "table-striped table-match-result" } );
        column.append( table );
        
        var header = $( "<tr>" );
        table.append( header );
        header.append( $( "<th>" ).text( "Gamertag" ) );
        header.append( $( "<th>" ).text( "K/D/A" ) );
        
        team.players.forEach( function ( player )
        {
            var row = $( "<tr>" );
            table.append( row );
            
            row.append( $( "<td>" ).text( player.gamertag ) );
            row.append( $( "<td>" ).text( player.K + "/" + player.D + "/" + player.A ) );
        } );
        
        addBreak();
    } );
}
jQuery( function( $ ) {

  // Variables
  var lasty = setInterval( lastfm, 1000 * 60 * 3 ),
    down = {};

  // Search Switcher
  function switcher( action, logo, text, name, type ) {
    $( "#searchform" ).attr( 'action', action );
    $( ".search" ).attr( 'src', logo );
    $( "#search" ).attr( 'placeholder', text )
      .attr( 'name', name )
      .attr( 'data-type', type );
    $( "form" ).removeClass( "focus" );
  }

  // Random Number in a Range
  function numb( min, max ) {
    return Math.floor( Math.random() * ( max - min + 1 ) + min );
  }

  // LastFM Song
  function lastfm() {
    $.getJSON( "./config.json", function( d ) {
      fetch( d.lastFMURL )
        .then( res => res.json() )
        .then( res => res[ 'recenttracks' ][ 'track' ] )
        .then( song => {
          var s = song.map( _map_it )[ 0 ];

          $( ".lastfm__artist" ).text( s.artist ).attr( 'title', "Artist: " + s.artist );
          $( ".lastfm__song" ).text( s.name ).attr( 'title', "Song: " + s.name );
          $( ".lastfm__album" ).text( s.album ).attr( 'title', "Album: " + s.album );
          if ( s.image != "" ) {
            $( ".lastfm__image" ).attr( "src", s.image ).show();
          } else {
            $( ".lastfm__image" ).hide();
          }
          $( ".lastfm__container" ).show();
          $( ".lastfm__url" ).attr( "href", s.link ).addClass( "shown" );
        } ).catch( error => {
          $( ".lastfm__container" ).hide();
        } );

      function _map_it( song ) {
        return {
          id: song.mbid,
          name: song.name,
          album: song.album[ "#text" ],
          artist: song.artist[ "#text" ],
          image: song.image[ 3 ][ "#text" ],
          link: song.url
        }
      }
    } );
  }

  // Instapaper Home Feed
  function instapaper() {
    $.getJSON( "./config.json", function( d ) {
      var dt = new Date();
      fetch( d.instapaperURL + '?t=' + ( dt.getMinutes() * 60 ) + dt.getSeconds() )
        .then( function( response ) {
          $( ".instapaper-replace" ).css( 'opacity', 0 );
          return response.text()
        } )
        .then( function( html ) {
          if ( html ) {
            setTimeout( function() {
              var parser = new DOMParser();
              $( ".instapaper-replace" ).replaceWith( html ).css( 'opacity', 1 );
            }, 800 );
          }
        } )
        .catch( function( err ) {
          $( ".instapaper-replace" ).removeClass( 'large-4' ).addClass( 'large-auto' );
        } );
    } );
  }

  // Page View Counter
  function counter() {
    $.getJSON( "./config.json", function( d ) {
      var dt = new Date();
      fetch( d.counterURL + '?t=' + ( dt.getMinutes() * 60 ) + dt.getSeconds() )
        .then( function( response ) {
          return response.text()
        } )
        .then( function( number ) {
          if ( number ) {
            setTimeout( function() {
              $( ".counter-replace" ).text( ( number ).toString() );
              $( ".counter" ).addClass( 'shown' ).attr( 'title', 'Views: ' + number );
            }, 800 );
          }
        } )
        .catch( function( err ) {
          $( ".counter" ).remove();
        } );
    } );
  }

  // Primary Wallet Status
  function wallet() {
    $.getJSON( "./config.json", function( d ) {
      var dt = new Date(),
        balance = false;
      fetch( d.ethplorerURL + '?t=' + ( dt.getMinutes() * 60 ) + dt.getSeconds() )
        .then( function( response ) {
          return response.json()
        } )
        .then( function( response ) {
          var balance = ( response[ 'ETH' ][ 'totalIn' ] ).toString();
          var balance_formatted = ( response[ 'ETH' ][ 'totalIn' ] ).toFixed( 3 );
          var balance_diff = response[ 'ETH' ][ 'price' ][ 'diff' ];
          var formatted = ( balance_diff > 0 ? " (+" + balance_diff + "%)" : " (" + balance_diff + "%)" );
          if ( balance ) {
            setTimeout( function() {
              $( ".wallet-replace" ).text( ( balance_formatted + formatted ).toString() );
              $( ".wallet" ).addClass( 'shown' ).attr( 'title', 'Ξ ' + balance + formatted );
              // Counter
              counter();
            }, 800 );
          }
        } )
        .catch( function( err ) {
          $( ".wallet" ).remove();
          // Counter
          counter();
        } );
    } );
  }

  // Click Search to Toggle Targeting
  $( "#searchform label" ).on( "click", function() {
    var s = $( "#search" );
    if ( s.attr( 'data-type' ) === 'google' ) {
      var action = 'https://duckduckgo.com',
        logo = 'icon__duckduckgo.svg',
        text = 'Search DuckDuckGo',
        name = 'q',
        type = 'duckduckgo';
    } else if ( s.attr( 'data-type' ) === 'duckduckgo' ) {
      var action = 'https://translate.google.com/',
        logo = 'icon__translate.svg',
        text = 'Translate',
        name = 'hl=en&sl=en&tl=es&text=',
        type = 'translate';
    } else if ( s.attr( 'data-type' ) === 'translate' ) {
      var action = 'https://youtube.com/results',
        logo = 'icon__youtube.svg',
        text = 'Search YouTube',
        name = 'search_query',
        type = 'youtube';
    } else if ( s.attr( 'data-type' ) === 'youtube' ) {
      var action = 'https://beta.music.apple.com/us/search',
        logo = 'icon__applemusic.svg',
        text = 'Search Apple Music',
        name = 'term',
        type = 'applemusic';
    } else if ( s.attr( 'data-type' ) === 'applemusic' ) {
      var action = 'https://www.last.fm/search',
        logo = 'icon__lastfm.svg',
        text = 'Search LastFM',
        name = 'q',
        type = 'lastfm';
    } else if ( s.attr( 'data-type' ) === 'lastfm' ) {
      var action = 'https://twitter.com/search',
        logo = 'icon__twitter.svg',
        text = 'Search Twitter',
        name = 'q',
        type = 'twitter';
    } else if ( s.attr( 'data-type' ) === 'twitter' ) {
      var action = 'https://news.google.com/search',
        logo = 'icon__googlenews.svg',
        text = 'Search Google News',
        name = 'q',
        type = 'googlenews';
    } else if ( s.attr( 'data-type' ) === 'googlenews' ) {
      var action = 'https://github.com/search',
        logo = 'icon__github.svg',
        text = 'Search Github',
        name = 'q',
        type = 'github';
    } else if ( s.attr( 'data-type' ) === 'github' ) {
      var action = 'https://www.midjourney.com/app/users/383432442448576517',
        logo = 'icon__midjourney.svg',
        text = 'Search MidJourney',
        name = 'search',
        type = 'midjourney';
    } else if ( s.attr( 'data-type' ) === 'midjourney' ) {
      var action = 'https://www.poewiki.net/index.php',
        logo = 'icon__poe.png',
        text = 'Search PoE Wiki',
        name = 'poewiki',
        type = 'poewiki';
    } else {
      var action = 'https://google.com/search',
        logo = 'icon__google.svg',
        text = 'Search Google',
        name = 'q',
        type = 'google';
    }
    switcher( action, logo, text, name, type );
  } );

  // Focus Styling for Search
  $( "#search" ).on( 'focus focusout', function() {
    $( "form" ).removeClass( "focus" );
  } );

  // Click Anywhere to Focus Search
  $( document ).on( "click", function( e ) {
    if ( e.target.tagName !== "A" || e.target.tagName !== "INPUT" ) {
      $( "#search" ).focus();
      $( "form" ).addClass( "focus" );
    }
  } );

  // Randomize Background Gradient
  $( "body" ).css( {
    "background": "radial-gradient(ellipse at " + numb( 1, 50 ) + "% " + numb( 90, 120 ) + "%, rgb(27, 27, 24) 0%, #0d0d0d 90%)"
  } );

  // Focus Search
  $( "#search" ).focus();

  // Change Search Target with Arrow Keys
  $( document ).keydown( function( e ) {
    down[ e.keyCode ] = true;
    if ( down[ 18 ] ) {
      e.preventDefault();
    }
  } ).keyup( function( e ) {
    // Arrow Modifiers
    if ( down[ 37 ] && down[ 38 ] ) {
      var action = 'https://www.poewiki.net/index.php',
        logo = 'icon__poe.png',
        text = 'Search PoE Wiki',
        name = 'search',
        type = 'poewiki';
    }
    if ( down[ 38 ] && down[ 39 ] ) {
      var action = 'https://youtube.com/results',
        logo = 'icon__youtube.svg',
        text = 'Search YouTube',
        name = 'search_query',
        type = 'youtube';
    }
    if ( down[ 39 ] && down[ 40 ] ) {
      var action = 'https://google.com/search',
        logo = 'icon__google.svg',
        text = 'Search Google',
        name = 'q',
        type = 'google';
    }
    // Alt Modifiers
    if ( down[ 18 ] && down[ 49 ] ) { // alt + 1
      var action = 'https://duckduckgo.com',
        logo = 'icon__duckduckgo.svg',
        text = 'Search DuckDuckGo',
        name = 'q',
        type = 'duckduckgo';
    } else if ( down[ 18 ] && down[ 50 ] ) { // alt + 2
      var action = 'https://translate.google.com/',
        logo = 'icon__translate.svg',
        text = 'Translate',
        name = 'hl=en&sl=en&tl=es&text=',
        type = 'translate';
    } else if ( down[ 18 ] && down[ 51 ] ) { // alt + 3
      var action = 'https://youtube.com/results',
        logo = 'icon__youtube.svg',
        text = 'Search YouTube',
        name = 'search_query',
        type = 'youtube';
    } else if ( down[ 18 ] && down[ 52 ] ) { // alt + 4
      var action = 'https://beta.music.apple.com/us/search',
        logo = 'icon__applemusic.svg',
        text = 'Search Apple Music',
        name = 'term',
        type = 'applemusic';
    } else if ( down[ 18 ] && down[ 53 ] ) { // alt + 5
      var action = 'https://www.last.fm/search',
        logo = 'icon__lastfm.svg',
        text = 'Search LastFM',
        name = 'q',
        type = 'lastfm';
    } else if ( down[ 18 ] && down[ 54 ] ) { // alt + 6
      var action = 'https://twitter.com/search',
        logo = 'icon__twitter.svg',
        text = 'Search Twitter',
        name = 'q',
        type = 'twitter';
    } else if ( down[ 18 ] && down[ 55 ] ) { // alt + 7
      var action = 'https://news.google.com/search',
        logo = 'icon__googlenews.svg',
        text = 'Search Google News',
        name = 'q',
        type = 'googlenews';
    } else if ( down[ 18 ] && down[ 56 ] ) { // alt + 8
      var action = 'https://github.com/search',
        logo = 'icon__github.svg',
        text = 'Search Github',
        name = 'q',
        type = 'github';
    } else if ( down[ 18 ] && down[ 57 ] ) { // alt + 9
      var action = 'https://www.midjourney.com/app/users/383432442448576517',
        logo = 'icon__midjourney.svg',
        text = 'Search MidJourney',
        name = 'search',
        type = 'midjourney';
    } else if ( down[ 18 ] && down[ 173 ] ) { // alt + -
      var action = 'https://www.poewiki.net/index.php',
        logo = 'icon__poe.png',
        text = 'Search PoE Wiki',
        name = 'poewiki',
        type = 'poewiki';
    } else if ( down[ 18 ] && down[ 48 ] ) { // alt + 0
      var action = 'https://google.com/search',
        logo = 'icon__google.svg',
        text = 'Search Google',
        name = 'q',
        type = 'google';
    }
    // Switch Search
    switcher( action, logo, text, name, type );
    // Reset Key
    down[ e.keyCode ] = false;
  } );

  // Get Last FM Now Playing
  lastfm();

  // Get Latest Instapaper Articles
  instapaper();

  // Console Log Attribution
  console.log( "Built By" );
  console.log(
    "%cMarko Bajlovic",
    "background-color:#fff;color:#0b0b0b;padding:0.5em 1em;font-weight:900;line-height:1.5em;font-size:2em;"
  );
  console.log( "Build Version: 1.3.4" );

  // Wallet Value
  wallet();

} );

$(function() {

    //$('#increase-life').on('submit', function(event){
    //    event.preventDefault();
    //    console.log("Button is pushed!");
    //    increase_life();
    //})

    $('#player').on('submit', 'form[id^=increase-life-]', function(){
        var player_primary_key = $(this).attr('id').split('-')[2];
        console.log('Pushed button for player with id: ' + player_primary_key);
        increase_life(player_primary_key)
    });

    $('#load_game').on('submit', function(event){
        event.preventDefault();
        console.log("Loading Game...");
        load_game();
    });

    function load_game(){
        $.ajax({
            url: '../../api/game/2/',
            type: 'GET',

            success: function(json){
                console.log(json)
                console.log('Got Game : ' + json.password)

            }
        })
    }
    function increase_life(id){
        var player = get_player(id);
        console.log("Increasing life of: " + player.name);
        $.ajax({
            url: "../../api/player/"+id+"/",
            type: "PUT",
            data: {'game': player.game, 'name': player.name, 'life_total': player.life_total + 1},

            sucess : function(json){
                $('increase-life').val('');
                console.log(json);
                console.log("sucess");
            },
            error : function(xhr){
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
        console.log($('#increase-life').val())
    }

    function get_player(id){
        $.ajax({
            url: "../../api/player/"+id+"/",
            type: "GET",

            success : function(json){
                console.log('Got json data for ' + json.name);
                return json
            }
        })
    }


    // This function gets cookie with a given name
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');

    /*
    The functions below will create a header with csrftoken
    */

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    function sameOrigin(url) {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
});
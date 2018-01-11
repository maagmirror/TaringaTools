//todo: seguidos baneados

function main() {
    var banned = [];
    var nick = $('#input-text').val();
    var userid;
    var page = 1;
    var avatar = [];
    $('#input-text').val(''); /* Si alguno lee esto y sabe una forma mas inteligente de ocultar DOM y agregar, avisen pli <33 */
    $('#baneados li').remove();
    $('#baneados p').remove();
    $('#info p').remove();
    $('#ban-content').show();
    $('.loader').show();

    var clean = function(){
        $('.loader').hide();
        $('#info p').remove();
        $('#baneados li').remove();
    };

    var getID = function(nickName){
        var dfd = $.Deferred();
        $.ajax({
            url: 'http://api.taringa.net/user/nick/view/' + nickName,
            success: function(response){
                dfd.resolve(response['id'])
            },
            error: function(){
                $('#baneados').append('<p id="info-result"> Ingresa un usuario valido.</p>');
                clean()
            }
        });
        return dfd.promise()
    };

    var getFollowings = function() {
        var dfd = $.Deferred();
        $.ajax({
            url: 'http://api.taringa.net/user/followings/view/' + userid + '?count=50&page=' + page,
            success: function(response){
                if(response.length > 0) {
                    for (x in response) {
                        if (response.hasOwnProperty(x)) {
                            if (response[x]['status'] === 5){
                                banned.push(response[x]['nick']);
                                avatar.push(response[x]['avatar']['big'])
                            }
                        }
                    }
                    page++;
                }
                dfd.resolve(response); /* Se que no esta muy bien esto pero weno :c */
            }
        });
        return dfd.promise();
    };

    function Followings() {
        getFollowings().then(function(e){
            if(e.length > 0) {
                Followings();
            }
            else {
                if (banned.length == 0) {
                    $('.loader').hide();
                    $('#ban-content p').remove();
                    $('#baneados').append('<p id="info-result">Ninguno de los que sigues esta baneado.</p>');
                }
                else{
                    page = 0;
                    lastFunction();
                }
            }
        })
    }

    function lastFunction(){ /* Best name ever */
        clean();
        $('#ban-content p').remove();
        $('#info').append('<p style="padding-bottom: 10px;">Seguidos baneados</p>');
        for (x in banned) {
            if (banned.hasOwnProperty(x)){
                $('#baneados').append('<li><a href="http://www.taringa.net/' + banned[x] + '" target="_blank"><img src="' + avatar[x] + '" title="' + banned[x] + '"/><br>' + banned[x] + ' </a></li>');
            }
        }
    }

    getID(nick).then(function(e){
        userid = e;
        Followings();
        $('#ban-content').append('<p id="info-result">Obteniendo lista de baneados... </p>')
    });

}

$(document).ready(function(){

    $('#input-text').focus();
    $('#input-text').keydown(function(key){
        if (key.which == 13) main();
    });

    $('#btn-send').click(function(){
        main();
    });

});
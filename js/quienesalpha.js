// todo: Quienes no me siguen

function main() {
    var $input = $('#input-textq');
    var $btn = $('#btn-sendq');
    var nick = $input.val();
    var userid;
    var page = 1;
    var followings = [];
    var followers = [];
    var result = [];
    var avatar = [];
    $input.val('');
    $('#quien-content').show();
    $('.loader').show();
    $('#quienes li').remove();
    $('#info p').remove();
    $('#quienes p').remove();

    var clean = function(){
        $('.loader').hide();
        $('#info p').remove();
        $('#quienes p').remove()
    };

    var getID = function(nickName){
        var dfd = $.Deferred();
        $.ajax({
            url: 'https://api.taringa.net/user/nick/view/' + nickName,
            success: function(response){
                dfd.resolve(response['id'])
            },
            error: function(){
                clean();
                $('#quien-content p').remove();
                $('#quienes').append('<p style="color: #cedeff; padding-bottom: 10px;"> Ingresa un usuario valido.</p>');
            }
        });
        return dfd.promise()
    };

    var getNick = function(id){
        var dfd = $.Deferred();
        if (id == undefined) {
            clean();
            $('#quien-content p').remove();
            $('#quienes').append('<p style="color: #cedeff; padding-bottom: 10px;"> Todos los que sigues, te siguen :3 </p>');
            return false;
        }
        $.ajax({
            url: 'https://api.taringa.net/user/view/' + id,
            success: function(response){
                dfd.resolve(response);
            }
        });
        return dfd.promise()
    };

    var getFollowings = function() {
        var dfd = $.Deferred();
        $.ajax({
            url: 'https://api.taringa.net/user/followings/view/' + userid + '?trim_user=true&count=50&page=' + page,
            success: function(array){
                if(array.length > 0) {
                    followings.push.apply(followings, array);
                    page++;
                }
                dfd.resolve(array);
            }
        });
        return dfd.promise();
    };

    var getFollowers = function(){
        var dfd = $.Deferred();
        $.ajax({
            url: 'https://api.taringa.net/user/followers/view/' + userid + '?trim_user=true&count=50&page=' + page,
            success: function(array){
                if(array.length > 0) {
                    followers.push.apply(followers, array);
                    page++;
                }
                dfd.resolve(array);
            }
        });
        return dfd.promise();
    };

    function quienFollowings() {
        getFollowings().then(function(e){
            if(e.length > 0) {
                quienFollowings();
            }
            else {
                page = 1;
                quienFollowers();
                $('#quien-content p').remove();
                $('#quien-content').append('<p id=info-result> Obteniendo seguidores... </p>')
            }
        })
    }

    function quienFollowers() {
        getFollowers().then(function(e){
            if(e.length > 0) {
                quienFollowers();
            }
            else {
                page = 0;
                getDifference();
                $('#quien-content p').remove();
                $('#quien-content').append('<p id=info-result> Calculando diferencias.. </p>')
            }
        })
    }

    getID(nick).then(function(e){ /* esto se ejecuta primero... */
        userid = e;
        quienFollowings();
        $('#quien-content p').remove();
        $('#quien-content').append('<p id=info-result> Obteniendo usuarios que sigues... </p>')
    });

    function getDifference(){
        $.grep(followings, function(e){
            if ($.inArray(e, followers) == -1) {
                result.push(e);
            }
        });
        lastFunction();
    }

    function lastFunction(){ /* Best name ever */
        getNick(result[page]).then(function(e){
            result[page] = e['nick'];
            avatar.push(e['avatar']['big']);
            page++;
            if (page < result.length) {
                lastFunction();
            }
            else {
                $('#quien-content p').remove();
                $('.loader').hide();
                $('#info').append('<p style="padding-bottom: 10px;">Estos no te siguen, clickealos para ir a su perfil. </p>');
                for (x in result) {
                    if (result.hasOwnProperty(x)){
                        $('#quienes').append('<li><a href="https://www.taringa.net/' + result[x] + '" target="_blank"><img src="' + avatar[x] + '" title="' + result[x] + '"/><br>' + result[x] + ' </a></li>');
                    }
                }
            }
        });
    }
}

$(document).ready(function(){

    $('#input-textq').focus();
    $('#input-textq').keydown(function(key){
        if (key.which == 13) main();
    });

    $('#btn-sendq').click(function(){
        main();
    });

});

window.onload = function() {
 
    var messages = [];
    var socket = io.connect();
    var field = document.getElementById("newsletter_email");
    var sendButton = document.getElementById("newsletter_submit");
    var content = document.getElementById("content");
 
    socket.on('message', function (data) {
        if(data.message) {
            messages.push(data.message);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += messages[i] + '<br />';
            }
            content.innerHTML = html;
        } else {
            console.log("There is a problem:", data);
        }
    });
 
    sendButton.onclick = function() {
        var text = field.value;
        socket.emit('send', { message: text });
    };
 
}
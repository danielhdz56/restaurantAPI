var socket = io.connect();
$('.submit').on('click', function(event) {
    event.preventDefault();
    var newReservation = {
        customerName: $('#reserve_name').val().trim(),
        phoneNumber: $('#reserve_phone').val().trim(),
        customerEmail: $('#reserve_email').val().trim(),
        customerID: $('#reserve_uniqueID').val().trim()
    };
    socket.emit('make-reservation', newReservation);
});

socket.on('message', function (data) {
    alert(data);
    $('#reserve_name').val("");
    $('#reserve_phone').val("");
    $('#reserve_email').val("");
    $('#reserve_uniqueID').val("");
});
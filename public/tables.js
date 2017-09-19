var socket = io.connect();
socket.emit('view-tables');
socket.on('loadDataTables', function (data) {
    data.forEach(function (element, i) {
        var tableSection = $("<div>");
        tableSection.addClass('well');
        tableSection.attr('id', 'tableWell-' + i + 1)
        $('#tableSection').append(tableSection);
        var tableNumber = i + 1;

        $("#tableWell-" + i + 1).append('<h2><span class="label label-primary">' + tableNumber + "</span> | " + data[i].customerName + "</h2>");
    }, this);
});

socket.on('loadDataWailist', function (data) {
    data.forEach(function (element, i) {
        var waitlistSection = $("<div>");
        waitlistSection.addClass('well');
        waitlistSection.attr('id', 'waitlistWell-' + i + 1)
        $('#waitlistSection').append(waitlistSection);
        var tableNumber = i + 1;

        // Then display the remaining fields in the HTML (Section Name, Date, URL)
        $("#waitlistWell-" + i + 1).append('<h2><span class="label label-primary">' + tableNumber + "</span> | " + data[i].customerName + "</h2>");

    }, this);
});
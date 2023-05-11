var APIvspds = 'https://api.excc.co/?c=vsp';

var now = Math.floor((new Date).getTime() / 1000);

$(document).ready(function () {
    if (window.location.href.indexOf('vsp') != -1) {
        vspdFinder();
    };
});

var drawTable = function(data) {
    var tableMarkup = '<table id="vspd-table" class="table">' +
        '<thead>' +
        '<tr>' +
        '<th>Address</th>' +
        '<th>Last Updated</th>'+
        '<th>Voting</th>' +
        '<th>Voted</th>' +
        '<th>Revoked</th>' +
        '<th>Revoked %</th>' +
        '<th>Fees</th>' +
        '<th>Age</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>';


    $.each(data, function (poolUrl, poolData) {
        if (poolData["network"] === 'testnet') {
            return;
        }

        var lastUpdated = poolData["lastupdated"] - now;
        var lastUpdateFormatted = moment.duration(lastUpdated, "seconds").humanize(true);
        if (lastUpdateFormatted.indexOf("years") > 0) {
            lastUpdateFormatted = "N/A";
        }

        tableMarkup += '<td><a target="_blank" rel="noopener noreferrer" href="https://' + poolUrl + '">' + poolUrl + '</a></td>';
        tableMarkup += '<td>' + lastUpdateFormatted + '</td>';

        tableMarkup += '<td>' + poolData["voting"] + '</td>';
        tableMarkup += '<td>' + poolData["voted"] + '</td>';
        tableMarkup += '<td>' + poolData["revoked"] + '</td>';

        var revokedPercent;
        if (poolData["voted"] == 0) {
            if (poolData["revoked"] == 0) {
                revokedPercent = 0;
            } else {
                revokedPercent = 1;
            }
        } else {
            revokedPercent = 100 * (poolData["revoked"] / poolData["voted"]);
        }

        tableMarkup += '<td>' + revokedPercent.toFixed(2) + "%" + '</td>';

        tableMarkup += '<td>' + poolData["feepercentage"] + '%</td>';

        var launchDate = new Date(poolData["launched"] * 1000);
        var duration = moment.duration(launchDate - new Date()).humanize(false);
        order = launchDate.getTime();
        value = '<time' +
            '  style="white-space: nowrap' +
            '" datetime="' + launchDate.toISOString() +
            '" title="' + launchDate.toString() +
            '">' + duration +
            '</time>';
        tableMarkup += '<td data-order="' + order + '">' + value + '</td>';

        tableMarkup += '</tr>';
    });

    tableMarkup += '</tbody></table>';

    $("#vspd-data").html(tableMarkup);

    $("#vspd-table").DataTable({
        "ordering": true,
        "order": [
            [2, 'desc'] // sort by Voting
        ],
        "jQueryUI": false,
        "paging": false,
        "searching": false,
        "info": false,
        'lengthChange': false
    });
};

var drawError = function(jqXHR) {
    var errorMarkup = '<div class="ui-widget"><div class="ui-state-error ui-corner-all">' +
        '<p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span>' +
        '<strong>Error:</strong> ' + jqXHR.status + '</p></div></div>';
    $("#vspd-data").html(errorMarkup);
};

var vspdFinder = function() {
    $("#vspd-data").html("Loading...");

    $.ajax({
        url: APIvspds,
        dataType: "json",
        error:  drawError,
        success: drawTable,
    });
};

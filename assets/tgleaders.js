/*jshint browser:true, devel:true, jquery:true, maxlen:700 */
/*jscs:disable maximumLineLength */
/*globals Handlebars */

/* EXAMPLE DATA
var data = {
  "ts": 1531504611771, // time updated
  "leaders": { // contains the data and the template to use to render the data
    "data": [
      { "q": true,  "id": "nm0634240", "rank": 1, "name": "Christopher/Nolan", "games": 2, "shots": 7,    "score1": 303, "score2": 303,"total": 606 },
      { "q": true,  "id": "nm0169806", "rank": 1, "name": "Taika/Waititi",     "games": 2, "shots": 18,   "score1": 303, "score2": 303,"total": 606 },
      { "q": true,  "id": "nm0000151", "rank": 1, "name": "Morgan/Freeman",    "games": 2, "shots": 3,    "score1": 303, "score2": 303,"total": 606 },
      { "q": true,  "id": "nm0942833", "rank": 1, "name": "Steven/Wright",     "games": 2, "shots": 13,   "score1": 303, "score2": 303,"total": 606 },
      { "q": true,  "id": "nm1785339", "rank": 1, "name": "Rami/Malek",        "games": 2, "shots": 18,   "score1": 303, "score2": 303,"total": 606 },
      { "q": false, "id": "nm1752221", "rank": 6, "name": "Gina/Rodriguez",    "games": 2, "shots": null, "score1": 302, "score2": 303,"total": 605 },
      { "q": false, "id": "nm0000233", "rank": 6, "name": "Quentin/Tarantino", "games": 2, "shots": 11,   "score1": 302, "score2": 303,"total": 605 },
      { "q": false, "id": "nm1388074", "rank": 6, "name": "Tony/Jaa",          "games": 2, "shots": 13,   "score1": 302, "score2": 303,"total": 605 }
    ],
    "target": "#leadersR2 table", // selects element to insert HTML into
    "template": "<thead><tr><th class=\"rank\">Rank</th><th class=\"blank\"></th><th class=\"name\">Player</th><th class=\"blank\"></th><th class=\"score\">Game 1</th><th class=\"score\">Game 2</th><th class=\"shots\">Shot</th><th class=\"blank\"></th><th class=\"total\">Total</th></tr></thead><tbody>{{#data}}<tr class=\"{{#if q}}qual{{/if}}\"><td class=\"rank\">{{rank}}</td><td class=\"blank\"></td><td class=\"name\"><span>{{name}}</span></td><td class=\"blank\"></td><td class=\"score\">{{score1}}</td><td class=\"score\">{{score2}}</td><td class=\"shots\">{{shots}}</td><td class=\"blank\"></td><td class=\"total\">{{total}}</td></tr>{{/data}}</tbody>"
  }
};
*/
var tgleaders = {
  baseUrl: 'https://leaders.topgolfmedia.com',
  fetch: function (key, callback) { // callback(err, data)
    //console.log('fetch', key);
    if (!key)
      return;

    // build url, bust cache once an hour
    var busta = Math.ceil(Date.now() / 1000 / 60 / 60),
        url = this.baseUrl + '/json/' + key + '?' + busta;

    $.get(url).done(function (data) {
      callback(null, data);
    }).fail(function (xhr, status, err) {
      callback(err, null);
    });
  },
  clear: function (roundNo) {
    //console.log('clear', roundNo);
    var $table = $('#leadersR' + roundNo + ' table');
    $table.slideUp(250, function () {
      $table.html('');
    });
  },
  display: function (tourneyId, roundNo) {
    //console.log('display', tourneyId, roundNo);
    // key, e.g. leaders_sample_r2 or leaders_tour18roseville_r1
    var key = 'leaders_' + tourneyId + '_r' + roundNo;

    tgleaders.fetch(key, function (err, json) {
      if (err) {
        console.warn(err);
        tgleaders.clear(roundNo);
        return;
      }

      console.log('json', json);
      if (json && json.leaders) {
        // compile handlebars template
        var template = Handlebars.compile(json.leaders.template);

        // generate html
        var html = template({ data: json.leaders.data });

        // present them
        $('#leadersR' + roundNo + ' table').html(html).fadeIn();
      }
    });
  },
  displayAll: function (tourneyId, roundNo) {
    for (var r = 3; r > 0; r--) {
      if (r <= roundNo) {
        tgleaders.display(tourneyId, r);
      } else {
        tgleaders.clear(r);
      }
    }
  }
};

$(function () {
  // click on any event to load its data (all data-id="sample" in this example)
  $('.venue-col a').on('click', function () {
    var $link = $(this),
        id = $link.data('id'),
        roundNo = parseInt($link.data('rn')) || 0;

    if (id && roundNo) {
      var year = (new Date()).getFullYear().toString().substr(2),
          tourneyId = 'tour' + year + id; // (tourneyId === 'sample') ? tourneyId : 'tour' + year + tourneyId;

      // display most recent round
      //tgleaders.display(tourneyId, roundNo);

      // display all rounds (and hide rounds without data)
      tgleaders.displayAll(tourneyId, roundNo);

      return false;
    }

    return true; // go to href
  });
});

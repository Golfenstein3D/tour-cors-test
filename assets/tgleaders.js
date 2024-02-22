/* eslint max-len:off */
/* globals Handlebars */

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
  debug: (location.hostname !== 'tour.topgolf.com'),
  baseUrl: (function () {
    return 'https://leaders.' + (location.hostname === 'localhost' ? 'loc.topgolfmedia.com:3443' : 'topgolfmedia.com');
  }()),
  tid: function (id, yr) {
    var year = yr || (new Date()).getFullYear().toString().substr(2);
    return 'tour' + year + id;
  },
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
  clearBracket: function () {
    //console.log('clearBracket');
    var $bracket = $('#bracket div'),
        $leaders = $('#leaders');

    $bracket.slideUp(250, function () {
      $bracket.html('');
    });

    $leaders.slideUp(250, function () {
      $leaders.html('');
    });
  },
  display: function (tourneyId, roundNo) {
    //console.log('display', tourneyId, roundNo);
    // key, e.g. leaders_sample_r2 or leaders_tour18roseville_r1
    var key = 'leaders_' + tourneyId + '_r' + roundNo;
    var $roundTable = $('#leadersR' + roundNo + ' table');

    tgleaders.fetch(key, function (err, json) {
      if (err) {
        console.warn(err);
        tgleaders.clear(roundNo);
        return;
      }

      //console.log('json', json);
      if (json && json.leaders) {
        // compile handlebars template
        var template = Handlebars.compile(json.leaders.template);

        // generate html
        var html = template({ data: json.leaders.data });

        // present them
        $roundTable.html(html).fadeIn();
      } else {
        $roundTable.html('').slideUp();
      }
    });
  },
  displayAll: function (tourneyId, roundNo) {
    tgleaders.clearBracket();

    for (var r = 3; r > 0; r--) {
      if (r <= roundNo) {
        tgleaders.display(tourneyId, r);
      } else {
        tgleaders.clear(r);
      }
    }
  },
  displayBracket: function (tourneyId, roundNo) {
    if(tgleaders.debug) console.log('displayBracket', tourneyId, roundNo);
    var key = 'bracket_' + tourneyId;
    if (roundNo && roundNo < 4) {
      key += '_r' + roundNo;
    }

    tgleaders.fetch(key, function (err, json) {
      if (err) {
        console.warn(err);
        tgleaders.clearBracket();
        return;
      }

      // clear regular leaderboard
      for (var r = 3; r > 0; r--) {
        tgleaders.clear(r);
      }

      if(tgleaders.debug) console.log('json', json);
      if (!json) {
        return;
      }
      /* not showing combined qualifier leaderboard
      var leaders = json.leaders;
      if (leaders && leaders.data) {
        if(tgleaders.debug) console.log('leaders', leaders.data);

        if (leaders.data.length) {
          // compile handlebars template & generate html for r0
          var leadersTemplate = (leaders.template.indexOf('<') === 0) ? leaders.template : $('#leaders-template').html(),
              leadersTmpl = Handlebars.compile(leadersTemplate),
              leadersHtml = leadersTmpl({ data: leaders.data });

          // present them
          $('#leaders').html(leadersHtml).fadeIn(); // leaders.target
        }
      }
      */
      var bracket = json.bracket;
      if (bracket && bracket.data) {
        if(tgleaders.debug) console.log('bracket', bracket.data);

        if (bracket.data.r1) {
          // compile handlebars template & generate html for r0
          var bracketTemplate = (bracket.template.indexOf('<') === 0) ? bracket.template : $('#bracket-template').html(),
              bracketTmpl = Handlebars.compile(bracketTemplate),
              bracketHtml = bracketTmpl(bracket.data);

          // present them
          $('#bracket div').html(bracketHtml).fadeIn(); // bracket.target

          // highlight winning scores
          $('.r1,.r2,.r3').find('.matchup').each(function (m, matchup) {
            //console.log(m, matchup);
            var $matchupDivs = $(matchup).children('div'),
                $team1Boxes = $($matchupDivs[0]).find('.score'),
                $team2Boxes = $($matchupDivs[1]).find('.score');

            var scoreCount = Math.min($team1Boxes.length, $team2Boxes.length),
                tie = 'tie',
                top = 'top';

            for (var s = 0; s < scoreCount; s++) {
              var $team1Box = $($team1Boxes[s]),
                  $team2Box = $($team2Boxes[s]),
                  team1Score = parseInt($team1Box.text()) || 0,
                  team2Score = parseInt($team2Box.text()) || 0;
              //console.log('game', s + 1, team1Score, team2Score);

              if (team1Score && team2Score) {
                if (team1Score > team2Score) {
                  $team1Box.removeClass(tie).addClass(top);
                } else if (team2Score > team1Score) {
                  $team2Box.removeClass(tie).addClass(top);
                } else {
                  $team1Box.removeClass(top).addClass(tie);
                  $team2Box.removeClass(top).addClass(tie);
                }
              } else {
                $team1Box.removeClass(tie + ' ' + top);
                $team2Box.removeClass(tie + ' ' + top);
              }
            }
          });
        }
      }
    });
  },
  pageInit: function ($element) {
    var id = $element.data('id'),
        yr = $element.data('yr'),
        roundNo = parseInt($element.data('rn')) || 0;

    if (id && roundNo) {
      var tourneyId = tgleaders.tid(id, yr);

      if (tourneyId.startsWith('tour') && tourneyId.endsWith('final')) {
        tgleaders.displayBracket(tourneyId, roundNo);
      } else {
        tgleaders.displayAll(tourneyId, roundNo);
      }
    }
  }
};

$(function () {
  // display on page load, data from <section id="results"
  tgleaders.pageInit($('#results'));

  // click on any event to load its data (all data-id="sample" in this example)
  $('.venue-col a').on('click', function () {
    var $link = $(this),
        id = $link.data('id'),
        yr = $link.data('yr'),
        roundNo = parseInt($link.data('rn')) || 0;

    if (id && roundNo) {
      var tourneyId = tgleaders.tid(id, yr);

      // display most recent round
      //tgleaders.display(tourneyId, roundNo);

      // display all rounds (and hide rounds without data)
      if (tourneyId.startsWith('tour') && tourneyId.endsWith('final')) {
        tgleaders.displayBracket(tourneyId, roundNo);
      } else {
        tgleaders.displayAll(tourneyId, roundNo);
      }

      return false;
    }

    return true; // go to href
  });
});

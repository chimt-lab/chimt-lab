---

---

// builds lunr
var index = lunr(function () {
  this.field('a')
  this.field('n', {boost: 10})
  this.field('s')
  this.ref('id')
});
{% assign count = 0 %}{% for test in site.tests %}
index.add({
  n: {{test.n | jsonify}},
  a: {{test.a | jsonify}},
  s: {{test.s | jsonify}},
  id: {{count}}
});{% assign count = count | plus: 1 %}{% endfor %}
// builds reference data
var store = [{% for test in site.tests %}{
  "n": {{test.n | jsonify}},
  "link": {{ test.url | jsonify }},
  "a": {{ test.a | jsonify }},
  "s": {{ test.s | jsonify }}
}{% unless forloop.last %},{% endunless %}{% endfor %}]
// builds search

$(document).ready(function() {
  $('input#search').on('keyup', function () {
    var resultdiv = $('#results');
    // Get query
    var query = $(this).val();
    // Search for it
    var result = index.search(query);

    $('.pbox').show('fast');
    // Show results
    resultdiv.empty();
    // Add status
    resultdiv.prepend('<p class="">Found '+result.length+' result(s)</p>');
    // Loop through, match, and add results
    for (var item in result) {
      var ref = result[item].ref;
      var testLink = store[ref].link.substr(store[ref].link.indexOf('/') + 1);
      var testAbbrev = '';

      if (store[ref].a) {
        testAbbrev = ' <span class="test-abbrev">('+store[ref].a+')</span>';
      }
      var searchitem = '<div class="result"><div class="result-body"><a href="'+testLink+'" class="post-title">'+store[ref].n+testAbbrev+'</a></div></div>';
      resultdiv.append(searchitem);
    }
  });
});
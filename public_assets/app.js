$(function(){
        var wikiData = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('label'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            prefetch: {
               url: "data",
               filter: function(response) {
                   return $.map(response.search, function(searchItem) {
                       return searchItem;
                   });
               }
           }, remote: {
                url: "data/%QUERY",
                filter: function(response) {
                    return $.map(response.search, function(searchItem) {
                        return searchItem;
                    });
                },
                wildcard: "%QUERY"
            }
        });

        wikiData.initialize();

        $('.typeahead').typeahead(null, {
            displayKey: 'label',
            source: wikiData.ttAdapter(),
            templates: {
                suggestion: Handlebars.compile("<p style='padding:6px' data-title='{{title}}'>{{label}}:-</p><p> {{description}}</p>"),
                footer: Handlebars.compile("<b>Searched for '{{query}}'</b>")
            }
        });

        $('input').on([
             'typeahead:initialized',
             'typeahead:initialized:err',
             'typeahead:selected',
             'typeahead:autocompleted',
             'typeahead:cursorchanged',
             'typeahead:opened',
             'typeahead:closed'
         ].join(' '), function(x) {
             console.log(this.value);
         });
});

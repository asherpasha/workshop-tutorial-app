/*global _*/
/*jshint camelcase: false*/
(function(window, $, _, undefined) {
  'use strict';

  console.log('Hello, workshop tutorial!');

  var appContext = $('[data-app-name="workshop-tutorial"]');

  /* Wait for Agave to Bootstrap before executing our code. */
  window.addEventListener('Agave::ready', function() {
    var Agave = window.Agave;

    var templates = {
      resultTable: _.template('<table class="table"><thead><tr><th>Related Locus</th><th>Direction</th><th>Score</th></tr></thead><tbody><% _.each(result, function(r) { %><tr><td><%= r.related_entity %> <button name="gene-report" data-locus="<%= r.related_entity %>" class="btn btn-link btn-sm"><i class="fa fa-book"></i><span class="sr-only">Get Gene Report</span></button></td><td><%= r.relationships[0].direction %></td><td><%= _.values(r.relationships[0].scores[0])[0] %></td></tr><% }) %></tbody></table>'),
      geneReport: _.template('<div class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" data-dismiss="modal" class="close"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h4>Gene Report: <%= locus %></h4></div><div class="modal-body"><% _.each(properties, function(prop) { %><h3><%= prop.type.replace("_"," ") %></h3><p><%= prop.value %></p><% }) %></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div>')
    };

    var showResults = function( json ) {

      // show error message for invalid object
      if ( ! ( json && json.obj ) ) {
        $( '.results', appContext ).html( '<div class="alert alert-danger">Invalid response!</div>' );
        return;
      }

      $( '.results', appContext ).html( templates.resultTable( json.obj ) );

      $( 'button[name=gene-report]', appContext ).on('click', function( e ) {
        e.preventDefault();

        var locus = $(this).attr('data-locus');

        var query = {
          locus: locus
        };

        Agave.api.adama.search(
          {'namespace': 'aip', 'service': 'locus_gene_report_v0.1', 'queryParams': query},
          function(search) {
            var html = templates.geneReport(search.obj.result[0]);
            $(html).appendTo('body').modal();
          }
        );
      });

      $( '.results table', appContext ).dataTable();
    };


    $( 'form', appContext ).on('submit', function(e) {
      e.preventDefault();
      // showResults( $(this).serializeArray() );

      // STEP 2.1
      // showResults( this.locus.value );

      // STEP 2.2
      var query = {
        locus: this.locus.value,
        relationship_type: this.relationship_type.value,
        threshold: this.threshold.value
      };
      Agave.api.adama.search({
        'namespace': 'aip', 'service': 'atted_coexpressed_by_locus_v0.1', 'queryParams': query
      }, showResults);
    });

  });

})(window, jQuery, _);

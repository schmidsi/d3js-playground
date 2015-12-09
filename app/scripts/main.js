/* global d3 */
var width = window.innerWidth
var height = window.innerHeight

var color = d3.scale.category20()

var force = d3.layout.force()
    .charge(-500)
    .linkDistance(100)
    .size([width, height])

var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height)

d3.json('/scripts/klasse.json', function (error, graph) {
  if (error) throw error

  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start()

  var link = svg.selectAll('.link')
    .data(graph.links)
    .enter().append('line')
    .attr('class', 'link')
    .style('stroke-width', function (d) { return Math.sqrt(d.value) * 5 })

  var node = svg.selectAll('.node')
    .data(graph.nodes)
    .enter()
    .append('g')
    .attr('class', 'node')
    .call(force.drag)

  node.append('circle')
    .attr('r', 30)
    .style('fill', function (d) { return color(d.group) })

  node.append('image')
    .attr('xlink:href', function (d) { return '/images/simon.png' }) // d.img
    .attr('x', function (d) { return -25 })
    .attr('y', function (d) { return -25 })
    .attr('height', 50)
    .attr('width', 50)

  node.append('text')
    .attr('dx', 30)
    .attr('dy', '.35em')
    .text(function (d) { return d.vorname + ' ' + d.name })

  force.on('tick', function () {
    link.attr('x1', function (d) { return d.source.x })
        .attr('y1', function (d) { return d.source.y })
        .attr('x2', function (d) { return d.target.x })
        .attr('y2', function (d) { return d.target.y })

    /*
    node.attr('cx', function (d) { return d.x })
        .attr('cy', function (d) { return d.y })
    */
    node.attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')' })
  })
})

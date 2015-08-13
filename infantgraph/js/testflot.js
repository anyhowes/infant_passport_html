// Data for testing graphs
var d1 = [[1, 50], [2, 60], [3, 65], [4, 70], [5, 73]];
var d2 = [[1,20],[2,30],[3,35],[4,40],[5,55]];
var d3 = [d1,d2]

// Percentile data from WHO
var males = {"5%": [[0,46.8],[1,51.5],[2,55.1],[3,58.1],[4,60.5],[5,62.4],[6,64.1],[9,68.3],[12,71.8],[15,75],[18,77.8],[24,82.8]], "95%": [[0,53],[1,57.9],[2,61.7],[3,64.8],[4,67.3],[5,69.4],[6,71.1],[9,75.7],[12,79.7],[15,83.3],[18,86.7],[24,92.8]]};

$(document).ready(function () {

	// Create our graph from the data table and specify a container to put the graph in
	createGraph('#data-table', '.chart');

	// Here be graphs
	function createGraph(data, container) {
		// Declare some common variables and container elements
		var bars = [];
		var figureContainer = $('<div id="figure"></div>');
		var graphContainer = $('<div class="graph"></div>');
		var barContainer = $('<div class="bars"></div>');
		var data = $(data);
		var container = $(container);
		var chartData;
		var chartYMax;
		var columnGroups;

		// Create table data object
		var tableData = {
			// Get numerical data from table cells
			chartData: function() {
				var chartData = [];
				data.find('tbody td').each(function() {
					chartData.push($(this).text());
				});
				return chartData;
			},
			// Get heading data from table caption
			chartHeading: function() {
				var chartHeading = data.find('caption').text();
				return chartHeading;
			},
			// Get legend data from table body
			chartLegend: function() {
				var chartLegend = [];
				// Find th elements in table body - that will tell us what items go in the main legend
				data.find('tbody th').each(function() {
					chartLegend.push($(this).text());
				});
				return chartLegend;
			},
			// Sort data into groups based on number of columns
			columnGroups: function() {
				var columnGroups = [];
				// Get number of columns from first row of table body
				var columns = data.find('tbody tr:eq(0) td').length;
				for (var i = 0; i < columns; i++) {
					columnGroups[i] = [i];
					data.find('tbody tr').each(function() {
						columnGroups[i].push($(this).find('td').eq(i).text());
					});
				}
				return columnGroups;
			}
		}

		// Useful variables for accessing table data
		chartData = tableData.chartData();
		// Work in progress, trying to get an entire table into an array but may not be neccessary
		//for (var i = 0; i < data.rows.length; i++) {
		//	columnGroups[i] = tableData.columnGroups();
		//}

		columnGroups = tableData.columnGroups();
		var dataSet = [
			{label: "My data", data: columnGroups, color:"rgb(0,0,0)"},
			{label: "5th-95th percentile", id: "5%", data: males["5%"], lines: {show: true, lineWidth: 0, fill: 0}, points: {show: false}, color:"rgb(50,50,255)"},
			{id: "95%", data: males["95%"], lines: {show: true, lineWidth: 0, fill: 0.2}, points: {show: false}, color: "rgb(50,50,255)", fillBetween: "5%"}
		]

		//Using Flot to plot the graph
		var plot = $.plot($("#placeholder"), dataSet, {
				series: {
					lines: { show: true },
					points: { show: true }
				},
				//Axes options
				xaxis: {
					tickDecimals: 0,
					tickLength: 0,
					axisLabel: 'Age in months',
          axisLabelUseCanvas: true,
          axisLabelFontSizePixels: 12,
          axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
          axisLabelPadding: 5
					/*ticks: 10,
					min: -2,
					max: 2,
					tickDecimals: 3*/
				},
				yaxis: {
					tickFormatter: function (v) {
					return v + " cm";
					},
					axisLabel: 'Height in cm',
					axisLabelUseCanvas: true,
          axisLabelFontSizePixels: 12,
          axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
          axisLabelPadding: 5
				},
				grid: {
					hoverable: true,
					clickable: true,
					backgroundColor: { colors: [ "#fff", "#eee" ] },
					borderWidth: {
						top: 1,
						right: 1,
						bottom: 2,
						left: 2
					}
				}
			});

			//Some CSS for the tooltip popup
			$("<div id='tooltip'></div>").css({
				position: "absolute",
				display: "none",
				border: "1px solid #fdd",
				padding: "2px",
				"background-color": "#fee",
				opacity: 0.80
			}).appendTo("body");

			//Creating the tooltip popup
			$("#placeholder").bind("plothover", function (event, pos, item) {


				if (item) {
					var x = item.datapoint[0].toFixed(0),
						y = item.datapoint[1].toFixed(2);

					$("#tooltip").html(y + "cm tall at " + x + " months")
						.css({top: item.pageY+5, left: item.pageX+5})
						.fadeIn(200);
				} else {
					$("#tooltip").hide();
				}
			});
	}
});

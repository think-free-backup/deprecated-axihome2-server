var devices;

function loadGraph(){

    console.log("Loading graph")

    var start = Math.round( new Date( $("#startDate").data("kendoDateTimePicker").value() ).getTime() / 1000 );
    var end = Math.round( new Date(  $("#endDate").data("kendoDateTimePicker").value() ).getTime() / 1000 );
    var item = $("#devices-comboBox").data("kendoComboBox").value();

    $.getJSON( "../call/db/get?key=" + item + "&start=" + start + "&end=" + end, 
        function (data) {

            $('#container').highcharts({
                chart: {
                    type: 'spline'
                },
                title: {
                    text: 'Device history'
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    type: 'datetime'
                },
                tooltip: {
                    formatter: function() {
                            return '<b>'+ this.y +'</b><br/>'+ Highcharts.dateFormat('%d/%m/%y %H:%M:%S', this.x);
                    }
                },
                
                series: [{
                    data: data
                }]
            });
        }

    );
}

$(document).ready(

    function(){

        $.getJSON( "../call/config/getAllDevicesId",
            function (data){

                $("#devices-comboBox").kendoComboBox({

                        dataSource: data
                });
            }
        )

        $("#startDate").kendoDateTimePicker({
            value:new Date(),
            format: "dd/MM//yyyy HH:mm",
            timeFormat: "HH:mm"
        });

        $("#endDate").kendoDateTimePicker({
            value:new Date(),
            format: "dd/MM//yyyy HH:mm",
            timeFormat: "HH:mm"
        });

        $("#loadButton").kendoButton({click: loadGraph});
    }
);


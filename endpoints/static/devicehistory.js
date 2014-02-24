var devices;

function loadGraph(){

    console.log("Loading graph")

    var start = new Date( $("#startDate").data("kendoDateTimePicker").value() ).getTime() / 1000;
    var end = new Date(  $("#endDate").data("kendoDateTimePicker").value() ).getTime() / 1000;
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
            value:new Date()
        });

        $("#endDate").kendoDateTimePicker({
            value:new Date()
        });

        $("#loadButton").kendoButton({click: loadGraph});
    }
);


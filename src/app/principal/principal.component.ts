import { Component, OnInit } from '@angular/core';
import {IndicatorsService} from "../_services/indicators.service";
declare var $: any;

@Component({
    selector: 'app-principal',
    templateUrl: './principal.component.html',
    styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {
    public indicators: any;
    public type_indicators: any;

    constructor(
        private indicatorsService: IndicatorsService
    ) { }

    ngOnInit(): void {



        let self: any = this;

        $(document).ready(function(){
            $("#ex1 a").click(function(e){
                e.preventDefault();
                $(this).tab("show");
            });
        });
        $('body').unbind()
            .on('click', '.td-indicators', function () {
                $('.placeholder').removeAttr('hidden');
                $('#table-type-indicators').attr('hidden','hidden');
                $('.title-indicator').attr('hidden','hidden');
                setTimeout(function () {
                    $('.placeholder').attr('hidden','hidden');
                    $('#table-type-indicators').removeAttr('hidden');
                    $('.title-indicator').removeAttr('hidden');
                },2000)
                let _this: any = $(this);
                self.lookIndicatorsType(_this.data('id'));
            })
            .on('click', '.icon-modal', function () {
                $('.placeholder').removeAttr('hidden');
                $('.form-indicators').attr('hidden','hidden');
                setTimeout(function () {
                    $('.placeholder').attr('hidden','hidden');
                    $('.form-indicators').removeAttr('hidden');
                },2000)
                let _this: any = $(this);
                $('#chartType').remove()
                $('#div-chart-type').append('<canvas id="chartType"></canvas>')
                self.lookIndicatorToday(_this.data('id'));
            })
        this.listIndicator()

    }

    public async listIndicator() {
        let table: any;
        const labels_pesos: any = [];
        const labels_porcentaje: any = [];
        const labels_dolares: any = [];
        const data_values_pesos: any = [];
        const data_values_dolares: any = [];
        const data_values_porcentaje: any = [];

        this.indicators = (await this.indicatorsService.getAll())


        for (const indicators in this.indicators) {
            if (this.indicators[indicators]['codigo'] != undefined) {
                table += '<tr><td class="td-indicators" data-id="' + this.indicators[indicators]['codigo'] + '"><a  data-bs-toggle="modal" data-bs-target="#modalIndicator"><h3 class="mb-1">' + this.indicators[indicators]['nombre'] + '</h3><p class="mb-1">' + this.indicators[indicators]['unidad_medida'] + '</p></a></td><td><i title ="Ver valores actuales" class="far fa-eye icon-modal" data-id="' + this.indicators[indicators]['codigo'] + '" data-bs-toggle="modal" data-bs-target="#modalIndicatorDate"></i></td></tr>';
                if (this.indicators[indicators]['unidad_medida'] == "Pesos") {
                    labels_pesos.push(this.indicators[indicators]['nombre'])
                    data_values_pesos.push(this.indicators[indicators]['valor'])
                } else if (this.indicators[indicators]['unidad_medida'] == "Dólar") {
                    labels_dolares.push(this.indicators[indicators]['nombre'])
                    data_values_dolares.push(this.indicators[indicators]['valor'])
                } else {
                    labels_porcentaje.push(this.indicators[indicators]['nombre'])
                    data_values_porcentaje.push(this.indicators[indicators]['valor'])
                }

            }

        }
        $('#table-indicators tbody').append(table);


        const data_pesos = {
            labels: labels_pesos,
            datasets: [{
                label: 'Valor en CLP',
                borderColor: 'rgb(99, 255, 104)',
                backgroundColor: 'rgb(61, 168, 64)',
                data: data_values_pesos,
            }]
        };

        const data_porcentaje = {
            labels: labels_porcentaje,
            datasets: [{
                label: 'Valor en Porcentaje',
                borderColor: 'rgb(92, 215, 242)',
                backgroundColor: 'rgb(64, 154, 173)',
                data: data_values_porcentaje,
            }]
        };

        const data_dolar = {
            labels: labels_dolares,
            datasets: [{
                label: 'Valor en Dólar',
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgb(255, 99, 132)',
                data: data_values_dolares,
            }]
        };

        const config_pesos = {
            type: 'bar',
            data: data_pesos,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Chart.js Line Chart'
                }
            }
        };

        const config_dolar = {
            type: 'line',
            data: data_dolar,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Chart.js Line Chart'
                }
            }
        };

        const config_porcentaje = {
            type: 'bar',
            data: data_porcentaje,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Chart.js Line Chart'
                }
            }
        };

        // @ts-ignore
        const ChartIndicadoresPesos = new Chart(
            document.getElementById('ChartIndicadoresDinero'),
            config_pesos
        );

        // @ts-ignore
        const ChartIndicadoresPorcentaje = new Chart(
            document.getElementById('ChartIndicadoresPorcentaje'),
            config_porcentaje
        );

        // @ts-ignore
        const ChartIndicadoresDolar = new Chart(
            document.getElementById('ChartIndicadorDolar'),
            config_dolar
        );
    }

    async lookIndicatorsType(indicator:string): Promise<void>{
        let table: any;
        this.type_indicators = await (this.indicatorsService.findIndicators(indicator))
        let type_value = this.type_indicators['unidad_medida']

        if(type_value == 'Porcentaje'){
            type_value = '%'
        }else{
            type_value = '$'
        }
        $('.title-indicator').text(this.type_indicators['nombre'])
        for (const serie in this.type_indicators['serie']) {

            table += '<tr><td><p class="mb-1">'+this.type_indicators['serie'][serie].fecha.substr(0,10)+'</p></td><td>'+type_value+' '+this.type_indicators['serie'][serie].valor+'</td></tr>';
        }
        $('#table-type-indicators tbody').html(table);
    }

    async lookIndicatorToday(indicator:string): Promise<void>{

        let type_value_signo
        let labels: any = [];
        let data_values: any = [];
        let nombre_indicator = document.getElementById('nombre_indicator')
        let fecha_indicator = document.getElementById('fecha_indicator')
        let unidad_medida = document.getElementById('unidad_de_medida')
        this.type_indicators = await (this.indicatorsService.findIndicators(indicator))
        let type_value = this.type_indicators['unidad_medida']



        if(type_value == 'Porcentaje'){
            type_value_signo = '%'
        }else{
            type_value_signo = '$'
        }
        $('.title-indicator').text(this.type_indicators['nombre'])
        nombre_indicator['value'] = this.type_indicators['nombre']
        unidad_medida['value'] = type_value;
        for (const serie in this.type_indicators['serie']) {
            $('#title-indicator-value').text(type_value_signo+' '+this.type_indicators['serie'][serie].valor);
            fecha_indicator['value'] = this.type_indicators['serie'][serie].fecha.substr(0,10);
            break;
        }

        for (const serie in this.type_indicators['serie']) {
            labels.unshift(this.type_indicators['serie'][serie].fecha.substr(0,10))
            data_values.unshift(this.type_indicators['serie'][serie].valor)
        }


         let data = {
            labels: labels,
            datasets: [{
                label: 'Unidad de media en '+type_value,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: data_values,
            }]
        };

        const config = {
            type: 'line',
            data: data,
            options: {
                responsive:true,
                maintainAspectRatio: true,
                legend:{
                    position:'top',
                },
                title:{
                    display:true,
                    text:'Chart.js Line Chart'
                }
            }
        };

        // @ts-ignore
        const chartType = new Chart(
            document.getElementById('chartType'),
            config
        );


    }

}

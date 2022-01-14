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
                // @ts-ignore
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
                // @ts-ignore
                let _this: any = $(this);
                self.lookIndicatorToday(_this.data('id'));
            })
        this.listIndicator()

    }

    public async listIndicator() {
        let table: any;

        this.indicators = (await this.indicatorsService.getAll())

        for (const indicators in this.indicators) {
            if(this.indicators[indicators]['codigo'] != undefined){
                table += '<tr><td class="td-indicators" data-id="' +this.indicators[indicators]['codigo']+ '"><a  data-bs-toggle="modal" data-bs-target="#modalIndicator"><h3 class="mb-1">'+this.indicators[indicators]['nombre']+'</h3><p class="mb-1">'+this.indicators[indicators]['unidad_medida']+'</p></a></td><td><i title ="Ver valores actuales" class="far fa-eye icon-modal" data-id="' +this.indicators[indicators]['codigo']+ '" data-bs-toggle="modal" data-bs-target="#modalIndicatorDate"></i></td></tr>';
            }
        }
        $('#table-indicators tbody').append(table);

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
        let nombre_indicator = document.getElementById('nombre_indicator')
        let fecha_indicator = document.getElementById('fecha_indicator')
        let unidad_medida = document.getElementById('unidad_de_medida')
/*        let form: any;
        let date: any;
        let tiempo = new Date()
        let month = tiempo.getMonth()
        let year = tiempo.getFullYear()
        let dia_number = tiempo.getUTCDate()
        month = 1 + month
        date = dia_number-1+'-0'+month+'-'+year;*/
        this.type_indicators = await (this.indicatorsService.findIndicators(indicator))
        let type_value = this.type_indicators['unidad_medida']



        if(type_value == 'Porcentaje'){
            type_value_signo = '%'
        }else{
            type_value_signo = '$'
        }
        $('.title-indicator').text(this.type_indicators['nombre'])
        // @ts-ignore
        nombre_indicator['value'] = this.type_indicators['nombre']
        // @ts-ignore
        unidad_medida['value'] = type_value;
        for (const serie in this.type_indicators['serie']) {
            $('#title-indicator-value').text(type_value_signo+' '+this.type_indicators['serie'][serie].valor);
            // @ts-ignore
            fecha_indicator['value'] = this.type_indicators['serie'][serie].fecha.substr(0,10);
            break;
        }


    }

}

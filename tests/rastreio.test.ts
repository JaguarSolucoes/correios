import {rastrear, convertHtmlToEvento} from '../src/correios/rastreio';
import {getHtmlResponse} from './mock'

import {Evento} from '../src/correios/rastreio'

test('should convert the HTML response from Correios into a list of Events', async () => {
  
  const rastreio = await rastrear('LB089250735HK');
  const eventos = rastreio?.eventos;

  console.log(eventos)

  // const eventos: Evento[] = convertHtmlToEvento(htmlResponseFromCorreiosMock);

  // expect(eventos.length).toBe(6);
  // expect(eventos[1].nome).toEqual('Objeto em trânsito - por favor aguarde');
  // expect(eventos[1].data).toEqual(new Date(2020, 12-1, 29));
  // expect(eventos[1].hora).toEqual('11:10');
  // expect(eventos[1].origem).toEqual('HONG KONG - /');
  // expect(eventos[1].destino).toEqual('Unidade de Tratamento Internacional - / BR');
})
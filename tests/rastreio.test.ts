import {rastrear, convertHtmlToEvento} from '../src/correios/rastreio';
import {getHtmlResponse} from './mock'

import {Evento} from '../src/correios/rastreio'

test('should convert the HTML response from Correios into a list of Events', async () => {
  // const resp = await rastrear('LB089250735HK');

  const htmlResponseFromCorreiosMock = getHtmlResponse();

  const eventos: Evento[] = convertHtmlToEvento(htmlResponseFromCorreiosMock);

  expect(eventos.length).toBe(3);
  expect(eventos[2].nome).toEqual('Objeto em trânsito - por favor aguarde');
  expect(eventos[2].data).toEqual(new Date(2020, 12-1, 29));
  expect(eventos[2].hora).toEqual('11:10');
  expect(eventos[2].origem).toEqual('HONG KONG - /');
  expect(eventos[2].destino).toEqual('Unidade de Tratamento Internacional - / BR');
})
import cheerio from 'cheerio';
import axios from 'axios';
import HTMLParser from 'fast-html-parser';

export interface Rastreio {
  eventos?: Evento[],
};

export interface Evento {
  status?: string,
  nome?: string,
  data?: Date,
  hora?: string,
  local?: string,
  origem?: string,
  destino?: string,
};

export const rastrear = async (codigo: string): Promise<Rastreio> => {
  return axios({
    method: 'GET',
    url: `https://www.linkcorreios.com.br/${codigo}`,
    headers: {
      "content-type": "text; charset=utf-8",
      "cache-control": "no-cache",
    },
  }).then(resp => {
    const eventos: Evento[] = convertHtmlToEvento(resp.data);
    return { eventos } as Rastreio;
  });
};

export const convertHtmlToEvento = (html: string): Evento[] => {
  const root = HTMLParser.parse(html);

  const status = root.querySelectorAll('ul.linha_status');

  const eventos: Evento[] = [];
  status.forEach((elem) => {
    const evento = convertElementToEvent(elem);
    eventos.push(evento);
  });

  return eventos.reverse();
}

export const convertElementToEvent = (elem: HTMLParser.HTMLElement): Evento => {
  const evento: Evento = {};
  elem.childNodes.forEach((li) => {
    const text = li.rawText;
    if (text) {
      evento.status = ''; // TODO: pendente, entregue, falha
      if (text.includes("Status")) evento.nome = text.replace('Status:', '').trim();
      if (text.includes("Data")) { 
        const regex = /([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}/gm;

        const strDate = regex.exec(text)?.[0];
        if (strDate) {
          const dateParts = strDate.split("/");
          // month is 0-based, that's why we need dataParts[1] - 1
          evento.data = new Date(+dateParts[2], Number(dateParts[1]) - 1, +dateParts[0]);
        }
      }
      if (text.includes("Data")) { 
        const regex = /([0-9][0-9])(:)([0-9][0-9])/gm;
        evento.hora = regex.exec(text)?.[0];
      }
      if (text.includes("Local")) evento.local = text.replace('Local:', '').trim();
      if (text.includes("Origem")) evento.origem = text.replace('Origem:', '').trim();
      if (text.includes("Destino")) evento.destino = text.replace('Destino:', '').trim();
    }
  });

  return evento;
}
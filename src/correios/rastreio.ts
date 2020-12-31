import cheerio from 'cheerio';
import axios from 'axios';

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
    console.log(resp.data)
    return { eventos } as Rastreio;
  });
};


export const convertHtmlToEvento = (htmlString: string): Evento[] => {
  const html = cheerio.load(htmlString);
  const elemArray: CheerioElement[] = [];
  html("ul.linha_status").each((_, elem) => {
    elemArray.push(elem);
  });
  const elemMap = elemArray.map((elem) => {
    const mapObj: Evento = {};
    html(elem)
      .find("li")
      .each((_, liElem) => {
        const text = html(liElem).text();
        if (text) {
          mapObj.status = ''; // TODO: pendente, entregue, falha
          if (text.includes("Status")) mapObj.nome = text.replace('Status:', '').trim();
          if (text.includes("Data")) { 
            const regex = /([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}/gm;

            const strDate = regex.exec(text)?.[0];
            if (strDate) {
              const dateParts = strDate.split("/");
              // month is 0-based, that's why we need dataParts[1] - 1
              mapObj.data = new Date(+dateParts[2], Number(dateParts[1]) - 1, +dateParts[0]);
            }
          }
          if (text.includes("Data")) { 
            const regex = /([0-9][0-9])(:)([0-9][0-9])/gm;
            mapObj.hora = regex.exec(text)?.[0];
          }
          if (text.includes("Local")) mapObj.local = text.replace('Local:', '').trim();
          if (text.includes("Origem")) mapObj.origem = text.replace('Origem:', '').trim();
          if (text.includes("Destino")) mapObj.destino = text.replace('Destino:', '').trim();
        }
      });
    return mapObj;
  });

  return elemMap.reverse();
};
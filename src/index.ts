import cheerio from 'cheerio';
import axios from 'axios';

interface Rastreio {
  status: string,
};

interface Evento {
  status?: string,
  nome?: string,
  data?: string,
  hora?: string,
  local?: string,
  origem?: string,
  destino?: string,
};

// TODO: return Promise<Rastreio>
const rastrear = async (codigo: string): Promise<Rastreio | any> => {
  return axios({
    method: 'GET',
    url: `https://www.linkcorreios.com.br/${codigo}`,
    headers: {
      "content-type": "text; charset=utf-8",
      "cache-control": "no-cache",
    },
  }).then(resp => {
    const htmlToJson: string = convertHtmlToEvento(resp.data);
    console.log(htmlToJson);
  });
};


const convertHtmlToEvento: any = (htmlString: string) => {
  const html = cheerio.load(htmlString);
  const elemArray: CheerioElement[] = [];
  html("ul.linha_status").each((_, elem) => {
    elemArray.push(elem);
  });
  const elemMap = elemArray.map((elem) => {
    const mapObj: any = {};
    html(elem)
      .find("li")
      .each((_, liElem) => {
        const text = html(liElem).text();
        if (text) {
          mapObj.status = ''; // TODO: pendente, acaminho, entregue, falha
          if (text.includes("Status")) mapObj.nome = text.replace('Status:', '').trim();
          if (text.includes("Data")) { 
            const regex = /([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}/gm;
            mapObj.data = regex.exec(text)?.[0];
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
}

rastrear('NX007676498BR');

export default rastrear;
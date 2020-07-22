import cheerio from 'cheerio';
import axios from 'axios';

interface Rastreio {
  status: string,
};

interface Evento {
  status: string,
  data: string,
  local: string,
  origem: string,
  destino: string,
};

const rastrear = async (codigo: string): Promise<Rastreio | any> => {
  return axios({
    method: 'GET',
    url: `https://www.linkcorreios.com.br/${codigo}`,
    headers: {
      "content-type": "text; charset=utf-8",
      "cache-control": "no-cache",
    },
  }).then(resp => {
    console.log(convertHtmlToJson(resp.data));
  });
};


function convertHtmlToJson(htmlString: string) {
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
          if (text.includes("Status")) mapObj.status = text;
          if (text.includes("Data")) mapObj.data = text;
          if (text.includes("Local")) mapObj.local = text;
          if (text.includes("Origem")) mapObj.origem = text;
          if (text.includes("Destino")) mapObj.destino = text;
        }
      });
    return mapObj;
  });

  return elemMap.reverse();
}




export default rastrear;
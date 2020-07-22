import cheerio from 'cheerio';
import axios from 'axios';

interface Rastreio {
  status: string,
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
    console.log(resp.data);
  });

export default rastrear;
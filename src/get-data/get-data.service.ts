import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { parse } from 'node-html-parser';
import IProductUnit from './interfaces/iProductUnit';

function fixText(oldProducts: IProductUnit[]): IProductUnit[] {
  const newProducts: IProductUnit[] = oldProducts.map((product) => {
    const newProduct: IProductUnit = {
      key: product.key,
      imgUrl: product.imgUrl,
      name: product.name?.replaceAll('&quot;', '"'),
      price: product.price?.replaceAll('&nbsp;', ''),
    };
    return newProduct;
  });
  return newProducts;
}

@Injectable()
export class GetDataService {
  async getData() {
    let config = {
      params: {
        search_performed: 'Y',
        q: 'Perfeo USB 16GB C01G2',
        dispatch: 'products.search',
        items_per_page: 100,
      },
      headers: {
        cookie: 'sid_customer_733c5=a6640fadc4161af7dc5dd92f3c35d5e2-1-C',
      },
    };

    const res = await axios.get('https://technosuccess.ru', config);

    const root = parse(res.data);

    const products: IProductUnit[] = [];

    root.querySelectorAll('form.category-list-item').forEach((item, index) => {
      const product: IProductUnit = {
        key: String(index),
        imgUrl: item.querySelector('.ty-previewer')?.attrs.href,
        name: item.querySelector('.product-title')?.innerText,
        price: item.querySelector('.ty-price-num')?.innerText,
      };
      products.push(product);
    });
    console.log('products count ', products.length);

    return JSON.stringify(fixText(products));
  }

  async getDataBySearchQuery(searchQuery: string) {
    let config = {
      params: {
        search_performed: 'Y',
        q: searchQuery,
        dispatch: 'products.search',
        items_per_page: 1000,
      },
      headers: {
        cookie: 'sid_customer_733c5=a6640fadc4161af7dc5dd92f3c35d5e2-1-C',
      },
    };

    const res = await axios.get('https://technosuccess.ru', config);

    const root = parse(res.data);

    const products: IProductUnit[] = [];

    root.querySelectorAll('form.category-list-item').forEach((item, index) => {
      const imgUrl = item.querySelector('.ty-previewer')?.attrs.href
        ? item.querySelector('.ty-previewer')?.attrs.href
        : 'https://technosuccess.ru/images/noimage/no-image-680x680.jpg';

      if (!item.querySelector('.ty-price-num')?.innerText) {
        throw new Error('price is empty');
      }

      const product: IProductUnit = {
        key: String(index),
        imgUrl: imgUrl,
        name: item.querySelector('.product-title')?.innerText,
        price: item.querySelector('.ty-price-num')?.innerText,
      };
      products.push(product);
    });
    console.log('products count ', products.length);

    return JSON.stringify(fixText(products));
  }

  async getJSONData_experimental() {
    const config2 = {
      params: {
        subcats: 'Y',
        pcode_from_q: 'Y',
        pshort: 'Y',
        pfull: 'Y',
        pname: 'Y',
        pkeywords: 'Y',
        search_performed: 'Y',
        q: 'Perfeo+USB+16GB+C01G2',
        dispatch: 'products.search',
        security_hash: '6f66b9148c93b4785164eb6fc5ac87f2',
      },
      headers: {
        authority: 'technosuccess.ru',
        method: 'POST',
        path: 'subcats=Y&pcode_from_q=Y&pshort=Y&pfull=Y&pname=Y&pkeywords=Y&search_performed=Y&q=Perfeo+USB+16GB+C01G2&dispatch=products.search&security_hash=6f66b9148c93b4785164eb6fc5ac87f2',
        scheme: 'https',
        accept: 'application/json, text/javascript, */*; q=0.01',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'ru,en;q=0.9',
        'cache-control': 'no-cache',
        'content-length': '74',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',

        cookie:
          '__ddg1_=ppaw1GsU36RUYv3fCCM7; _ym_uid=1742715546302875130; _ym_d=1742715546; __ddgid_=3ZJrOygajnOHCd2S; __ddg2_=NLUVF34Vkt9nAFMv; sid_customer_733c5=a6640fadc4161af7dc5dd92f3c35d5e2-1-C; cookies_policy=true; _ym_isad=1; __ddg9_=80.245.118.134; _ym_visorc=w; __ddg10_=1749115983; __ddg8_=UjnLnNGJDksl7kT0',
        origin: 'https://technosuccess.ru',
        pragma: 'no-cache',
        priority: 'u=1, i',
        referer:
          'https://technosuccess.ru/?subcats=Y&pcode_from_q=Y&pshort=Y&pfull=Y&pname=Y&pkeywords=Y&search_performed=Y&q=Perfeo+USB+16GB+C01G2&dispatch=products.search&security_hash=6f66b9148c93b4785164eb6fc5ac87f2',
        'sec-ch-ua':
          '"Chromium";v="134", "Not:A-Brand";v="24", "YaBrowser";v="25.4", "Yowser";v="2.5"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 YaBrowser/25.4.0.0 Safari/537.36',
        'x-requested-with': 'XMLHttpRequest',
      },
    };

    const data: FormData = new FormData();

    data.append('price', 'cat_ids');
    data.append('send_ids', '["9031403","9031404","9031405"]');

    const res2 = await axios.post(
      'https://technosuccess.ru/?subcats=Y&pcode_from_q=Y&pshort=Y&pfull=Y&pname=Y&pkeywords=Y&search_performed=Y&q=Perfeo+USB+16GB+C01G2&dispatch=products.search&security_hash=6f66b9148c93b4785164eb6fc5ac87f2',
      data,
      config2,
    );

    return res2.data;
  }
}

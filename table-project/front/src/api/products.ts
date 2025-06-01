import axios from "axios";
import type { FormState } from "../interface/main";

const address = 'http://localhost:3000';

export async function getProducts(start: number, end: number) {
  const res = await axios.get(address + `/products?_start=${start}&_end=${end}`);
  return res
}

//Здесь мне пришлось использовать "Костыль", 
//чтобы вернуть все существующие заголовки таблицы. Если бы был разрешен бэк, я бы эту логику сделал на бэке
//(Это нужно для того, чтобы во время неполной загрузки таблицы, пользователь мог создать новую строку, зная, какие поля уже есть в ней)
// export async function getHeadFields() {
//   const uniqueKeys = new Set<string>();
//   const res = await axios.get(address + `/products`);
//   res.data.forEach((row: ProductsState) => {
//     Object.keys(row).forEach(key => {
//       uniqueKeys.add(key);
//     });
//   });
//   return [...uniqueKeys];
// }

export async function createProducts(createObj: FormState) {
  const res = await axios.post(address + '/products', createObj);
  return res
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService
{

  catalog = [
    {
      id: '1',
      name: 'bo',
      image: 'cow.png',
      list: [
        'anhconbo__list--1.jpg',
        'anhconbo__list--2.jpg',
        'anhconbo__list--3.jpg',
      ]
    },
    {
      id: '2',
      name: 'sua',
      image: 'sua.png',
      list: [
        'anhsua__list--1.jpg',
        'anhsua__list--2.jpg',
        'anhsua__list--3.jpg',
      ]
    },
    {
      id: '3',
      name: 'traicay',
      image: 'traicay.png',
      list: [
        'anhtraicay__list--1.jpg',
        'anhtraicay__list--2.jpg',
        'anhtraicay__list--3.jpg',
      ]
    },
  ]

  product = [
    {
      id: '1',
      products: [
        {
          id: 'bo_1',
          name: 'SetF1',
          remain: 10,
          price: 50000,
          imageURL: 'boKobe_1.jpg'
        },
        {
          id: 'bo_3',
          name: 'Bò Kobe',
          remain: 80,
          price: 30000,
          imageURL: 'boKobe_2.jpg'
        },
        {
          id: 'bo_2',
          name: 'Xương bò',
          remain: 60,
          price: 80000,
          imageURL: 'boKobe_3.jpg'
        },
        {
          id: 'bo_4',
          name: 'Thịt bò xịn',
          remain: 50,
          price: 300000,
          imageURL: 'boKobe_4.jpg'
        },
        {
          id: 'bo_5',
          name: 'Đĩa thịt bò',
          remain: 30,
          price: 500000,
          imageURL: 'boKobe_5.jpg'
        },
      ]
    },
    {
      id: '2',
      products: [
        {
          id: 'sua_1',
          name: 'Sữa chua',
          remain: 20,
          price: 50000,
          imageURL: 'sua_1.jpeg',
        },
        {
          id: 'sua_2',
          name: 'Sữa hộp',
          remain: 50,
          price: 50000,
          imageURL: 'sua_2.jpeg',
        },
        {
          id: 'sua_3',
          name: 'Sữa hộp to',
          remain: 20,
          price: 50000,
          imageURL: 'suabo.jpeg',
        },
        {
          id: 'sua_4',
          name: 'Sữa tách kem',
          remain: 100,
          price: 30000,
          imageURL: 'suahop.jpeg'
        },
        {
          id: 'sua_5',
          name: 'Sữa bò',
          remain: 50,
          price: 100000,
          imageURL: 'suatachkem.jpeg'
        },
      ]
    },
    {
      id: '3',
      products: [
        {
          id: 'traicay_1',
          name: 'Rau quả',
          remain: 20,
          price: 50000,
          imageURL: 'rauculoai1.jpeg',
        },
        {
          id: 'traicay_2',
          name: 'Cà rốt',
          remain: 50,
          price: 50000,
          imageURL: 'rautuoi.jpg',
        },
        {
          id: 'traicay_3',
          name: 'Rau quả sạch',
          remain: 20,
          price: 50000,
          imageURL: 'rauculoai4.jpeg',
        },
        {
          id: 'traicay_4',
          name: 'Rau quả siêu sạch',
          remain: 100,
          price: 30000,
          imageURL: 'rauculoai3.jpeg',
        },
        {
          id: 'traicay_5',
          name: 'Xà lách',
          remain: 50,
          price: 100000,
          imageURL: 'rauculoai2.jpeg',
        },
      ]
    },
  ]

  constructor() { }

  getAllProduct()
  {
    return this.product;
  };

  getProductById(id)
  {
    for (const item of this.product) {
      if (item.id == id) {
        return item.products;
      }
    }
  };

  getCatalog() 
  {
    return this.catalog;
  }
}

const products = [
  {
    "id": 1,
    "name": "Thor's Hammer"
  },
  {
    "id": 2,
    "name": "Shrinking Suit"
  },
  {
    "id": 3,
    "name": "Captain America's Shield"
  },
]

const sales = [
  {
    "saleId": 1,
    "date": "2022-08-16T19:08:01.000Z",
    "productId": 1,
    "quantity": 5
  },
  {
    "saleId": 1,
    "date": "2022-08-16T19:08:01.000Z",
    "productId": 2,
    "quantity": 10
  },
  {
    "saleId": 2,
    "date": "2022-08-16T19:08:01.000Z",
    "productId": 3,
    "quantity": 15
  }
]

module.exports = {
  products,
  sales,
}
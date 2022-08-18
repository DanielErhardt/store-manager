const servicesMocks = {
  getAllProducts: () => [
    { id: 1, name: 'Martelo de Thor' },
    { id: 2, name: 'Traje de encolhimento' },
    { id: 3, name: 'Escudo do Capitão América' }
  ],

  getProductById: (id) => servicesMocks.getAllProducts().find((product) => product.id === id),

  getProductsByName: (name) => servicesMocks.getAllProducts()
    .filter((product) => product.name.toLowerCase().includes(name.toLowerCase())),
  
  addProduct: (name) => ({ id: 1, name }),

  editProduct: (editedProduct) => editedProduct,

  getAllSales: () => [
  {
    saleId: 1,
    date: '2022-08-18T14:11:50.000Z',
    productId: 1,
    quantity: 5
  },
  {
    saleId: 1,
    date: '2022-08-18T14:11:50.000Z',
    productId: 2,
    quantity: 10
  },
  {
    saleId: 2,
    date: '2022-08-18T14:11:50.000Z',
    productId: 3,
    quantity: 15
  }
],

  getSaleById: (id) => servicesMocks.getAllSales()
    .filter((sale) => sale.saleId === id)
    .map(({date, productId, quantity}) => ({
      date, productId, quantity,
    })),
  
  addSale: (itemsSold) => ({
    id: 1,
    itemsSold,
  }),

  editSale: ({id, itemsUpdated}) => ({id, itemsUpdated}),
};

module.exports = servicesMocks;

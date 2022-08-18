const servicesMocks = {
  getAllProducts: () => [
    { id: 1, name: 'Martelo de Thor' },
    { id: 2, name: 'Traje de encolhimento' },
    { id: 3, name: 'Escudo do Capitão América' }
  ],

  getProductById: (id) => servicesMocks.getAllProducts().find((product) => product.id === id),

  getProductsByName: (name) => servicesMocks.getAllProducts
    .filter((product) => product.name.toLowerCase().includes(name.toLowerCase())),
  
  addProduct: (name) => { id: 1, name },

  editProduct: ({ id, name }) => { id, name },

  getAllSales: () => [],

  getSaleById: (id) => servicesMocks.getAllSales.find((sale) => sale.id === id),
};

module.exports = servicesMocks;

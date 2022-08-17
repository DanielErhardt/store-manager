const queriesMocks = {
  selectAllSalesProducts: () => [
    { sale_id: 1, product_id: 1, quantity: 5 },
    { sale_id: 1, product_id: 2, quantity: 10 },
    { sale_id: 2, product_id: 3, quantity: 15 },
  ],

  selectAllSales: () => [
    { id: 1, date: '2022-08-17T17:19:10.000Z' },
    { id: 2, date: '2022-08-17T17:19:10.000Z' },
  ],
    
  selectAllProducts: () => [
    { id: 1, name: 'Martelo de Thor' },
    { id: 2, name: 'Traje de encolhimento' },
    { id: 3, name: 'Escudo do Capitão América' },
  ],

  selectProductsWhereNameLike: (name) => queriesMocks.selectAllProducts()
    .filter((product) => product.name.toLowerCase().includes(name.toLowerCase())),
  
  selectProductWhereIdEquals: (id) => queriesMocks.selectAllProducts()
    .filter((product) => product.id === id),
  
  selectCountProductsWhereIdIn: (idList) => queriesMocks.selectAllProducts()
    .reduce((count, product) => {
      if (idList.includes(product.id)) count[0]['COUNT(*)'] += 1;
      return count;
    }, [{ 'COUNT(*)': 0 }]),
  
  selectSaleWhereIdEquals: (id) => queriesMocks.selectAllSales()
    .filter((sale) => sale.id === id),
  
  selectSalesProductsWhereSaleIdEquals: (saleId) => queriesMocks.selectAllSalesProducts()
    .filter((saleProduct) => saleProduct.sale_id === saleId),

  resultSetHeader: {
    insertId: 1,
  },
};

module.exports = queriesMocks;

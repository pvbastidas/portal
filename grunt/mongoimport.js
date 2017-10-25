module.exports = {
  options: {
  db : 'enerwi',
  host : '127.0.0.1', //optional
  port: '27017', //optional
  collections :
    [
      {
        name : 'charges',
        type : 'json',
        file : 'fixtures/charges.json',
        jsonArray : true,
        upsert : true
      },
      {
        name : 'users',
        type : 'json',
        file : 'fixtures/users.json',
        jsonArray : true,
        upsert : true
      },
      {
        name : 'stores',
        type : 'json',
        file : 'fixtures/stores.json',
        jsonArray : true,
        upsert : true
      },
      {
        name : 'promotions',
        type : 'json',
        file : 'fixtures/promotions.json',
        jsonArray : true,
        upsert : true
      }
    ]
  }
}

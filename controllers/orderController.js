const getAllOrders = (req, res) => {
  res.send('get all orders');
};
const getSingleOrder = (req, res) => {
  res.send('get single order');
};
const getCurrentUserOrder = (req, res) => {
  res.send('get current user order');
};
const createOrder = (req, res) => {
  res.send('create order');
};
const updateOrder = (req, res) => {
  res.send('update order');
};

module.exports =
  {
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrder,
    updateOrder,
    createOrder,
  };

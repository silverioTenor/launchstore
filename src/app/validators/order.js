import Order from './../models/Order';

const OrderValidator = {
  async updateStatus(req, res, next) {
    try {
      const { action, id } = req.params;

      const acceptedActions = ['sold', 'canceled'];

      if (!acceptedActions.includes(action)) return res.redirect('/orders/sales?status=400');

      const orderDB = new Order();
      const order = await orderDB.getBy({ where: { id } });

      if (order?.status != 'open') return res.redirect('/orders/sales?status=400');

      req.order = {
        val: { id: order.id, column: "id" },
        fields: { status: action }
      }

      next();

    } catch (error) {
      console.log(`Unexpected error in updateStatus VALIDATOR: ${error}`);

      return res.redirect('/orders/sales?status=400');
    }
  }
}

export default OrderValidator;
const { connect, Schema, model, disconnect } = require('mongoose');

async function main() {
  try {
    await connect('mongodb://localhost:27017/hello');
    console.log('[egg-mongoose] connected successfully');

    const ProductSchema = new Schema({
      name: { type: String },
      price: { type: Number },
    });
    const ProductModel = model('Product', ProductSchema);

    const result = await ProductModel.create({ name: 'xiaoming', price: '30' });
    console.log(result);
  } catch (err) {
    console.error(err);
  } finally {
    await disconnect();
  }
}

main();

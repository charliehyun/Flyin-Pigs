export async function connectToDatabase(uri: string) {
    const mongoose = require('mongoose');
    const res = await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology:true});
    const {db} = mongoose.connection;
}

const { set, connect } = require('mongoose');

const connectDatabase = () => {
  set('strictQuery', true);

  connect('mongodb://localhost:27017/suraj-learning')
    .then(() => console.log("✅ Database Successfully Connected"))
    .catch((err) => console.error("❌ Database failed to connect:", err));
};

module.exports = connectDatabase;

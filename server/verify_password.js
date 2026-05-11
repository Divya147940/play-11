const bcrypt = require('bcryptjs');

const hash = '$2b$10$J6t7E1TDx/eacz2OfP2nyuJpkMspNGMCqmRR9pyl/dPF.TYsKWcUW';
const password = '123';

bcrypt.compare(password, hash).then(res => {
  console.log("Does '123' match the hash?", res);
});

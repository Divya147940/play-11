const bcrypt = require('bcryptjs');
const hash = '$2b$10$J6t7E1TDx/eacz2OfP2nyuJpkMspNGMCqmRR9pyl/dPF.TYsKWcUW';

bcrypt.compare('123', hash).then(res => {
  console.log('Result for "123":', res);
});

bcrypt.compare('admin', hash).then(res => {
  console.log('Result for "admin":', res);
});

bcrypt.compare('admin123', hash).then(res => {
  console.log('Result for "admin123":', res);
});

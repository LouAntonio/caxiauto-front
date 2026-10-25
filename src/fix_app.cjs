const fs = require('fs');
const path = 'App.jsx';
let content = fs.readFileSync(path, 'utf8');

// Fix the requireRole line to add allowSellerDocs
const oldCode = `requireRole={['SELLER', 'ADMIN']}`;
const newCode = `requireRole={['SELLER', 'ADMIN']} allowSellerDocs`;

content = content.replace(oldCode, newCode);
fs.writeFileSync(path, content);
console.log('Updated App.jsx');
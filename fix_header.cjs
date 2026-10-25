import fs from 'fs';

const path = 'src/components/Header.jsx';
let content = fs.readFileSync(path, 'utf8');

const oldCode = `{user.role === 'SELLER' || user.sellerDocs ? 'Minha Loja' : 'Vender'}`;
const newCode = `{user.role === 'SELLER' ? 'Minha Loja' : 'Vender'}`;

content = content.replace(oldCode, newCode);
fs.writeFileSync(path, content);
console.log('Updated Header.jsx');
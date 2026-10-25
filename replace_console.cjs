const fs = require('fs');
const path = require('path');

const FRONT_SRC = 'src';

function replaceConsoleErrorInFile(filePath) {
	let content = fs.readFileSync(filePath, 'utf8');
	let modified = false;
	
	// Add import if not present
	if (!content.includes("import logger from '../utils/logger'") && 
	    !content.includes("import logger from '../../utils/logger'") &&
	    !content.includes("import logger from '../../../utils/logger'")) {
		
		// Find the import section
		const importMatch = content.match(/(^import .+;\n)+/m);
		if (importMatch) {
			const importEnd = importMatch.index + importMatch[0].length;
			// Determine relative path to logger
			const depth = filePath.split('/').length - 2; // src/pages/.../file.jsx
			let loggerPath = '../utils/logger';
			if (depth > 2) loggerPath = '../../utils/logger';
			if (depth > 3) loggerPath = '../../../utils/logger';
			
			content = content.slice(0, importEnd) + `import logger from '${loggerPath}';\n` + content.slice(importEnd);
			modified = true;
		}
	}
	
	// Replace console.error
	const patterns = [
		// console.error('message', error)
		/console\.error\((['"`])([^'"`]+)\1\s*,\s*error\)/g,
		// console.error('message', errorVar)
		/console\.error\((['"`])([^'"`]+)\1\s*,\s*(\w+)\)/g,
		// console.error('message')
		/console\.error\((['"`])([^'"`]+)\1\)/g,
		// console.error(error)
		/console\.error\((\w+)\)/g
	];
	
	let newContent = content;
	
	// Replace console.error('message', error) -> logger.error('message', { error: error.message })
	newContent = newContent.replace(/console\.error\((['"`])([^'"`]+)\1\s*,\s*error\)/g, "logger.error('$2', { error: error.message })");
	
	// Replace console.error('message', errorVar) -> logger.error('message', { error: errorVar?.message || errorVar })
	newContent = newContent.replace(/console\.error\((['"`])([^'"`]+)\1\s*,\s*(\w+)\)/g, "logger.error('$2', { error: $3?.message || $3 })");
	
	// Replace console.error('message') -> logger.error('message')
	newContent = newContent.replace(/console\.error\((['"`])([^'"`]+)\1\)/g, "logger.error('$2')");
	
	// Replace console.error(error) -> logger.error(error.message || error)
	newContent = newContent.replace(/console\.error\((\w+)\)/g, "logger.error($1?.message || $1)");
	
	if (newContent !== content) {
		fs.writeFileSync(filePath, newContent);
		return true;
	}
	
	return false;
}

function walkDir(dir) {
	let count = 0;
	const files = fs.readdirSync(dir);
	
	for (const file of files) {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);
		
		if (stat.isDirectory()) {
			count += walkDir(filePath);
		} else if (file.endsWith('.jsx') || file.endsWith('.js')) {
			try {
				if (replaceConsoleErrorInFile(filePath)) {
					console.log(`Updated: ${filePath}`);
					count++;
				}
			} catch (e) {
				console.error(`Error processing ${filePath}:`, e.message);
			}
		}
	}
	
	return count;
}

console.log('Starting console.error replacement...');
const count = walkDir(FRONT_SRC);
console.log(`Done! Updated ${count} files.`);
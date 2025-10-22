const fs = require('fs');
const path = require('path');

// Directories to search for files
const directories = [
  path.join(__dirname, 'src', 'pages'),
  path.join(__dirname, 'src', 'components')
];

// Function to update imports in a file
function updateImports(filePath) {
  try {
    // Read the file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file already imports our custom Grid
    if (content.includes("import { Grid } from ") || 
        content.includes("import Grid from ")) {
      console.log(`Skipping ${filePath} - already has Grid import`);
      return;
    }
    
    // Check if the file imports Grid from @mui/material
    const muiGridImport = content.match(/import\s+{[^}]*Grid[^}]*}\s+from\s+['"]@mui\/material['"]/);
    if (!muiGridImport) {
      console.log(`Skipping ${filePath} - no MUI Grid import found`);
      return;
    }
    
    // Get the relative path to the components/common directory
    const relativePath = path.relative(path.dirname(filePath), path.join(__dirname, 'src', 'components', 'common'))
      .replace(/\\/g, '/');
    
    // Ensure the path starts with ./ or ../
    const importPath = relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
    
    // Replace the MUI Grid import with our custom Grid import
    let updatedContent = content.replace(
      /import\s+{([^}]*)Grid([^}]*)}\s+from\s+['"]@mui\/material['"]/,
      (match, before, after) => `import {${before}${after}} from '@mui/material';\nimport { Grid } from '${importPath}'`
    );
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`Updated ${filePath}`);
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
  }
}

// Function to recursively find TypeScript/JavaScript files
function findFiles(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findFiles(filePath);
    } else if (/\.(tsx?|jsx?)$/.test(file)) {
      updateImports(filePath);
    }
  });
}

// Process all directories
directories.forEach(dir => {
  console.log(`Processing directory: ${dir}`);
  findFiles(dir);
});

console.log('Grid component update completed!');

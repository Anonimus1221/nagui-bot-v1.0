/**
 * Script para validar todos los comandos
 * Verifica sintaxis y estructuras básicas
 */

const fs = require('fs-extra');
const path = require('path');

const complementosPath = path.join(__dirname, 'complementos');
let erroresEncontrados = [];
let comandosValidos = 0;

function validarComando(filePath, fileName) {
  try {
    const contenido = fs.readFileSync(filePath, 'utf-8');
    
    // Verificar que tenga module.exports
    if (!contenido.includes('module.exports')) {
      erroresEncontrados.push(`${fileName}: Falta module.exports`);
      return false;
    }

    // Verificar estructura básica
    if (!contenido.includes('nome:') && !contenido.includes('nomes:')) {
      erroresEncontrados.push(`${fileName}: Falta propiedad 'nome' o 'nomes'`);
      return false;
    }

    if (!contenido.includes('run:') && !contenido.includes('run (')) {
      erroresEncontrados.push(`${fileName}: Falta función 'run'`);
      return false;
    }

    // Intentar cargar el módulo
    try {
      delete require.cache[require.resolve(filePath)];
      require(filePath);
      comandosValidos++;
      return true;
    } catch (loadError) {
      erroresEncontrados.push(`${fileName}: Error al cargar - ${loadError.message.split('\n')[0]}`);
      return false;
    }

  } catch (error) {
    erroresEncontrados.push(`${fileName}: Error de lectura - ${error.message}`);
    return false;
  }
}

console.log('🔍 Verificando todos los comandos...\n');

const categories = fs.readdirSync(complementosPath);

for (const category of categories) {
  const categoryPath = path.join(complementosPath, category);
  
  if (fs.statSync(categoryPath).isDirectory()) {
    const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.js'));
    
    for (const file of files) {
      const filePath = path.join(categoryPath, file);
      validarComando(filePath, `${category}/${file}`);
    }
  }
}

console.log(`\n✅ Comandos válidos: ${comandosValidos}/84`);

if (erroresEncontrados.length > 0) {
  console.log(`\n❌ Errores encontrados (${erroresEncontrados.length}):\n`);
  erroresEncontrados.forEach(error => console.log(`  • ${error}`));
  process.exit(1);
} else {
  console.log('\n🎉 ¡Todos los comandos están correctos!');
  process.exit(0);
}

const ua = process.env.npm_config_user_agent || '';
const isYarn = ua.includes('yarn');

if (!isYarn) {
  console.error('\n❌ Use Yarn para instalar dependências.\n');
  console.error('✅ Rode: corepack enable');
  console.error('✅ Depois: yarn install\n');
  process.exit(1);
}

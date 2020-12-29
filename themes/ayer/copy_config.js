const fs = require('fs')

const configPath = '../../_config.ayer.yml'
if (!fs.existsSync(configPath)) {
  fs.writeFileSync(configPath, fs.readFileSync('./_config.yml'))
}

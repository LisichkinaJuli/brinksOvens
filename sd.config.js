import { register } from '@tokens-studio/sd-transforms';
import StyleDictionary from 'style-dictionary';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { dirname, join } from 'node:path';
import {
  logBrokenReferenceLevels,
  logVerbosityLevels,
  logWarningLevels,
} from 'style-dictionary/enums';

// 1. Регистрируем трансформы от Tokens Studio в Style Dictionary
register(StyleDictionary);

async function run() {
  const TOKENS_SOURCE = 'src/tokens/tokens.json';
  const BUILD_DIR = 'src/tokens/build';

  try {
    // 2. Читаем исходный файл с токенами
    const tokens = JSON.parse(await readFile(TOKENS_SOURCE, 'utf-8'));;

    // Деструктуризация: отделяем мета-данные ($themes, $metadata) от самих наборов (sets)
    const { $themes, $metadata, ...sets } = tokens;

    // 3. Функция для сохранения отдельных наборов токенов в файлы
    const persistSet = async ([setName, setTokens]) => {
      if (setName.startsWith('$')) {
        return; 
      }
      const filePath = join(BUILD_DIR, `${setName}.json`);
      
      // Создаем директорию (recursive: true не кидает ошибку, если папка уже есть)
      await mkdir(dirname(filePath), { recursive: true });
      
      // Записываем форматированный JSON
      await writeFile(filePath, JSON.stringify(setTokens, null, 2), 'utf-8');
      console.log(`✔ Файл записан: ${filePath}`);
    };

    // Сохраняем все сеты параллельно
    await Promise.all(Object.entries(sets).map(persistSet));

    // 4. Настройка Style Dictionary
    const sd = new StyleDictionary({
      // Указываем путь к только что созданным файлам
      source: [`${BUILD_DIR}/*.json`],
      
      log: {
        warnings: logWarningLevels.warn,
        verbosity: logVerbosityLevels.default,
        errors: {
          brokenReferences: logBrokenReferenceLevels.throw,
        }
      },

      // Важно для версий sd-transforms 0.16.0+
      preprocessors: ['tokens-studio'],

      platforms: {
        css: {
          // Используем готовую группу трансформов для Tokens Studio
          transformGroup: 'tokens-studio', 
          transforms: ['name/kebab'],
          buildPath: 'src/tokens/',
          files: [
            {
              destination: 'variables.css',
              format: 'css/variables',
            },
          ],
        },
      },
    });

    // 5. Очистка и сборка
    await sd.cleanAllPlatforms();
    await sd.buildAllPlatforms();
    
    console.log('\n🚀 Сборка успешно завершена!');

  } catch (error) {
    console.error('❌ Ошибка в процессе сборки:', error);
    process.exit(1);
  }
}

run();
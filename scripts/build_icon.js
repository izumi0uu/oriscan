const fs = require('fs')
const path = require('path')
const promisify = require('util').promisify

const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)
const mkdir = promisify(fs.mkdir)
const rename = promisify(fs.rename)

const PUBLIC_PATH = path.resolve(__dirname, '../public') // 预期的 public 目录，不需要改动
const IMAGE_PATH = path.resolve(__dirname, '../public/images') // 预期的 images 目录，不需要改动
const IMAGE_OUT_FILE = path.resolve(__dirname, '../utils/images.ts') // 预期的 images类型导出文件，不需要改动
const COMMON_IMAGE_PATH = path.resolve(__dirname, '../public/images/common') // 不存在 images 文件时，创建出通用的存放图片的文件夹，不需要改动

/**
 * @dev 用于兼容 oriscan这类public 目录结构不复合规范的情况，会自动移动文件夹和文件到 public/images 和 public/images/common
 */
async function moveFiles() {
  try {
    if (!fs.existsSync(IMAGE_PATH)) await mkdir(IMAGE_PATH, { recursive: true })

    if (!fs.existsSync(COMMON_IMAGE_PATH)) await mkdir(COMMON_IMAGE_PATH, { recursive: true })

    const filesAndFolders = await readdir(PUBLIC_PATH)

    for (let item of filesAndFolders) {
      const itemPath = path.join(PUBLIC_PATH, item)
      const stats = await stat(itemPath)
      if (stats.isDirectory() && item !== 'images') {
        // 如果是文件夹，移动到 public/images
        const targetDirPath = path.join(IMAGE_PATH, item)
        await rename(itemPath, targetDirPath)
      } else if (stats.isFile()) {
        // 如果是文件，移动到 public/images/common
        const targetFilePath = path.join(COMMON_IMAGE_PATH, item)
        await rename(itemPath, targetFilePath)
      }
    }
    console.log('Files and folders have been moved successfully.')
  } catch (error) {
    console.error('An error occurred:', error)
  }
}

function buildIcon() {
  const iconPath = path.resolve(__dirname, '../public/images/icons')

  const outFile = path.resolve(__dirname, '../utils/icons.ts')
  const files = fs.readdirSync(iconPath).filter((x) => !x.startsWith('.'))

  const IconType = `export enum IconType {
${files.map((file) => ' ' + file.split('.')[0].toUpperCase() + " = '" + file + "'").join(',\n')}
}
`

  fs.writeFileSync(outFile, IconType)
}

const buildImage = async () => {
  if (!fs.existsSync(IMAGE_PATH)) await moveFiles()
  const dirs = fs.readdirSync(IMAGE_PATH).filter((x) => !x.startsWith('.'))
  const dirCode = dirs
    .map((dir) => {
      const dirPath = path.resolve(IMAGE_PATH, dir)
      const files = fs.readdirSync(dirPath).filter((x) => !x.startsWith('.'))
      return `const ${dir.toUpperCase()} = {
    ${files
      .map((file) => {
        if (file.indexOf('.') >= 0) {
          return `'${(/^\d/.test(file) ? 'D_' + file : file)
            .toUpperCase()
            .replace('.', '_')
            .replace('-', '_')}': '/images/${dir}/${file}'`
        } else {
          const dirPath = path.resolve(IMAGE_PATH, dir, file)
          const files1 = fs.readdirSync(dirPath).filter((x) => !x.startsWith('.'))
          return files1
            .map(
              (x) =>
                `'${(file + '_' + x)
                  .toUpperCase()
                  .replace('.', '_')
                  .replace('-', '_')}': '/images/${dir}/${file}/${x}'`,
            )
            .join(',\n  ')
        }
      })
      .join(',\n  ')},
  }`
    })
    .join('\n')

  if (!fs.existsSync(IMAGE_PATH)) fs.mkdirSync(path.resolve(IMAGE_PATH, 'common'), { recursive: true }) // 兼容不存在 images 目录的情况
  const imageCode = `
  export const Images = {
    ${dirs.map((dir) => dir.toUpperCase()).join(',\n  ')},
  }
  `
  const code = dirCode + imageCode
  fs.writeFileSync(IMAGE_OUT_FILE, code)
}

buildImage()
// buildIcon()

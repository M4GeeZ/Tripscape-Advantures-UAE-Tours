import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')
const imagesDir = path.join(root, 'client', 'public', 'images')
const outputFile = path.join(root, 'client', 'src', 'generatedImages.js')

const files = fs.existsSync(imagesDir)
  ? fs.readdirSync(imagesDir).filter((file) => fs.statSync(path.join(imagesDir, file)).isFile())
  : []

const normalize = (value) => value.toLowerCase().replace(/\.[^.]+$/, '')

function findByPrefixes(prefixes, fallback) {
  for (const prefix of prefixes) {
    const normalizedPrefix = normalize(prefix)
    const match = files.find((file) => {
      const normalizedFile = normalize(file)
      return normalizedFile === normalizedPrefix || normalizedFile.startsWith(normalizedPrefix)
    })
    if (match) return `/images/${encodeURIComponent(match)}`
  }
  return fallback
}

const map = {
  logoGold: findByPrefixes(['imgi_1_logo-gold', 'logo-gold'], '/images/logo-gold.svg'),
  logoWhite: findByPrefixes(['imgi_33_logo-white', 'logo-white'], '/images/logo-white.svg'),
  navLogoGold: findByPrefixes(['nav-logo-gold'], '/images/nav-logo-gold.png'),
  navLogoWhite: findByPrefixes(['nav-logo-white'], '/images/nav-logo-white.png'),

  heroDesert: findByPrefixes(['hero-desert', 'imgi_2_img-01'], '/images/hero-desert.webp'),
  heroCity: findByPrefixes(['hero-city', 'imgi_12_img-01'], '/images/hero-city.webp'),
  heroCamp: findByPrefixes(['hero-camp', 'imgi_10_img-02'], '/images/hero-camp.webp'),
  heroCamel: findByPrefixes(['hero-camel'], '/images/hero-camel.webp'),

  tourQuad: findByPrefixes(['imgi_3_img-02'], '/images/tour-quad.webp'),
  tourCamp: findByPrefixes(['imgi_4_img-02'], '/images/tour-camp.webp'),
  tourVip: findByPrefixes(['imgi_5_img-04'], '/images/tour-vip.webp'),
  tourGate: findByPrefixes(['imgi_7_img-02'], '/images/tour-gate.webp'),
  tourCamel: findByPrefixes(['imgi_8_img-02'], '/images/tour-camel.webp'),
  tourCaravan: findByPrefixes(['imgi_9_img-02'], '/images/tour-private.webp'),
  tourPrivate: findByPrefixes(['imgi_10_img-02'], '/images/tour-private.webp'),

  cityDubai: findByPrefixes(['city-01-dubai-burj-al-arab'], '/images/city-01-dubai-burj-al-arab.webp'),
  cityBurj: findByPrefixes(['city-02-dubai-burj-khalifa'], '/images/city-02-dubai-burj-khalifa.webp'),
  cityAbuDhabi: findByPrefixes(['city-03-abu-dhabi'], '/images/city-03-abu-dhabi.webp'),
  citySix: findByPrefixes(['city-04-six-emirates'], '/images/city-04-six-emirates.webp'),
  cityOldDubai: findByPrefixes(['city-05-old-dubai'], '/images/city-05-old-dubai.webp'),
  cityCorniche: findByPrefixes(['city-06-mosque-corniche'], '/images/city-06-mosque-corniche.webp'),

  adventureBuggy: findByPrefixes(['imgi_15_stock-06'], '/images/adv-buggy.webp'),
  adventureDunes: findByPrefixes(['imgi_15_stock-08'], '/images/adv-dunes.webp'),
  adventureQuad: findByPrefixes(['imgi_16_stock-10'], '/images/adv-quad.webp'),
  adventureEvening: findByPrefixes(['imgi_17_stock-12'], '/images/adv-evening.webp'),
  adventureDrive: findByPrefixes(['imgi_18_img-02'], '/images/adv-dune-drive.webp'),
  adventureDouble: findByPrefixes(['imgi_19_img-02'], '/images/adv-double.webp'),

  heliPalm: findByPrefixes(['imgi_20_img-01'], '/images/heli-palm.webp'),
  heliMarina: findByPrefixes(['imgi_21_img-02'], '/images/heli-marina.webp'),
  heliVision: findByPrefixes(['imgi_22_img-03'], '/images/heli-vision.webp'),
  heliPrivate: findByPrefixes(['imgi_23_img-04'], '/images/heli-private.webp'),
  heliPremium: findByPrefixes(['imgi_20_img-01'], '/images/heli-premium.webp'),

  attractionBurj: findByPrefixes(['imgi_24_img-01'], '/images/attr-burj.webp'),
  attractionAquarium: findByPrefixes(['imgi_26_img-02'], '/images/attr-aquarium.webp'),
  attractionMosque: findByPrefixes(['imgi_27_img-01'], '/images/attr-mosque.webp'),
  attractionMuseum: findByPrefixes(['imgi_30_img-01'], '/images/attr-museum.webp'),

  promo: findByPrefixes(['imgi_28_img-01', 'imgi_9_img-02'], '/images/promo-bg.webp'),
  aboutPrimary: findByPrefixes(['imgi_14_img-01'], '/images/about-1.webp'),
  aboutSecondary: findByPrefixes(['imgi_13_img-02'], '/images/about-2.webp'),

  blogOne: findByPrefixes(['imgi_30_img-01'], '/images/blog-1.webp'),
  blogTwo: findByPrefixes(['imgi_31_img-05'], '/images/blog-2.webp'),
  blogThree: findByPrefixes(['imgi_32_img-04'], '/images/blog-3.webp')
}

const contents = `// Auto-generated from client/public/images.\n// Run \"npm run prepare:images\" after adding or renaming images.\nexport const images = ${JSON.stringify(map, null, 2)}\n`

fs.writeFileSync(outputFile, contents, 'utf8')
console.log(`[images] mapped ${Object.keys(map).length} website image slots from ${files.length} files`)

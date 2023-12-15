const NodeStl = require('node-stl');
const path = require('path');
const fs = require('fs');

// Constant variables used for shopping & delivery, product customization
// NOTE: change these values if you want to use these features
const EMAIL_HOST_NAME = 'smtp.strato.de';
const DOWNLOAD_STLS_URL = '';
const EMAIL_USER_NAME = 'info@grabitzky.com';
const EMAIL_PASSWORD = 'Julian@20399$';
const PAYLIKE_ID = '';
const SESSION_SECRET = 'oKTgDM!A%fXH%J)Vf=90swRXnrJIZH80(vpeL8YV_zt2UdO!dbCDjQJWfuf:iF8R3O';
const LIT_FORMS = ['Domború', 'Homorú', 'Sima'];
const LIT_PRICES = {'100': 1990, '150': 2990, '200': 3990};
const LAYER_WIDTH_VALUES = [0.12, 0.2, 0.28];
const INFILL_VALUES = [];
const PRINT_MATERIALS = ['PLA', 'ABS', 'PETG', 'TPU'];
const LAYER_WIDTH_VALUES_SLA = [0.05, 0.07, 0.1];
const INFILL_VALUES_SLA = ['Üreges', 'Tömör'];
const PRINT_TECHS = ['FDM', 'SLA'];
const MIN_PRICE = 1990;
const BOX_SIZES = [[18, 16, 5], [18, 7, 12], [15, 20, 15], [15, 20, 25], [30, 30, 20]];
const BILLINGO_API_KEY = '';
const BILLINGO_PRODNUM_1 = 13026788; // 6821423 custom print
const BILLINGO_PRODNUM_2 = 13026804; // 6821424 lithophane
const BILLINGO_PRODNUM_3 = 13026935; // 6821436 fix product
const BILLINGO_BLOCK_ID = 183650; // 103163
const BILLINGO_CARD_NUM = 150869; // 88880
const BILLINGO_COD_ID = 5339382; // 6821455
const BILLINGO_DELIVERY_ID = 13027010; // 6821453
const DISCOUNT = 0.97;

function basePath(p) {
  return p.replace(path.join('src', 'js', 'includes'), '');
}

const DEFAULT_CP_IMG = path.join(basePath(__dirname), 'src', 'images', 'defaultStl.png');

const PACKAGE_WIDTH = 3; // in cm
const SLA_MULTIPLIER = 1.9;
const BA_NUM = '11709026-20003809';
const BA_NAME = 'Frankli Márk';
const PRINT_SIZES_PLA = [470, 450, 450];
const PRINT_SIZES_SLA = [250, 220, 120];
const PACKETA_API_PASSWORD = '';
const MAX_QUANTITY = 100;
const MIN_QUANTITY = 1;

const DR = __dirname.replace(path.join('js', 'includes'), '');

const FILES_TO_CACHE = [
  path.join(DR, 'animate', 'animate.css'),
  path.join(DR, 'js', 'includes', 'jq.js'),
  path.join(DR, 'js', 'includes', 'lazyLoad.js')
];

const COUNTRIES = ["Albánia", "Andorra", "Argentína", "Ausztrália", "Ausztria", "Azerbajdzsán",
    "Belgium", "Bosznia-Hercegovina", "Brazília", "Bulgária", "Kanada", "Chile", "Kína",
    "Horvátország", "Kuba", "Ciprus", "Cseh köztársaság", "Dánia", "Egyiptom", "Észtország",
    "Faroe-szigetek", "Finnország", "Franciaország", "Grúzia", "Németország", "Gibraltár",
    "Görögország", "Hong Kong", "Magyarország", "Izland", "India", "Indonézia", "Irán", "Irak",
    "Írország", "Izrael", "Olaszország", "Japán", "Kazahsztán", "Dél-Koreai Köztársaság",
    "Kuwait",
    "Lettország", "Liechtenstein", "Litvánia", "Luxemburg", "Makedónia", "Malajzia", "Málta",
    "Mexikó", "Monaco", "Marokkó", "Hollandia", "Új-Zéland", "Norvégia", "Paraguay",
    "Fülöp-szigetek", "Lengyelország", "Portugália", "Katar", "Románia", "Oroszország",
    "San Marino", "Szaud-Arábia", "Szlovákia", "Szlovénia", "Dél-afrikai Köztársaság",
    "Spanyolország", "Svédország", "Svájc", "Thaiföld", "Tunézia", "Törökország",
    "Türkmenisztán",
    "Ukrajna", "Egyesült Arab Emirátusok", "Egyesült Királyság", "Amerikai Egyesült Államok",
    "Uruguay", "Üzbégisztán", "Vatikáni városállam", "Venezuela", "Vietnám", "Szerbia",
    "Koszovó",
    "Montenegró"];

const FIX_ADD_CPRINT = 500;
const SUCCESS_RETURN = '{"success": true}';
const OWNER_EMAILS = ['info@grabitzky.com']; //['mark@pearscom.com', 'turcsanmate113@gmail.com'];

// For printing
const M = 12; // cost/min in forint
const DENSITY = 1.24; // PLA density is 1.27 g/cm^3
const PRICE_PER_GRAMM = 9.34;

function smoothPrice(price) {
  if (price <= 8000) {
    return Math.round(price);
  } else {
    return Math.round(price);
    //return Math.round(Math.sqrt(price) * 110);
  }
}

function calcCPPrice(volume, area) {
  let outerShellVolume = 0.12 * area; // 100% infill
  let innerVolume = volume - outerShellVolume; // 20% infill
  let finalPrice = Math.round(outerShellVolume * DENSITY + innerVolume * DENSITY * 0.2) * PRICE_PER_GRAMM * 7;
  return finalPrice < MIN_PRICE ? MIN_PRICE : finalPrice;
}

// Get volume and area
function getCoords(path) {
  let stl = new NodeStl(path, {density: DENSITY}); 
  let volume = stl.volume;
  let area = stl.area / 100;
  return [volume, area];
}

// Constants for reference page
const NUM_OF_COLS = 3;
const NUM_OF_IMGS = 3;

const REF_BG = `
  data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAA0NDQ0ODQ4QEA4UFhMWFB4bGRkbHi0gIiAiIC1EKjIqKjIqRDxJOzc7STxsVUtLVWx9aWNpfZeHh5e+tb75+f8BDQ0NDQ4NDhAQDhQWExYUHhsZGRseLSAiICIgLUQqMioqMipEPEk7NztJPGxVS0tVbH1pY2l9l4eHl761vvn5///CABEIA+cD5wMBIgACEQEDEQH/xAAVAAEBAAAAAAAAAAAAAAAAAAAABf/aAAgBAQAAAACyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAhAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//EABQBAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH//xAAUEAEAAAAAAAAAAAAAAAAAAADQ/9oACAEBAAE/AHQn/8QAFBEBAAAAAAAAAAAAAAAAAAAAsP/aAAgBAgEBPwB4H//EABQRAQAAAAAAAAAAAAAAAAAAALD/2gAIAQMBAT8AeB//2Q==`;

// NOTE: change ADMIN constants if you want to use that feature
// Admin URLs (marked with capital letters), password & username
const ADMIN_LOGIN_URL = '/adminLogin';
const CONF_EMAIL_URL = '/sendConfEmail';
const STATUS_UPDATE_URL = '/updateOrderStatus';
const ADMIN_PAGE_ACCESS = '/lick_weebshit';
const ADMIN_UNAME = 'weebshit';
const ADMIN_PASSWORD = 'HJ!RCY~KuK(xhX2-';


const LAZY_LOAD = `
  <script src="/js/includes/lazyLoad.js"></script>
  <script type="text/javascript">
    var ll = new LazyLoad({
      elements_selector: ".lazy",
      callback_loaded: (el) => el.style.backgroundColor = 'white'
    });
  </script>
`;

module.exports = {
  'countries': COUNTRIES,
  'minPrice': MIN_PRICE,
  'fixAddCprint': FIX_ADD_CPRINT,
  'successReturn': SUCCESS_RETURN,
  'calcCPPrice': calcCPPrice,
  'getCoords': getCoords,
  'M': M,
  'numOfCols': NUM_OF_COLS,
  'numOfImgs': NUM_OF_IMGS,
  'filesToCache': FILES_TO_CACHE,
  'refBg': REF_BG,
  'litForms': LIT_FORMS,
  'litPrices': LIT_PRICES,
  'adminLoginUrl': ADMIN_LOGIN_URL,
  'confEmailUrl': CONF_EMAIL_URL,
  'statusUpdateUrl': STATUS_UPDATE_URL,
  'adminPageAccess': ADMIN_PAGE_ACCESS,
  'adminUname': ADMIN_UNAME,
  'adminPassword': ADMIN_PASSWORD,
  'ownerEmails': OWNER_EMAILS,
  'printMaterials': PRINT_MATERIALS,
  'emailHostName': EMAIL_HOST_NAME,
  'emailUsername': EMAIL_USER_NAME,
  'emailPassword': EMAIL_PASSWORD,
  'paylikeID': PAYLIKE_ID,
  'sessionSecret': SESSION_SECRET,
  'layerWidthValuesSLA': LAYER_WIDTH_VALUES_SLA,
  'infillValuesSLA': INFILL_VALUES_SLA,
  'printTechs': PRINT_TECHS,
  'boxSizes': BOX_SIZES,
  'billingoProdnum1': BILLINGO_PRODNUM_1,
  'billingoProdnum2': BILLINGO_PRODNUM_2,
  'billingoProdnum3': BILLINGO_PRODNUM_3,
  'billingoBlockID': BILLINGO_BLOCK_ID,
  'billingoCardNum': BILLINGO_CARD_NUM,
  'billingoAPIKey': BILLINGO_API_KEY,
  'billingoCodID': BILLINGO_COD_ID,
  'billingoDeliveryID': BILLINGO_DELIVERY_ID,
  'packageWidth': PACKAGE_WIDTH,
  'slaMultiplier': SLA_MULTIPLIER,
  'baNum': BA_NUM,
  'baName': BA_NAME,
  'printSizesPLA': PRINT_SIZES_PLA,
  'printSizesSLA': PRINT_SIZES_SLA,
  'lazyLoad': LAZY_LOAD,
  'downloadSTLsURL': DOWNLOAD_STLS_URL,
  'packetaAPIPassword': PACKETA_API_PASSWORD,
  'minQuantity': MIN_QUANTITY,
  'maxQuantity': MAX_QUANTITY,
  'discount': DISCOUNT,
  'smoothPrice': smoothPrice,
  'defaultCpImg': DEFAULT_CP_IMG,
  'basePath': basePath
};

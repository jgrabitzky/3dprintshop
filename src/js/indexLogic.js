const produceShowcaseOutput = require('./includes/itemGenerator.js');
const buildCategory = require('./buildCategory.js');

const CONTACT_FORM = `
  <div class="mtsix" style="width: calc(100% - 40px); max-width: 1300px; margin: 0 auto;">
    <hr class="hrStyle">
    <h2 class="gotham font26 align fontNorm" id="getQuote">
    Kontakt
    </h2>
    <h2 class="align font18 lh fontNorm gothamNormal">
    Für individuelle Drucke, Fragen oder besondere Wünsche können Sie sich gerne an uns wenden!
    </h2>
    <div class="flexDiv" style="flex-wrap: wrap;" id="normalDiv">
      <input type="text" class="dFormField" id="name" placeholder="Name" value="">
      <input type="email" class="dFormField" id="email" placeholder="Email">
      <input type="text" class="dFormField protmob" id="mobile"
        placeholder="Telefon" value="">
      <textarea placeholder="CAD-Modell-URL, Produkterwartungen: Material, Farbe, Technologie usw."
        id="message" class="dFormField" style="width: 100%; height: 100px;"></textarea>
    </div>
    <button class="fillBtn btnCommon" id="submitBtn" style="display: block; margin: 0 auto;">
      Absenden
    </button>
    <div id="pstatus" class="align errorBox gothamNormal lh" style="margin-top: 20px;"></div>
    <div id="succstat" class="align successBox gothamNormal lh" style="margin-top: 20px;"></div>
  </div>
`;

// Build the index page from fixed products 
// TODO: use an async library to reduce the callback hell and better deal w. async queries
const buildMainSection = (conn, cat) => {
  return new Promise((resolve, reject) => {
    // Check if used in search query
    let isDefault = true;
    let sQuery = 'SELECT * FROM fix_products WHERE is_best = 1 ORDER BY priority ASC';

    let catToNum = {};
    
    // Build category slider
    let catQuery = 'SELECT DISTINCT category FROM fix_products ORDER BY category ASC';
    conn.query(catQuery, (e, res, f) => {
      if (e) {
        reject('Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es erneut 1', e);
        return;
      }

      conn.query(sQuery, function (err, result, fields) {
        if (err) {
          reject('Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es erneut 2');
          return;
        }

        // Create html output 
        let output = `
          <div class="topHolder">
            <div class="topShrink">
              <div class="topInner">
                <input type="text" autocomplete="off" class="searchBox"
                  placeholder="Was möchten Sie finden?"
                  onkeyup="searchForItem()" id="sfi" />
                <div class="categoryImg" onclick="toggleCategory()" id="categoryImg">
                  <img src="/images/icons/vmenu.svg">
                </div>
              </div>
              <div class="cbCont flexDiv trans" id="cbCont">
                <div class="arrows trans" id="larr" onclick="scrollHor('left')">
                  <img src="/images/larr.png" width="25" height="25">
                </div>
                <div class="catBox" id="catBox">
                  <a href="/?cat=Die beliebtesten" class="pseudoLink">
                    <div onclick="sortByCat('Die beliebtesten', 0)" class="scat"
                      style="background-color: #ececec; color: #4285f4; border-color: #4285f4;">
                      Die beliebtesten
                    </div>
                  </a>
        `;

        for (let i = 0; i < res.length; i++) {
          // Build table for getting the respective number value for a category
          catToNum[res[i].category] = (i + 1);

          output += `
            <a href="/?cat=${res[i].category}" class="pseudoLink">
              <div onclick="sortByCat('${res[i].category}', ${i + 1})" class="scat">
                ${res[i].category}
              </div>
            </a>
          `; 
        }

        output += `
                  <a href="/?cat=Alle" class="pseudoLink">
                    <div onclick="sortByCat('Alle', ${res.length + 1})" class="scat">
                      Alle
                    </div>
                  </a>
                </div>
                <div class="arrows trans" id="rarr" onclick="scrollHor('right')">
                  <img src="/images/rarr.png" width="25" height="25">
                </div>
              </div>
            </div>
          </div>
          <div class="clear"></div>
        `;

        // Only further products on a category page
        // Only display the top of the landing page on the index page
        let popProdsStyle = 'display: inline-block;';
        let catToggle = 'display: none;';
        let moreShow = 'diplay: none;';
        let furtherShow = 'display: flex;';
        let showcaseStyle = 'display: block';
        if (cat) {
          popProdsStyle = 'display: none;';
          catToggle = 'display: block';
          moreShow = 'display: flex;';
          furtherShow = 'display: none;';
          showcaseStyle = 'height: 0px; visibility: hidden;';
        } 

        output += `
          <div class="wideShowcase" id="wideShowcase" style="${showcaseStyle}">
            <div class="bgShowcase bgCommon">
              <div class="darken"></div>
              <div class="textCenter">
                <h1 class="mainText lh gotham align fontNorm" style="padding: 10px;">
                Präziser 3D-Druck auf Zaccord
                  <button class="fillBtn instantQuote gotham" onclick="location.href = '/print'">
                  Sofortiges Angebot
                  </button>
                </h1>
              </div>
            </div>
          </div>

          <div class="flexProtCont" style="margin-top: 20px; ${furtherShow}">
            <div class="bgService bgCommon" id="cprintService">
              <div class="darken keepRounded"></div>
              <div class="textCenter pad lh">
                <h2 class="serviceTxt align font34 gotham servMain servMain fontNorm">3D Druck</h2>
                <h3 class="serviceTxt align gotham fontNorm font16">
                FDM- und SLA-Druck mit vielen Farben und Materialien. Der intelligente Algorithmus
                Sie können sofort den Preis sehen und das hochgeladene Produkt bestellen.
                </h3>
                <div class="flexDiv btnAlign">
                  <button class="whiteBtn gotham font18 trans" onclick="redirect('/print')">Weitere Informationen</button>
                  <button class="whiteBtn gotham font18 trans" onclick="redirect('/printHelp')">Hilfe</button>
                </div>
              </div>
            </div>

            <div class="bgService bgCommon" id="protService">
              <div class="darken keepRounded"></div>
              <div class="textCenter pad lh">
                <h2 class="serviceTxt align font34 gotham servMain fontNorm">Prototypenfertigung</h2>
                <h3 class="serviceTxt align gotham fontNorm font16">
                Die 3D-gedruckte Kleinserien oder Prototypenfertigung ist eine wesentlich kostengünstigere und schnelle
                Möglichkeit Nullsequenzen zu erzeugen. Nutzen Sie es gerne für Einzelbestellungen
                kontaktiere uns.
                </h3>
                <div class="flexDiv btnAlign">
                  <button class="whiteBtn gotham font18 trans" onclick="redirect('/prototype')">
                  Weitere Informationen
                  </button>
                  <button class="whiteBtn gotham font18 trans" onclick="redirect('/prototype#getInCont')">
                  Kontakt
                  </button>
                </div>
              </div>
            </div>
          </div>

          <h2 class="gotham align font34 printTech fontNorm" id="printTech" style="${popProdsStyle}">
          Drucktechnologien
          </h2>

          <div class="flexProtCont" style="${furtherShow}">
            <div class="bgService bgCommon" id="fdmService">
              <div class="darken keepRounded"></div>
              <div class="textCenter pad lh">
                <h2 class="serviceTxt align font34 gotham servMain fontNorm">FDM</h2>
                <h3 class="serviceTxt align gotham fontNorm font16">
                Die FDM-Drucktechnologie eignet sich hervorragend für Rapid Prototyping und
                für eine kostengünstige Modellierung. In diesem Fall besteht der Drucke aus geschmolzenem Filament
                bereitet das Produkt Schicht für Schicht vor.
                </h3>
                <div class="flexDiv btnAlign">
                  <button class="whiteBtn gotham font18 trans" onclick="redirect('/mitjelent')">Weitere Informationen</button>
                </div>
              </div>
            </div>
            <div class="bgService bgCommon" id="slaService">
              <div class="darken keepRounded"></div>
              <div class="textCenter pad lh">
                <h2 class="serviceTxt align font34 gotham servMain fontNorm">SLA</h2>
                <h3 class="serviceTxt align gotham fontNorm font16">
                Es kann eine ausgezeichnete Wahl für kleinere oder präzisere Modelle sein,
                da seine Qualität mit der von Spritzgusskunststoff mithalten kann. In diesem Fall der Drucker
                stellt das Produkt aus Kunstharz her, das anschließend mit UV-Licht behandelt wird.
                </h3>
                <div class="flexDiv btnAlign">
                  <button class="whiteBtn gotham font18 trans" onclick="redirect('/mitjelent')">Weitere Informationen</button>
                </div>
              </div>
            </div>

            <div class="greyBoxCont">
              <div class="indexGreyBox">
                <p class="gotham boxTitle">Auftragsdruck</p>
                <div class="greyBoxText">
                  <p class="gothamNormal lh">
                  Wenn Sie drucken möchten, aber keinen eigenen 3D-Drucker haben, können Sie dies gerne für Sie tun.
                  Profitieren Sie von unserem <a class="blueLink" href="/print">Auftragsbruck</a> in unserem Shop.
                  </p>
                  <br>
                  <p class="gothamNormal lh">
                  Sie müssen lediglich die STL-Datei des Modells hochladen und können es sofort bestellen.
                  Passen Sie Ihr Modell komplett an, von der Farbe bis zur Schichtdicke!
                  </p>
                  <br>
                  <p class="gothamNormal lh">
                  Sie müssen nicht tagelang auf ein individuell erstelltes Angebot warten, da unser Bestellvorgang alles beinhaltet.
                  Der Algorithmus sagt Ihnen sofort, wie viel das Produkt kostet und
                  Sie können Sie selbst entscheiden, ob Sie es kaufen oder nicht.
                  </p>
                </div>
              </div>
              <div class="greyBoxImg bgCommon" id="gbi_1"></div>
            </div>

            <div class="greyBoxCont">
              <div class="indexGreyBoxLeft">
                <p class="gotham boxTitleLeft">Modellieren</p>
                <div class="greyBoxTextLeft">
                  <p class="gothamNormal lh">
                  Wenn Sie nur eine Idee, aber kein Modell haben, dann nutzen Sie
                  die Hilfe unseres 3D-Modellierers bei der Entwicklung.
                  </p>
                  <br>
                  <p class="gothamNormal lh">
                  Wir führen 3D-Modellierungen auf der Grundlage von Bauplänen, Bildern, Beschreibungen oder einfach nur einer Idee durch
                  nach ausführlicher Beratung.
                  </p>
                  <br>
                  <p class="gothamNormal lh">
                  Eine häufige Anwendung können defekte Werkzeuge, Teilemodellierungsbilder und eine Größentabelle sein
                  Auf dieser Grundlage drucken wir es aus und versenden es an den Kunden.
                  </p>
                </div>
              </div>
              <div class="greyBoxImgLeft bgCommon" id="gbi_2"></div>
            </div>

            <div class="greyBoxCont">
              <div class="indexGreyBox">
                <p class="gotham boxTitle">Produktion</p>
                <div class="greyBoxText">
                  <p class="gothamNormal lh">
                  Produktentwicklung, <a href="/prototype" class="blueLink"> Prototypen- und Serienfertigung</a> Kontaktieren Sie unser Team mit langjähriger Erfahrung 
                  </p>
                  <br>
                  <p class="gothamNormal lh">
                  Der wichtigste Meilenstein, bevor ein Produkt auf den Markt kommt, ist die Erstellung eines Prototyps bzw. einer
                  Kleinserienfertigung.
                  </p>
                  <br>
                  <p class="gothamNormal lh">
                  Der 3D-Druck ist hierfür aufgrund seiner Geschwindigkeit und Kosteneffizienz eine hervorragende Technologie.
                  Darüber hinaus ist es entscheidend, bevor das Produkt fertig ist, etwas greifbar in die Hände potenzieller Kunden zu legen.
                  </p>
                </div>
              </div>
              <div class="greyBoxImg bgCommon" id="gbi_5"></div>
            </div>

            <div class="greyBoxCont">
              <div class="indexGreyBoxLeft">
                <p class="gotham boxTitleLeft">Produkte</p>
                <div class="greyBoxTextLeft">
                  <p class="gothamNormal lh">
                  Auf Zaccord können Sie aus vielen vorgedruckten Produkten in vielen Kategorien wählen.
                  Oft findet man Produkte, die in normalen Geschäften nicht zu finden sind
                  oder einfach viel teurer sind.
                  </p>
                  <br>
                  <p class="gothamNormal lh">
                  Alle Produkte werden aus biologisch abbaubarem PLA-Filament gedruckt und sind daher ökologischer
                  als herkömmlicher Kunststoff.
                  </p>
                  <br>
                  <p class="gothamNormal lh">
                  Von Statuen und Vasen bis hin zu Seifenschalen finden Sie fast jeden gewöhnlichen Gegenstand
                  im Webshop. Jedes Produkt wurde von einem separaten Modellbauer entworfen, sodass Sie mit Ihrem Kauf auch dessen Arbeit unterstützen.
                  </p>
                </div>
              </div>
              <div class="greyBoxImgLeft bgCommon" id="gbi_4"></div>
            </div>


            <div class="greyBoxCont">
              <div class="indexGreyBox">
                <p class="gotham boxTitle">Lithophanie</p>
                <div class="greyBoxText">
                  <p class="gothamNormal lh">
                    A <a href="/print" class="blueLink">Lithofanie</a> kann ein perfektes persönliches Geschenk sein
                    für jeden Anlass.
                    Überraschen Sie Ihre Lieben mit einem einzigartigen, geprägten Geschenk, das Sie sofort auf der Website bestellen können.
                  </p>
                  <br>
                  <p class="gothamNormal lh">
                  Der Drucker erzeugt das geprägte Bild auf einer flachen oder gekrümmten Oberfläche, die eine Hintergrundbeleuchtung benötigt
                  um danach deutlich sichtbar sein. 
                  </p>
                  <br>
                  <p class="gothamNormal lh">
                  Es wird oft als Schirm für Lampen oder andere Lichtquellen verwendet. Wenn Sie das Licht einschalten wird die
                  Oberflächen mit unterschiedlichen Schichtdicken das Licht unterschiedlich stark durclassen und es entsteht ein monochromes Bild.
                  </p>
                </div>
              </div>
              <div class="greyBoxImg bgCommon" id="gbi_3"></div>
            </div>
          </div>
          
          <p class="gotham align font34" style="margin-top: 60px; margin-bottom: 0; ${popProdsStyle}"
            id="popProds">
            Die beliebtesten Produkte
          </p>
        `;

        output += `
          <section class="mainShowcase keepBottom animate__animated animate__fadeIn" id="ms">
            <div class="dynamicShowcase" id="dynamicShowcase">
        `;
         
        if (!cat) {
          var prodElements = new Promise((resolve, reject) => {
            let collectItems = '';
            // Loop through all fixed items in the db
            for (let i = 0; i < result.length; i++) {
              collectItems += produceShowcaseOutput(result, isDefault, i, false, true);
            }
            resolve(collectItems);
          });
        } else {
          // If URL is a simple category only display products in that category
          var prodElements = new Promise((resolve, reject) => {
            let collectItems = '';
            buildCategory(conn, cat).then(data => {
              collectItems += data;
              resolve(collectItems);
            }).catch(err => {
              reject('Hiba');
            });
          }); 
        }

        prodElements.then(data => {
          output += data;

          // Add the 4 newest products after most popular ones
          let newestQuery = 'SELECT * FROM fix_products ORDER BY date_added DESC LIMIT 4';
          conn.query(newestQuery, function displayNewItems(err, newRes, fields) {
            if (err) {
              reject('Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es erneut. 3');
              return;
            }
            
            output += `
              </div>
              <section class="mainShowcase" id="toggleLower" style="${catToggle}">
                <hr class="hrStyle" style="margin-top: 0;">
                <p class="mainTitle" style="margin-top: 20px;">Nachricht</p>
                <div class="dynamicShowcase newies">
            `;

            for (let i = 0; i < newRes.length; i++) {
              let url = newRes[i].url;
              let imgUrl = newRes[i].img_url;
              let prodName = newRes[i].name;
              let price = newRes[i].price;

              output += `
                <a href="/${url}">
                  <div class="cartImgHolder bgCommon newProds lazy" data-bg="/${imgUrl}"
                    style="background-color: rgb(53, 54, 58);"
                    onclick="window.location.href = '/${url}'">
                  </div>
                  <span class="gotham align">
                    <p>${prodName}</p>
                    <p>${price} Ft</p>
                  </span>
                </a>
              `;
            }

            output += '</div>';

            // Finally, select products from other categories 
            output += `
              <hr class="hrStyle" style="${catToggle}">
              <p class="mainTitle" style="margin-top: 20px; ${catToggle}">Mehr Produkte</p>
              <div class="dynamicShowcase" style="${moreShow}">
            `;
       
            let uniqueCategories = `SELECT DISTINCT category FROM fix_products ORDER BY RAND()`;
            let promises = [];
            let catRes = conn.query(uniqueCategories, (err, catRes, fields) => {
              for (let i = 0; i < catRes.length; i++) {
                if (err) {
                  reject('Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es erneut 4');
                  return;
                }
                
                let currentCat = catRes[i].category;
                let moreQuery = `
                  SELECT * FROM fix_products WHERE category = ? ORDER BY RAND() LIMIT 4
                `;

                let innerRes = new Promise((resolve, reject) => {
                  conn.query(moreQuery, [currentCat], (err, innerRes, fields) => {
                    if (err) {
                      reject('Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es erneut 5');
                      return;
                    }
                   
                    let output = '';
                    if (!innerRes.length) {
                      resolve('');
                    }

                    output += `
                      <div style="width: 100%; justify-content: center; margin-bottom: 10px;"
                        class="flexDiv">
                        <div class="gotham font22 align" style="margin-top: 0;">
                          ${currentCat}
                        </div>
                        <div class="seeMore trans"
                          onclick="sortByCat('${currentCat}', ${catToNum[currentCat]}, true)">
                          <img src="/images/icons/eye.svg" width="24" height="24"
                            alt="Weitere Produkte in der ${currentCat} Kategorie">
                        </div>
                      </div>
                    `;

                    for (let i = 0; i < innerRes.length; i++) {
                      output += produceShowcaseOutput(innerRes, isDefault, i, true);
                    }

                    resolve(output);
                  });
                });
                promises.push(innerRes);
              }

              Promise.all(promises).then(data => {
                for (let d of data) {
                  output += d;
                }
                output += `
                      </div>
                    </section>
                  </section>
                `;

                output += CONTACT_FORM;

                // Add lazy load of images
                output += `
                  <script src="/js/includes/lazyLoad.js"></script>
                  <script type="text/javascript">
                    var ll = new LazyLoad({
                      elements_selector: ".lazy",
                      callback_loaded: (el) => el.style.backgroundColor = 'white'
                    });

                    for (let el of Array.from(document.getElementsByClassName('pseudoLink'))) {
                      el.addEventListener('click', (e) => {
                        e.preventDefault();
                      });
                    }
                  </script>
                `;

                resolve(output);
              });
            });
          });
        });
      });
    });
  });
}

module.exports = buildMainSection;

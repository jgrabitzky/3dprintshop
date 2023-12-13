const useragent = require('express-useragent');
const util = require('util');
const buildBlogItem = require('./buildBlogsSection.js').buildBlogItem;
const constants = require('./includes/constants.js');
const LAZY_LOAD = constants.lazyLoad;
const PRINT_SIZES_PLA = constants.printSizesPLA;
const PRINT_SIZES_SLA = constants.printSizesSLA;
console.log(PRINT_SIZES_PLA, PRINT_SIZES_SLA)

// Custom printing for users if they have an .stl file
async function buildPrintSection(conn, req) {
  const query = util.promisify(conn.query).bind(conn);

  const rightArrow = `
    <svg class="contSvg blue">
      <svg>
      <path d="M9,1.5C4.8,1.5,1.5,4.8,1.5,9s3.3,7.5,7.5,7.5s7.5-3.3,7.5-7.5S13.2,1.5,9,1.5z M9,14.5l-1-1 l3.8-3.8H3.5V8.3h8.4L8.1,4.5L9,3.5L14.5,9L9,14.5z"></path>
      </svg>
    </svg>
  `;

  // Separately render the page for mobile & desktop versions
  let src = req.headers['user-agent'];
  let ua = useragent.parse(src);
  let isMobile = ua.isMobile;
  let dragDropText = isMobile ? 'Daten hochladen' : 'Ziehen Sie die Dateien hierher';
  let connWord = isMobile ? 'és' : 'oder';

  // Select relevant blogs
  let res = await query('SELECT * FROM blog WHERE id IN (9, 10, 7)');

  // Build file upload form
  let output = `
    <section class="keepBottom flexDiv ofv" id="cprintHolder" style="padding-bottom: 0px;">
      <div class="flexDiv styleHolder" style="border-radius: 30px; width: 100%;">
        <div class="cPrintDivs leftDiv flexDiv" id="dropDiv" ondrop="dropFile(event)">
          <form action="/uploadPrint" enctype="multipart/form-data" method="post" id="fdz"
            style="margin-bottom: 10px;">
            <img src="/images/icons/ddupload.svg" width="90" height="90"
              style="margin: 0 auto;">
            <p class="gotham font24 dgray" style="margin-bottom: 15px;" id="dragdrop">
              ${dragDropText}
            </p> 
            <p class="gotham font18" style="margin-top: 0;" id="or">${connWord}</p>
            <div class="btnCommon fillBtn" id="fdzB" style="width: 60%; margin: 0 auto;
              max-width: 320px;">
              Durchsuchen
            </div>
            <input type="file" name="file[]" style="display: none;" id="fileInput" multiple
              >
            <input type="submit" id="submitForm" style="display: none;">
            <br>
            <p class="gotham lh">
            Fragen
              <a href="/print#getQuote" class="blueLink font16">nach unserem einzigartiges Preisangebot</a>
              wenn Sie keine geeignete Datei zum Drucken haben
            </p>
          </form>
        </div>
        <div class="cPrintDivs rightDiv flexDiv previews gotham" id="bigPrew">
          <div id="prew" class="lh">
            <p class="gotham font24" style="color: #2d2d2d; margin-top: 0;">
            3D-Druck aus Datei
            </p> 
            <p class="gotham font18" style="color: #2d2d2d;">
            Sie haben keine Datei zum Drucken?<br>
              <a class="blueLink" href="https://www.thingiverse.com" target="_blank">
              Schauen Sie sich auf Thingivers um!
              </a>
            </p> 

            <p class="gotham font16" style="color: #2d2d2d;">
            Laden Sie ein Bild für die Lithophanie und eine STL-Datei für den Auftragsdruck hoch
            </p> 

            <p class="gotham font16 hideOnMobile" style="color: #2d2d2d;">
              <span class="gothamBold">Max. Max. Grösse:</span> ${PRINT_SIZES_PLA[0]}mm x ${PRINT_SIZES_PLA[1]}mm x ${PRINT_SIZES_PLA[2]}mm (FDM)<br> ${PRINT_SIZES_SLA[0]}mm x ${PRINT_SIZES_SLA[1]}mm x ${PRINT_SIZES_SLA[2]}mm (SLA) 
            </p> 
          </div>
        </div>
      </div>
    </section>
  `;

  output += `
    <section class="keepBottom ofv" style="margin-top: 40px;">
      <div id="cpFadeHolder" style="opacity: 0;">
        <h1 class="gotham font26 align fontNorm">Präziser, schneller 3D-Druck mit sofortiger Bestellung</h1>
        <h2 class="align font18 lh fontNorm">
        Zuverlässiger FDM- und SLA-Druck in verschiedenen Farben, auch mit flexiblem TPU. Wir 
        bieteten verschiedenste Lösungen im 3D-Druck.
        </h2>
        <p class="align">
          <a href="/printHelp" class="blueLink align">
          Weitere Informationen
            ${rightArrow}
          </a>
          <span class="orSep">oder</span>
          <a class="blueLink align jumpToPrint">
          Zum Drucken gehen
            ${rightArrow}
          </a>
        </p>

        <div class="wideDynamicShowcase bgCommon" id="cpShow">
          <div class="wideHidden">
            <div class="noOflow">
              <div class="ctrlButtons trans" id="cpLeftButton">‹&nbsp;</div>
              <div class="ctrlButtons trans" id="cpRightButton">&nbsp;›</div>
            </div>
            <div class="normalOflow">
              <img src="/images/printShowcase/third.jpg" class="innerImg trans" id="cp_0">
              <img src="/images/printShowcase/second.jpg" class="innerImg trans" id="cp_1">
              <img src="/images/printShowcase/first.jpg" class="innerImg trans" id="cp_2">
              <img src="/images/printShowcase/fourth.jpg" class="innerImg trans" id="cp_3">
            </div>
          </div>
        </div>
        <h3 class="capitalTitle gothamMedium align fontNorm font16" id="capTitle">
        Schnelle Prototypen mit FDM-Druck
        </h3>
        <p id="scText" class="align lh" style="color: #3c4043;">FDM ist eine ausgezeichnete Wahl für Nullserien
        bevor das fertige Produkt auf den Markt kommt. Auf diese Weise können Sie viel Zeit und Geld sparen.
        Mögliche Fehler werden bereits in den frühen Phasen der Produktentwicklung aufgedeckt.
        </p>
      </div>

      <div id="infoFadeHolder" class="mtsix flowBox flexDiv flBoxSp flexWrap" style="opacity: 0;">
        <div>
          <h2 class="gotham font26 align fontNorm">Prozess des 3D-Drucks</h2>
          <h2 class="align font18 lh fontNorm">
          Wenn Sie die STL-Datei des Modells haben können sie die Datei 
            <a class="jumpToPrint blueLink font18">hier</a> hochladen und bestellen.
            Ansonsten ist ein Download auf vielen Webseiten möglich.
            Viele Modelle von vorgefertigten Artikeln gibt es kostenlos
            <a class="font18 blueLink" href="https://www.thingiverse.com">Thingiverse</a> zum Download.
            <br><br>
            Das hochgeladene Modell erscheint dann im Browser
            in einer interaktiven Form, in der Sie das Produkt in 3D betrachten können. Hier
            Es ist auch möglich, andere Parameter einzustellen, wenn jedoch die
            Sollten Ihnen in diesem Bereich noch Kenntnisse fehlen, kann es sich lohnen, die Grundeinstellungen zu nutzen
            weitergehen. In den meisten Fällen ist die Qualität ausreichend
            versichern.
            <br><br>
            Wenn Sie ein anderes Dateiformat haben oder eine individuelle Bestellung aufgeben möchten, dann
            fordern Sie ein individuelles Angebot <a class="blueLink font18 goToQuote">am Ende der Seite</a> an.
            Oder senden Sie uns eine E-Mail an <a href="mailto:info@grabitzky.com" class="blueLink font18">info@grabitzky.com</a>
            Wir setzen uns dann schnellstmöglich mit ihnen in Verbindung.
          </h2>
        </div>
        <div>
          <div>
            <div class="flowImg bgCommon"></div>
          </div>
        </div>
      </div>
  `;

  output += `
    <div id="fdmFadeHolder" style="opacity: 0;">
      <h2 class="gotham font26 align fontNorm">FDM Technologie</h2>
        <h2 class="align font18 lh fontNorm">
        Die FDM-Technologie ist derzeit die gebräuchlichste und kostengünstigste Druckmethode
        Verfahren, mit zahlreichen verfügbaren Materialien und Texturen. Eine ausgezeichnete Wahl vor der Markteinführung des Endprodukts
        für die Prototypenfertigung.
        </h2>
        <p class="align">
          <a href="https://en.wikipedia.org/wiki/Fused_filament_fabrication" target="_blank" class="blueLink align">
          Weitere Informationen
            ${rightArrow}
          </a>
          <span class="orSep">oder</span>
          <a class="blueLink align jumpToPrint">
          Zum Drucken gehen
            ${rightArrow}
          </a>
        </p>

        <div class="wideDynamicShowcaseFdm bgCommon trans" id="fdmShow">
          <div class="wideHidden">
            <div class="noOflow">
              <div class="ctrlButtons trans" id="fdmLeftButton">‹&nbsp;</div>
              <div class="ctrlButtons trans" id="fdmRightButton">&nbsp;›</div>
            </div>
            <div class="normalOflow">
              <img src="/images/printShowcase/fdmFirst.jpg" class="innerImg trans" id="fdm_0">
              <img src="/images/printShowcase/fdmSecond.jpg" class="innerImg trans" id="fdm_1">
              <img src="/images/printShowcase/slaPrinter.jpg" class="innerImg trans"
                id="fdm_2">
            </div>
          </div>
        </div>
        <h3 class="capitalTitle gothamMedium align font16 fontNorm" id="capTitleFdm">
        FDM-Drucker
        </h3>
        <p id="scTextFdm" class="align lh" style="color: #3c4043;">
        FDM-Drucker stellen es Schicht für Schicht präzise aus dem geschmolzenen Filament her
        das gewünschte Modell aus einer digitalen Datei. Der Druckkopf kann alle drei Funktionen
        Achse (X, Y, Z), sodass Sie nahezu jede Form erstellen können.
        </p>
      </div>
    </div>

    <div id="slaFadeHolder" style="opacity: 0;">
      <h2 class="gotham font26 align fontNorm">SLA Technologie</h2>
        <h2 class="align font18 lh fontNorm">
        Die SLA-Technologie ist viel genauer als FDM, aber auch teurer. Es wird häufig in der Medizin und
        für medizinische Zwecke, etwa zum Drucken eines Prothesenprototyps oder zur anatomischen Modellierung,
        und für die Herstellung kleinerer Modelle, bei denen die Oberflächenqualität wichtig ist.
        </h2>
        <p class="align">
          <a href="https://en.wikipedia.org/wiki/Stereolithography" target="_blank" class="blueLink align">
          Weitere Informationen
            ${rightArrow}
          </a>
          <span class="orSep">oder</span>
          <a class="blueLink align jumpToPrint">
          Zum Drucken gehen
            ${rightArrow}
          </a>
        </p>

        <div class="wideDynamicShowcaseFdm bgCommon trans" id="slaShow">
          <div class="wideHidden">
            <div class="noOflow">
              <div class="ctrlButtons trans" id="slaLeftButton">‹&nbsp;</div>
              <div class="ctrlButtons trans" id="slaRightButton">&nbsp;›</div>
            </div>
            <div class="normalOflow">
              <img src="/images/printShowcase/castle_sla.jpg" class="innerImg trans" id="sla_0">
              <img src="/images/printShowcase/slaPrinter.jpg" class="innerImg trans" id="sla_1">
              <img src="/images/printShowcase/house_sla.jpg" class="innerImg trans"
                id="sla_2">
            </div>
          </div>
        </div>
        <h3 class="capitalTitle gothamMedium align font16 fontNorm" id="capTitleSla">
        SLA-Druck
        </h3>
        <p id="scTextSla" class="align lh" style="color: #3c4043;">
        Stereolithographie ist ein 3D-Druckverfahren, das
        Konzeptmodelle, kosmetische Requisiten, schnelle Prototypen und
        komplexe Teile mit komplexen Geometrien in bis zu 1 Tag
        zur Produktion verwendet. Die auf diese Weise hergestellten Teile bestehen aus den unterschiedlichsten Materialien
        hergestellt werden, mit deren Hilfe äußerst hochauflösende Details und hochwertige Oberflächen erzeugt werden können.
        </p>
      </div>
    </div>


    <div id="matFadeHolder">
      <h2 class="gotham font26 align fontNorm">FDM-Druckmaterialien</h2>
        <h2 class="align font18 lh fontNorm">
        Verschiedene Arten des FDM-Drucks erfordern möglicherweise unterschiedliche Materialien
        Um spezifischere Anforderungen zu erfüllen, werden PLA, ABS, PETG usw. verwendet
        Neben TPU-Materialien gibt es noch viele andere <a href="/colors" class="blueLink font18">Filamente.</a>
        Für den SLA-Druck verwenden wir ausschließlich UV-Harz
        (in besonderen Fällen eine spezielle Kategorie davon, zum Beispiel für Dentalmodelle).
        </h2>
        <p class="align">
          <a href="/materialHelp" class="blueLink align">
          Weitere Informationen
            ${rightArrow}
          </a>
          <span class="orSep">oder</span>
          <a class="blueLink align jumpToPrint">
          Zum Drucken gehen
            ${rightArrow}
          </a>
        </p>

        <div class="wideDynamicShowcaseLit bgCommon trans" id="matShow">
          <div class="wideHidden">
            <div class="noOflow">
              <div class="ctrlButtons trans" id="matLeftButton">‹&nbsp;</div>
              <div class="ctrlButtons trans" id="matRightButton">&nbsp;›</div>
            </div>
            <div class="normalOflow">
              <img src="/images/printShowcase/matPLA.jpeg" class="innerImg trans" id="mat_0">
              <img src="/images/printShowcase/matABS.jpg" class="innerImg trans" id="mat_1">
              <img src="/images/printShowcase/matPETG.jpg" class="innerImg trans" id="mat_2">
              <img src="/images/printShowcase/matTPU.jpg" class="innerImg trans" id="mat_3">
            </div>
          </div>
        </div>
        <h3 class="capitalTitle gothamMedium align font16 fontNorm" id="capTitleMat">
          PLA filament
        </h3>
        <p id="scTextMat" class="align lh" style="color: #3c4043;">
        PLA ist ein stärkebasiertes Biopolymer, das aus nachwachsenden Rohstoffen hergestellt werden kann,
        zum Beispiel aus Mais oder Zuckerrohr und ist somit umweltfreundlich.
        Es verfügt über eine hohe Zugfestigkeit und Oberflächengüte, also beides
        kann sowohl zu Hause als auch im Büro verwendet werden. Es erstellt Objekte
        wie die Herstellung von Haushaltsgeräten, Prototypen, Spielzeug,
        Präsentationsobjekte, Architekturmodelle und Ersatz verlorener Teile.
        </p>
      </div>
      
      <div class="mtsix">
        <h2 class="gotham font26 align fontNorm">Hilfreiche Blogbeiträge</h2>
        <h2 class="align font18 lh fontNorm">
        Unsere regelmäßig aktualisierten Blogbeiträge bieten nützliche Informationen für Einsteiger und Experten im 3D-Druck.
        Wenn Sie mehr zum Thema lesen möchten, besuchen Sie unseren
          <a class="font18 blueLink" href="/blogs">Blog.</a> auf unserer Webseite. Dort finden Sie weitere interessante Artikel.
        </h2>
        <div class="flexDiv flexWrap lh flSpAr">
    `;

    for (let currentBlog of Array.from(res)) {
      output += buildBlogItem(currentBlog);
    }

    output += `
      </div>
    </div>
    <div id="litFadeHolder">
      <h2 class="gotham font26 align fontNorm">Verewigen Sie Ihre schönsten Bilder in 3D!</h2>
        <h2 class="align font18 lh fontNorm">
        Wir drucken Ihre schönsten Bilder auch in Form einer Lithophanie.
        So verewigen Sie ihre
        schönsten Momente. Sie benötigen insgesamt ein Bild zum Hochladen auf Zaccord
        und dann können Sie das Produkt sofort bestellen.
        </h2>
        <p class="align">
          <a href="/lithophaneHelp" class="blueLink align">
          Weitere Informationen
            ${rightArrow}
          </a>
          <span class="orSep">vagy</span>
          <a class="blueLink align jumpToPrint">
          Zum Drucken gehen
            ${rightArrow}
          </a>
        </p>

        <div class="wideDynamicShowcaseLit bgCommon trans" id="litShow">
          <div class="wideHidden">
            <div class="noOflow">
              <div class="ctrlButtons trans" id="litLeftButton">‹&nbsp;</div>
              <div class="ctrlButtons trans" id="litRightButton">&nbsp;›</div>
            </div>
            <div class="normalOflow">
              <img src="/images/printShowcase/lit_one.png" class="innerImg trans" id="lit_0">
              <img src="/images/printShowcase/litSecond.jpg" class="innerImg trans" id="lit_1">
            </div>
          </div>
        </div>
        <h3 class="capitalTitle gothamMedium align fontNorm font16" id="capTitleLit">
        Gedrucktes Lithophan und das Originalbild
        </h3>
        <p id="scTextLit" class="align lh" style="color: #3c4043;">
        Im Grundfall handelt es sich bei einem fertigem Lithophan um eine ein geprägtes Bild das 
        Bei Hintergrundbeleuchtung selbst kristallklar ist.
        Aus dem hochgeladenen digitalen Bild erstellt der 3D-Drucker ein echtes, greifbares Lithophan,
        das dank der Technologie das Originalbild realistisch wiedergibt.
        </p>
      </div>
      
      <div class="mtsix">
        <h2 class="gotham font26 align fontNorm" id="getQuote">
        Anfrage für
        </h2>
        <h2 class="align font18 lh fontNorm">
        Wenn Sie eine Einzelbestellung aufgeben möchten, laden Sie die Dateien die Sie drucken möchten im Dateiformat STL hoch.
        Wir kontaktieren Sie gerne in Form einer Angebotsanfrage.
        </h2>
        <div class="flexDiv" style="flex-wrap: wrap;" id="normalDiv">
          <input type="text" class="dFormField" id="name" placeholder="Név" value="">
          <input type="email" class="dFormField" id="email" placeholder="Email">
          <input type="text" class="dFormField protmob" id="mobile"
            placeholder="Telefonszám" value="">
          <textarea placeholder="CAD-Modell-URL, Produkterwartungen: Material, Farbe, Technologie usw."
            id="message" class="dFormField" style="width: 100%; height: 100px;"></textarea>
        </div>
        <button class="fillBtn btnCommon" id="submitBtn" style="display: block; margin: 0 auto;">
          Küldés
        </button>
        <div id="pstatus" class="align errorBox" style="margin-top: 20px;"></div>
        <div id="succstat" class="align successBox" style="margin-top: 20px;"></div>
      </div>

      <br>

      <hr class="hrStyle">

      <p class="align lh font18 notoSans">
      Für Serienproduktion oder Prototypenfertigung besuchen Sie uns
        <a class="blueLink font18" href="/prototype">Prototypenfertigung</a> hier auf der Seite oder
        kontaktieren sie uns unter
        <a class="blueLink font18" href="mailto:info@grabitzky.com">info@grabitzky.com</a>
        per E-Mail.
      <p>
    </section>
    ${LAZY_LOAD}
    <script src="/js/prototype.js" defer></script>
    <script src="/js/includes/statusFill.js"></script>
  `;

  return output;
}

module.exports = buildPrintSection;

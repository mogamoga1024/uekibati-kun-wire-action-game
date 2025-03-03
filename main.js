
// DOM
const controlsDescriptionDom = document.querySelector("#controls-description");
const mapDescriptionDom = document.querySelector("#map-description");
const helpDescriptionDom = document.querySelector("#help-description");
const bgmDescriptionDom = document.querySelector("#bgm-description");
const editionDom = document.querySelector("#edition a");

// Canvas設定
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;

// えみたん
const emitter = new TinyEmitter();

// Cookie Path
const cookiePath = "/uekibati-kun-wire-action-game";

// スマホは遊べない
const mobileRegex = /iphone;|(android|nokia|blackberry|bb10;).+mobile|android.+fennec|opera.+mobi|windows phone|symbianos/i;
const isMobileByUa = mobileRegex.test(navigator.userAgent);;
const isMobileByClientHint = navigator.userAgentData && navigator.userAgentData.mobile;
drawLoading.isMobile = isMobileByUa || isMobileByClientHint;

// BGM
bgmDescriptionDom.innerText = "B:BGM ON";
window.addEventListener("keydown", e => {
    if (e.repeat) {
        e.preventDefault();
        return;
    }

    if (e.key === "b") {
        if (SceneManager.sceneName === "TitleScene") {
            if (bgmDescriptionDom.innerText === "B:BGM ON") {
                bgmDescriptionDom.innerText = "B:BGM OFF";
            }
            else {
                bgmDescriptionDom.innerText = "B:BGM ON";
            }
        }
        else if (BGM.isPlaying) {
            BGM.stop();
            bgmDescriptionDom.innerText = "B:BGM OFF";
        }
        else {
            BGM.start();
            bgmDescriptionDom.innerText = "B:BGM ON";
        }
    }
});

// リスポーン地点の順番
function respaonOrdinalNum() {
    let id = -1;
    const strId = Cookies.get("respaon_area_id");
    if (strId !== undefined) {
        id = Number(strId);
    }
    switch (id) {
        case -1: return 1;
        case 9:  return 2;
        case 5:  return 3;
        case 4:  return 4;
        case 6:  return 5;
        case 10: return 6;
        case 2:  return 7;
        case 7:  return 8;
        case 11: return 9;
        case 8:  return 10;
        case 1:  return 11;
        case 3:  return 12;
        default: return -1;
    }
}

// エディション
const isInmu = (new URL(window.location.href)).searchParams.get("inmu") !== "false";
const isDebug = (new URL(window.location.href)).searchParams.get("debug") === "true";
const edition = isInmu ? "INMU" : "健全";

if (isInmu) {
    editionDom.innerText = "ななっち版";
    editionDom.href = "./?inmu=false";
}
else {
    editionDom.innerText = "野獣先輩版";
    editionDom.href = "./?inmu=true";
}

// 画像とか音とか読み込んだ後にゲーム開始
let backgroundImagePath = `asset/${edition}/サブリミナル先輩.png`;
if (drawLoading.isMobile) {
    backgroundImagePath = "asset/ないです.png";
}

loadImage(backgroundImagePath).then(image => {
    drawLoading.backgroundImage = image;
    drawLoading();

    const imageLoadPromise = ImageStorage.create({
        "植木鉢くんL": "asset/植木鉢くんL.png",
        "植木鉢くんR": "asset/植木鉢くんR.png",
        "お花": "asset/お花.png",
        "植木鉢くんの最期1": "asset/植木鉢くんの最期1.png",
        "植木鉢くんの最期2": "asset/植木鉢くんの最期2.png",
        "バレーボールくん": "asset/バレーボールくん.png",
    });
    
    const soundLoadPromise = SoundStorage.create([
        "ドンッ",
        "あっ（確信犯）",
        "大破",
        "やりますねぇ",
        "ぬぁぁん疲れたもぉぉん",
        "これもうわかんねぇな",
        "閉廷",
        "ｼｭｰ",
        "ヌッ！"
    ]);
    
    Promise.all([imageLoadPromise, soundLoadPromise]).then(() => {
        // ゲームを開始
        SceneManager.start(new TitleScene());
        // SceneManager.start(new HelpScene());
        // SceneManager.start(new TutorialScene());
        // SceneManager.start(new PrologueScene());
        // SceneManager.start(new EndingScene());
    });
});

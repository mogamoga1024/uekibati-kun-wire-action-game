
function soundParams(key) {
    switch (key) {
        case "ドンッ": return {path: "assets/ドンッ.mp3", volume: 0.5};
        case "大破": return {path: "assets/大破.mp3", volume: 0.7};
        case "ないです": return {path: "assets/ないです.mp3", volume: 0.6};
    }
    
    if (isInmu) {
        switch (key) {
            case "あっ（確信犯）": return {path: `assets/${edition}/あっ（確信犯）.mp3`, volume: 0.9};
            case "やりますねぇ": return {path: `assets/${edition}/やりますねぇ.mp3`};
            case "ぬぁぁん疲れたもぉぉん": return {path: `assets/${edition}/ぬぁぁん疲れたもぉぉん.mp3`, volume: 0.5};
            case "これもうわかんねぇな": return {path: `assets/${edition}/これもうわかんねぇな.mp3`};
            case "閉廷": return {path: `assets/${edition}/終わり！！閉廷！！以上！！皆解散！！.mp3`, volume: 0.15};
            case "ｼｭｰ": return {path: `assets/${edition}/ｼｭｰ.mp3`, volume: 0.8};
            case "ヌッ！": return {path: `assets/${edition}/ヌッ！.mp3`, volume: 0.8};
            case "ほらいくどー": return {path: `assets/${edition}/ほらいくどー.mp3`, volume: 0.9};
        }
    }
    else {
        const volume = 0.9;
        switch (key) {
            case "あっ（確信犯）": return {path: `assets/${edition}/あっ（確信犯）.mp3`, volume};
            case "やりますねぇ": return {path: `assets/${edition}/やりますねぇ.mp3`, volume};
            case "ぬぁぁん疲れたもぉぉん": return {path: `assets/${edition}/ぬぁぁん疲れたもぉぉん.mp3`, volume};
            case "これもうわかんねぇな": return {path: `assets/${edition}/これもうわかんねぇな.mp3`, volume};
            case "閉廷": return {path: `assets/${edition}/終わり！！閉廷！！以上！！皆解散！！.mp3`, volume};
            case "ｼｭｰ": return {path: `assets/${edition}/ｼｭｰ.mp3`};
            case "ヌッ！": return {path: `assets/${edition}/ヌッ！.mp3`};
            case "ほらいくどー": return {path: `assets/${edition}/ほらいくどー.mp3`, volume};
        }
    }
    throw new Error(`存在しないkey：${key}`);
}



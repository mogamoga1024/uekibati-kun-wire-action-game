
function soundParams(key) {
    const ondoku = 0.7;
    switch (key) {
        case "ドンッ": return {path: "assets/ドンッ.mp3", volume: 0.3};
        case "大破": return {path: "assets/大破.mp3", volume: 0.5};
        case "ないです": return {path: "assets/ないです.mp3", volume: 0.5};
        case "プロローグ1": return {path: "assets/プロローグ/プロローグ1.mp3", volume: ondoku};
        case "プロローグ2": return {path: "assets/プロローグ/プロローグ2.mp3", volume: ondoku};
        case "プロローグ3": return {path: "assets/プロローグ/プロローグ3.mp3", volume: ondoku};
        case "エンディング1": return {path: "assets/エンディング/エンディング1.mp3", volume: ondoku};
        case "エンディング2": return {path: "assets/エンディング/エンディング2.mp3", volume: ondoku};
        case "エンディング3": return {path: "assets/エンディング/エンディング3.mp3", volume: ondoku};
        case "エンディング4": return {path: "assets/エンディング/エンディング4.mp3", volume: ondoku};
        case "エンディング5": return {path: "assets/エンディング/エンディング5.mp3", volume: ondoku};
        case "エンディング6": return {path: "assets/エンディング/エンディング6.mp3", volume: ondoku};
        case "エンディング7": return {path: "assets/エンディング/エンディング7.mp3", volume: ondoku};
        case "おしまい": return {path: "assets/エンディング/おしまい.mp3", volume: ondoku};
    }
    
    if (isInmu) {
        switch (key) {
            case "あっ（確信犯）": return {path: `assets/${edition}/あっ（確信犯）.mp3`, volume: 0.7};
            case "やりますねぇ": return {path: `assets/${edition}/やりますねぇ.mp3`, volume: 0.7};
            case "ぬぁぁん疲れたもぉぉん": return {path: `assets/${edition}/ぬぁぁん疲れたもぉぉん.mp3`, volume: 0.3};
            case "これもうわかんねぇな": return {path: `assets/${edition}/これもうわかんねぇな.mp3`, volume: 0.8};
            case "閉廷": return {path: `assets/${edition}/終わり！！閉廷！！以上！！皆解散！！.mp3`, volume: 0.1};
            case "ｼｭｰ": return {path: `assets/${edition}/ｼｭｰ.mp3`, volume: 0.4};
            case "ヌッ！": return {path: `assets/${edition}/ヌッ！.mp3`, volume: 0.5};
            case "ほらいくどー": return {path: `assets/${edition}/ほらいくどー.mp3`, volume: 0.6};
        }
    }
    else {
        const volume = 0.8;
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



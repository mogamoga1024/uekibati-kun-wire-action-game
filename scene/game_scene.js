
class GameScene extends Scene {
    #isLoaded = false;

    #respawnId = -1;
    #startTime = null;
    #totalTime = 0;
    #goalTime = -1;

    #isPressedUp = false;
    #isPressedDown = false;
    #isPressedLeft = false;
    #isPressedRight = false;
    #isPressedX = false;
    #isPressedZ = false;
    
    #backgroundImage = null;
    #saveFunc = null;
    #isMapMode = false;
    #isGhost = false;
    #fadeOutAlpha = 0;
    
    #shouldAnimation = true;
    #fireHookWaitFrame = 0;
    #fireHookWaitFrameMax = 15;

    #player = null;
    #entityList = [];
    #viewport = null;

    constructor(respawnId, totalTime = 0) {
        super();
        this.#respawnId = respawnId;
        this.#totalTime = totalTime;
    }

    onStart() {
        let stage = (new URL(window.location.href)).searchParams.get("stage");
        if (stage === null) {
            stage = "hard";
        }

        // this.#respawnId = 3; // デバグ用 最終リポーン地点
        
        let {player, entityList, world} = MapFactory.create(stage, this.#respawnId);
        this.#player = player;
        this.#entityList = entityList;
        this.#viewport = new Viewport(world, this.#player);

        this.#updateDescription();
        mapDescriptionDom.innerText = "C:マップ確認";
        helpDescriptionDom.innerText = "H:ヘルプ";

        loadImage("asset/虚無.png").then(image => {
            this.#backgroundImage = image;

            this.#saveFunc = () => {
                if (this.#player.isGoal) {
                    return;
                }
                const totalTime = new Date() - this.#startTime;
                Cookies.set("total_time", String(totalTime), {expires: 365, path: cookiePath});
            };
            window.addEventListener("beforeunload", this.#saveFunc);
            window.addEventListener("popstate", this.#saveFunc);
            emitter.on("respawn-area-collision", this.#saveFunc);

            this.#startTime = new Date();
            if (this.#totalTime > 0) {
                this.#startTime.setTime(this.#startTime.getTime() - this.#totalTime);
            }
            
            this.#isLoaded = true;
            this.#startAnimation();
        });
    }

    onEnd() {
        this.#shouldAnimation = false;
        window.removeEventListener("beforeunload", this.#saveFunc);
        window.removeEventListener("popstate", this.#saveFunc);
        emitter.off("respawn-area-collision", this.#saveFunc);
    }

    onResume() {
        this.#updateDescription();
        mapDescriptionDom.innerText = "C:マップ確認";
        helpDescriptionDom.innerText = "H:ヘルプ";
        this.#startAnimation();
    }

    onStop() {
        this.#shouldAnimation = false;
    }

    onKeyDown(e) {
        if (e.repeat) {
            e.preventDefault();
            return;
        }
        if (!this.#isLoaded) {
            return;
        }

        switch (e.key) {
            case "ArrowUp":    this.#isPressedUp    = true; e.preventDefault(); return;
            case "ArrowDown":  this.#isPressedDown  = true; e.preventDefault(); return;
            case "ArrowLeft":  this.#isPressedLeft  = true; e.preventDefault(); return;
            case "ArrowRight": this.#isPressedRight = true; e.preventDefault(); return;
            case "x": this.#isPressedX = true; return;
            case "z": this.#isPressedZ = true; return;
            case "c": {
                this.#isMapMode = !this.#isMapMode;
                if (this.#isMapMode) {
                    mapDescriptionDom.innerText = "C:ゲームに戻る";
                }
                else {
                    this.#viewport.dx = 0;
                    this.#viewport.dy = 0;
                    mapDescriptionDom.innerText = "C:マップ確認";
                }
                return;
            }
            case "g": {
                if (isDebug) {
                    this.#isGhost = !this.#isGhost;
                }
                return;
            }
            case "h": {
                if (this.#player.isGoal) {
                    return;
                }
                SoundStorage.get("これもうわかんねぇな").play();
                SceneManager.start(new HelpScene(), true);
                return;
            }
        }
    }

    onKeyUp(e) {
        switch (e.key) {
            case "ArrowUp":    this.#isPressedUp    = false; return;
            case "ArrowDown":  this.#isPressedDown  = false; return;
            case "ArrowLeft":  this.#isPressedLeft  = false; return;
            case "ArrowRight": this.#isPressedRight = false; return;
            case "x": this.#isPressedX = false; return;
            case "z": this.#isPressedZ = false; return;
        }
    }

    #startAnimation() {
        this.#shouldAnimation = true;
        let prevTime = -1;
        const anime = (time) => {
            if (this.#shouldAnimation) {
                if (prevTime === -1 || time - prevTime >= deltaTime * 1000 * 0.9) {
                    prevTime = time;
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.globalAlpha = 0.3;
                    context.drawImage(this.#backgroundImage, 0, 0, canvas.width, canvas.height);
                    context.globalAlpha = 1;
                    this.#update();
                }
                requestAnimationFrame(anime);
            }
        };
        anime(performance.now());
    }

    #update() {
        if (this.#isMapMode) {
            this.#updateCamera();
        }
        else {
            this.#updatePlayer();
        }
    
        // 描画する
        this.#entityList.forEach(entity => {
            if (entity.canDraw(this.#viewport)) {
                entity.draw(this.#viewport);
            }
        });
        this.#player.draw(this.#viewport);
    
        this.#updateDescription();
        this.#updateText();

        if (this.#player.isGoal) {
            // console.log("ゴール！おめでとう！");
            this.#fadeOut();
            this.#fadeOutAlpha += 0.005;
            if (this.#fadeOutAlpha > 1) {
                this.#fadeOutAlpha = 1;
                this.#fadeOut();
                SceneManager.start(new EndingScene(), false, false);
            }
        }
    }

    #fadeOut() {
        context.globalAlpha = this.#fadeOutAlpha;
        context.beginPath();
        context.fillStyle = "#FFFF00";
        context.rect(0, 0, canvas.width, canvas.height);
        context.fill();
        context.globalAlpha = 1;
    }
    
    #updatePlayer() {
        if (this.#fireHookWaitFrame !== 0) {
            this.#fireHookWaitFrame++;
            if (this.#fireHookWaitFrame >= this.#fireHookWaitFrameMax) {
                this.#fireHookWaitFrame = 0;
            }
        }
    
        if (this.#player.opacity === 0) {
            SoundStorage.get("ぬぁぁん疲れたもぉぉん").play();
            this.#player = this.#player.nextPlayer();
            this.#viewport.setPlayer(this.#player);
        }
    
        if (this.#isGhost) {
            this.#player.ghostMove(this.#forceDirection());
        }
        else {
            this.#playerMove();
        }
    }
    
    #updateCamera() {
        if (this.#isPressedLeft) {
            this.#viewport.dx -= 20;
        }
        else if (this.#isPressedRight) {
            this.#viewport.dx += 20;
        }
        if (this.#isPressedUp) {
            this.#viewport.dy -= 20;
        }
        else if (this.#isPressedDown) {
            this.#viewport.dy += 20;
        }
    }
    
    #playerMove() {
        if (this.#isPressedZ && this.#fireHookWaitFrame === 0) {
            this.#fireHookWaitFrame++;
            this.#player.fireHook(this.#fireHookRadian());
        }
    
        if (this.#isPressedX) {
            this.#player.jumpStart();
        }
    
        this.#player.applyForce(this.#forceDirection());
    
        this.#player.move(this.#entityList);
    }
    
    #fireHookRadian() {
        if (this.#isPressedUp && !this.#isPressedDown && !this.#isPressedLeft && !this.#isPressedRight) {
            return Math.PI / 2;
        }
        else if (this.#isPressedUp && !this.#isPressedDown && this.#isPressedLeft && !this.#isPressedRight) {
            return Math.PI * 3 / 4;
        }
        else if (this.#isPressedUp && !this.#isPressedDown && !this.#isPressedLeft && this.#isPressedRight) {
            return Math.PI / 4;
        }
        else if (!this.#isPressedUp && !this.#isPressedDown && this.#isPressedLeft && !this.#isPressedRight) {
            return Math.PI;
        }
        else if (!this.#isPressedUp && !this.#isPressedDown && !this.#isPressedLeft && this.#isPressedRight) {
            return 0;
        }
        else if (!this.#isPressedUp && this.#isPressedDown && !this.#isPressedLeft && !this.#isPressedRight) {
            return -1 * Math.PI / 2;
        }
        else if (this.#player.direction === "up") {
            return Math.PI / 2;
        }
        else if (this.#player.direction === "down") {
            return -1 * Math.PI / 2;
        }
        else if (this.#player.direction === "right") {
            return Math.PI / 4;
        }
        else if (this.#player.direction === "left") {
            return Math.PI * 3 / 4;
        }
        throw new Error("想定外の入力");
    }
    
    #forceDirection() {
        let horizontal = "none";
        let vertical = "none";
    
        if (this.#isPressedLeft && !this.#isPressedRight) {
            horizontal = "left";
        }
        else if (!this.#isPressedLeft && this.#isPressedRight) {
            horizontal = "right";
        }
    
        if (this.#isPressedUp && !this.#isPressedDown) {
            vertical = "up";
        }
        else if (!this.#isPressedUp && this.#isPressedDown) {
            vertical = "down";
        }
        
        return {horizontal, vertical};
    }
    
    #updateDescription() {
        let text = "";
        if (this.#isMapMode) {
            text =  "↑↓←→:マップ移動";
        }
        else switch (this.#player.actStatus) {
            case "ground":
                text =  "X:ジャンプ Z:フックショット ←→:移動\n";
                text += "フックは↑↓←→で方向が決められる";
                break;
            case "furiko":
                text = "X:ジャンプ Z:フックを外す ↑:ワイヤージャンプ ↓:ワイヤーを伸ばす ←→:揺らす";
                break;
            case "jumping":
            case "falling":
                text = "Z:フックショット ←→:移動\n";
                text += "フックは↑↓←→で方向が決められる";
                break;
            case "furiko-ground":
                text = "X:ジャンプ Z:フックを外す ↑:ワイヤージャンプ ←→:移動";
                break;
            case "furiko-jumping":
            case "furiko-falling":
                text = "Z:フックを外す ←→:移動";
                break;
        }
        // DOMを頻繁に更新したくない ＆ 範囲選択させたい
        if (controlsDescriptionDom.innerText !== text) {
            controlsDescriptionDom.innerText = text;
        }
    }

    #updateText() {
        context.save();

        const time = this.#goalTime === -1 ? new Date() - this.#startTime : this.#goalTime;
        const timeText = formatMilliseconds(time);
        context.font = "900 30px sans-serif";
        context.textBaseline = "top";
        context.fillStyle = "#000000";
        context.strokeStyle = "#FFFFFF";
        context.lineWidth = 5;
        drawStrokeText(context, timeText, 20, 20);

        const helpText = "HELP! (Hキー)";
        context.font = "900 20px sans-serif";
        context.fillStyle = "#FF0000";
        context.strokeStyle = "#FFCCCC";
        drawStrokeText(context, helpText, canvas.width - 160, canvas.height - 40);

        context.restore();

        if (this.#player.isGoal && this.#goalTime === -1) {
            this.#goalTime = time;
            const strOldGoalTime = Cookies.get("goal_time");
            if (strOldGoalTime === undefined) {
                Cookies.set("goal_time", String(time), {expires: 365, path: cookiePath});
            }
            else {
                const oldGoalTime = Number(strOldGoalTime);
                if (time < oldGoalTime) {
                    Cookies.set("goal_time", String(time), {expires: 365, path: cookiePath});
                }
            }
        }
    }
}
